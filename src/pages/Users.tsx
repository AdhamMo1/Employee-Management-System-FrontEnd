import { useEffect, useState } from 'react'
import {
  getUsersAPI,
  createUserAPI,
  updateUserAPI,
  updateUserStatusAPI,
  deleteUserAPI,
} from '../api/users'
import { getCompaniesAPI } from '../api/companies'
import { useAuth } from '../hooks/useAuth'
import type { User, GetUsersParams } from '../models/user'
import type { Company } from '../models/company'
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import ToggleOnIcon from '@mui/icons-material/ToggleOn'
import ToggleOffIcon from '@mui/icons-material/ToggleOff'
import toast from 'react-hot-toast'

interface APIError {
  response?: {
    data?: {
      details?: {
        errors?: { error: string }[]
      }
    }
  }
}

export default function Users() {
  const { isSystemAdmin, isHRManager, user } = useAuth()

  const [users, setUsers] = useState<User[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [showModal, setShowModal] = useState(false)
  const [editUser, setEditUser] = useState<User | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState('')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('')
  const [companyId, setCompanyId] = useState<number | ''>('')

  const validateEmail = (value: string) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)

  const availableRoles = isSystemAdmin
    ? [
        { value: 'SYSTEM_ADMINISTRATOR', label: 'System Administrator' },
        { value: 'HR_MANAGER', label: 'HR Manager' },
      ]
    : [{ value: 'HR_MANAGER', label: 'HR Manager' }]

  const fetchUsers = (p = 1) => {
    setLoading(true)
    const params: GetUsersParams = { page: p }
    if (isHRManager) params.company_id = user.company_id
    getUsersAPI(params)
      .then((res) => {
        setUsers(res.data.list_items)
        setTotalPages(res.data.total_pages)
      })
      .catch(() => setError('Failed to load users'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchUsers(page)
    getCompaniesAPI(1)
      .then((res) => setCompanies(res.data.list_items))
      .catch(() => {})
  }, [page, isHRManager])

  const openCreate = () => {
    setEditUser(null)
    setName('')
    setEmail('')
    setPassword('')
    setRole(isHRManager ? 'HR_MANAGER' : '')
    setCompanyId(isHRManager ? user.company_id : '')
    setFormError('')
    setShowModal(true)
  }

  const openEdit = (u: User) => {
    setEditUser(u)
    setName(u.name)
    setEmail(u.email)
    setPassword('')
    setRole(u.role)
    setCompanyId(u.company_id || '')
    setFormError('')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setFormError('')
    setEditUser(null)
  }

  const handleSubmit = async () => {
    if (!name.trim()) return setFormError('Name is required')
    if (!email.trim()) return setFormError('Email is required')
    if (!validateEmail(email)) return setFormError('Invalid email format')
    if (!editUser && !password.trim())
      return setFormError('Password is required')
    if (!role) return setFormError('Role is required')

    try {
      setFormLoading(true)
      if (editUser) {
        await updateUserAPI(editUser.id, {
          name,
          email,
          role,
          company_id: companyId as number,
        })
        toast.success('User updated successfully')
      } else {
        await createUserAPI({
          name,
          email,
          password,
          role,
          company_id: companyId as number,
        })
        toast.success('User created successfully')
      }
      closeModal()
      fetchUsers(page)
    } catch (err: unknown) {
      const errors = (err as APIError).response?.data?.details?.errors
      setFormError(errors?.[0]?.error || 'Something went wrong')
    } finally {
      setFormLoading(false)
    }
  }

  const handleToggleStatus = async (u: User) => {
    try {
      await updateUserStatusAPI(u.id, !u.is_active)
      toast.success(
        `User ${u.is_active ? 'deactivated' : 'activated'} successfully`,
      )
      fetchUsers(page)
    } catch (err: unknown) {
      const errors = (err as APIError).response?.data?.details?.errors
      toast.error(errors?.[0]?.error || 'Failed to update status')
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    try {
      await deleteUserAPI(id)
      toast.success('User deleted successfully')
      fetchUsers(page)
    } catch (err: unknown) {
      const errors = (err as APIError).response?.data?.details?.errors
      toast.error(errors?.[0]?.error || 'Failed to delete user')
    }
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Users
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreate}
          sx={{ background: '#1e1e2e' }}
        >
          Add User
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table>
              <TableHead sx={{ background: '#1e1e2e' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white' }}>#</TableCell>
                  <TableCell sx={{ color: 'white' }}>Name</TableCell>
                  <TableCell sx={{ color: 'white' }}>Email</TableCell>
                  <TableCell sx={{ color: 'white' }}>Role</TableCell>
                  <TableCell sx={{ color: 'white' }}>Company</TableCell>
                  <TableCell sx={{ color: 'white' }}>Status</TableCell>
                  <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((u, index) => (
                  <TableRow key={u.id} hover>
                    <TableCell>{(page - 1) * 10 + index + 1}</TableCell>
                    <TableCell>{u.name}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>
                      <Chip
                        label={u.role}
                        size="small"
                        color={
                          u.role === 'SYSTEM_ADMINISTRATOR'
                            ? 'secondary'
                            : 'primary'
                        }
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{u.company_name || '—'}</TableCell>
                    <TableCell>
                      <Chip
                        label={u.is_active ? 'Active' : 'Inactive'}
                        color={u.is_active ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => openEdit(u)}
                        size="small"
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleToggleStatus(u)}
                        size="small"
                        color={u.is_active ? 'warning' : 'success'}
                      >
                        {u.is_active ? <ToggleOffIcon /> : <ToggleOnIcon />}
                      </IconButton>
                      {isSystemAdmin && (
                        <IconButton
                          onClick={() => handleDelete(u.id)}
                          size="small"
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
            />
          </Box>
        </>
      )}

      <Dialog open={showModal} onClose={closeModal} fullWidth maxWidth="sm">
        <DialogTitle>{editUser ? 'Edit User' : 'Add User'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            size="small"
          />

          <TextField
            fullWidth
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            margin="normal"
            size="small"
          />

          {!editUser && (
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              size="small"
            />
          )}

          <FormControl fullWidth margin="normal" size="small">
            <InputLabel>Role</InputLabel>
            <Select
              value={role}
              label="Role"
              onChange={(e) => {
                setRole(e.target.value)
                if (e.target.value === 'SYSTEM_ADMINISTRATOR') {
                  setCompanyId('')
                }
              }}
              disabled={isHRManager}
            >
              <MenuItem value="">Select Role</MenuItem>
              {availableRoles.map((r) => (
                <MenuItem key={r.value} value={r.value}>
                  {r.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {isSystemAdmin && (
            <FormControl
              fullWidth
              margin="normal"
              size="small"
              disabled={role === 'SYSTEM_ADMINISTRATOR'}
            >
              <InputLabel>Company</InputLabel>
              <Select
                value={role === 'SYSTEM_ADMINISTRATOR' ? '' : companyId}
                label="Company"
                onChange={(e) => setCompanyId(Number(e.target.value))}
              >
                <MenuItem value="">Select Company</MenuItem>
                {companies.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {formError && (
            <Alert severity="error" sx={{ mt: 1 }}>
              {formError}
            </Alert>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={closeModal}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={formLoading}
            sx={{ background: '#1e1e2e' }}
          >
            {formLoading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              'Save'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
