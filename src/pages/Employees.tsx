/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react'
import {
  getEmployeesAPI,
  createEmployeeAPI,
  updateEmployeeAPI,
  deleteEmployeeAPI,
  updateEmployeeStatusAPI,
} from '../api/employees'
import { getCompaniesAPI } from '../api/companies'
import { getDepartmentsAPI } from '../api/departments'
import { useAuth } from '../hooks/useAuth'
import type { Employee } from '../models/employee'
import type { Company } from '../models/company'
import type { Department } from '../models/department'
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

export default function Employees() {
  const { user, isHRManager } = useAuth()

  const [employees, setEmployees] = useState<Employee[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [showModal, setShowModal] = useState(false)
  const [editEmployee, setEditEmployee] = useState<Employee | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState('')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [title, setTitle] = useState('')
  const [mobile, setMobile] = useState('')
  const [address, setAddress] = useState('')
  const [companyId, setCompanyId] = useState<number | ''>('')
  const [departmentId, setDepartmentId] = useState<number | ''>('')

  const validateEmail = (value: string) =>
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)

  const validateMobile = (value: string) => /^\+?[0-9\s\-()]{7,20}$/.test(value)

  const COMMON_PASSWORDS = new Set([
    'password',
    'password123',
    '12345678',
    '123456789',
    'qwerty',
    'admin',
    'letmein',
  ])

  const validateEmployeePassword = (
    pw: string,
    fullName: string,
    userEmail: string,
  ): string => {
    const p = pw ?? ''
    if (!p.trim()) return 'Password is required'
    if (p.length < 8) return 'Password must be at least 8 characters'
    if (/^\d+$/.test(p)) return "Password can’t be entirely numeric"

    const lower = p.toLowerCase()
    if (COMMON_PASSWORDS.has(lower)) return 'Password is too common'

    const emailLocal = (userEmail.split('@')[0] || '').toLowerCase()
    const nameCompact = (fullName || '').trim().toLowerCase().replace(/\s+/g, '')
    if (
      (emailLocal && emailLocal.length >= 3 && lower.includes(emailLocal)) ||
      (nameCompact && nameCompact.length >= 3 && lower.includes(nameCompact))
    ) {
      return 'Password is too similar to your personal information'
    }

    return ''
  }

  const fetchEmployees = (p = 1) => {
    setLoading(true)
    getEmployeesAPI(p, isHRManager ? user.company_id : undefined)
      .then((res) => {
        setEmployees(res.data.list_items)
        setTotalPages(res.data.total_pages)
      })
      .catch(() => setError('Failed to load employees'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchEmployees(page)
    getCompaniesAPI(1)
      .then((res) => setCompanies(res.data.list_items))
      .catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, isHRManager, user.company_id])

  // fetch departments when companyId changes only in create mode
  useEffect(() => {
    if (companyId && !editEmployee) {
      getDepartmentsAPI(companyId as number)
        .then((res) => {
          setDepartments(res.data.list_items)
          setDepartmentId('')
        })
        .catch(() => {})
    } else if (!companyId) {
      setDepartments([])
      setDepartmentId('')
    }
  }, [companyId, editEmployee])

  const openCreate = () => {
    setEditEmployee(null)
    setName('')
    setEmail('')
    setPassword('')
    setPasswordError('')
    setTitle('')
    setMobile('')
    setAddress('')
    setDepartments([])
    setDepartmentId('')
    setFormError('')
    const defaultCompany = isHRManager ? user.company_id : ''
    setCompanyId(defaultCompany)
    if (defaultCompany) {
      getDepartmentsAPI(defaultCompany as number)
        .then((res) => setDepartments(res.data.list_items))
        .catch(() => {})
    }
    setShowModal(true)
  }

  const openEdit = (employee: Employee) => {
    setEditEmployee(employee)
    setName(employee.name)
    setEmail(employee.email)
    setPassword('')
    setPasswordError('')
    setTitle(employee.title)
    setMobile(employee.mobile)
    setAddress(employee.address)
    setCompanyId(employee.company_id)
    setFormError('')
    setShowModal(true)

    getDepartmentsAPI(employee.company_id)
      .then((res) => {
        setDepartments(res.data.list_items)
        setDepartmentId(employee.department_id)
      })
      .catch(() => {})
  }

  const closeModal = () => {
    setShowModal(false)
    setFormError('')
    setPasswordError('')
    setEditEmployee(null)
    setDepartments([])
  }

  const handleCompanyChange = (value: number) => {
    setCompanyId(value)
    setDepartmentId('')
    if (value) {
      getDepartmentsAPI(value)
        .then((res) => setDepartments(res.data.list_items))
        .catch(() => {})
    } else {
      setDepartments([])
    }
  }

  const handleSubmit = async () => {
    if (!name.trim()) return setFormError('Name is required')
    if (!email.trim()) return setFormError('Email is required')
    if (!validateEmail(email)) return setFormError('Invalid email format')
    if (!editEmployee) {
      const msg = validateEmployeePassword(password, name, email)
      setPasswordError(msg)
      if (msg) return setFormError(msg)
    }
    if (!title.trim()) return setFormError('Title is required')
    if (mobile && !validateMobile(mobile))
      return setFormError('Invalid mobile number')
    if (!companyId) return setFormError('Company is required')
    if (!departmentId) return setFormError('Department is required')

    try {
      setFormLoading(true)
      if (editEmployee) {
        await updateEmployeeAPI(editEmployee.id, {
          name,
          email,
          title,
          mobile,
          address,
          department_id: departmentId as number,
        })
        toast.success('Employee updated successfully')
      } else {
        await createEmployeeAPI({
          name,
          email,
          password,
          title,
          mobile,
          address,
          company_id: companyId as number,
          department_id: departmentId as number,
        })
        toast.success('Employee created successfully')
      }
      closeModal()
      fetchEmployees(page)
    } catch (err: unknown) {
      const errors = (
        err as {
          response?: { data?: { details?: { errors?: { error: string }[] } } }
        }
      ).response?.data?.details?.errors
      setFormError(errors?.[0]?.error || 'Something went wrong')
    } finally {
      setFormLoading(false)
    }
  }

  const handleToggleStatus = async (emp: Employee) => {
    try {
      await updateEmployeeStatusAPI(emp.id, !emp.is_active)
      toast.success(
        `Employee ${emp.is_active ? 'deactivated' : 'activated'} successfully`,
      )
      fetchEmployees(page)
    } catch (err: unknown) {
      const errors = (
        err as {
          response?: { data?: { details?: { errors?: { error: string }[] } } }
        }
      ).response?.data?.details?.errors
      toast.error(errors?.[0]?.error || 'Failed to update status')
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this employee?'))
      return
    try {
      await deleteEmployeeAPI(id)
      toast.success('Employee deleted successfully')
      fetchEmployees(page)
    } catch (err: unknown) {
      const errors = (
        err as {
          response?: { data?: { details?: { errors?: { error: string }[] } } }
        }
      ).response?.data?.details?.errors
      toast.error(errors?.[0]?.error || 'Failed to delete employee')
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
          Employees
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreate}
          sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
        >
          Add Employee
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
              <TableHead sx={{ bgcolor: 'primary.main' }}>
                <TableRow>
                  <TableCell sx={{ color: 'white' }}>#</TableCell>
                  <TableCell sx={{ color: 'white' }}>Name</TableCell>
                  <TableCell sx={{ color: 'white' }}>Email</TableCell>
                  <TableCell sx={{ color: 'white' }}>Title</TableCell>
                  <TableCell sx={{ color: 'white' }}>Company</TableCell>
                  <TableCell sx={{ color: 'white' }}>Department</TableCell>
                  <TableCell sx={{ color: 'white' }}>Days Employed</TableCell>
                  <TableCell sx={{ color: 'white' }}>Status</TableCell>
                  <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {employees.map((emp, index) => (
                  <TableRow key={emp.id} hover>
                    <TableCell>{(page - 1) * 10 + index + 1}</TableCell>
                    <TableCell>{emp.name}</TableCell>
                    <TableCell>{emp.email}</TableCell>
                    <TableCell>{emp.title}</TableCell>
                    <TableCell>{emp.company_name}</TableCell>
                    <TableCell>{emp.department_name}</TableCell>
                    <TableCell>{emp.days_employed} days</TableCell>
                    <TableCell>
                      <Chip
                        label={emp.is_active ? 'Active' : 'Inactive'}
                        color={emp.is_active ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => openEdit(emp)}
                        size="small"
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleToggleStatus(emp)}
                        size="small"
                        color={emp.is_active ? 'warning' : 'success'}
                      >
                        {emp.is_active ? <ToggleOffIcon /> : <ToggleOnIcon />}
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(emp.id)}
                        size="small"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
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
        <DialogTitle>
          {editEmployee ? 'Edit Employee' : 'Add Employee'}
        </DialogTitle>
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

          {!editEmployee && (
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => {
                const next = e.target.value
                setPassword(next)
                setPasswordError(validateEmployeePassword(next, name, email))
              }}
              error={Boolean(passwordError)}
              helperText={passwordError}
              margin="normal"
              size="small"
            />
          )}

          <TextField
            fullWidth
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            margin="normal"
            size="small"
          />

          <TextField
            fullWidth
            label="Mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            margin="normal"
            size="small"
          />

          <TextField
            fullWidth
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            margin="normal"
            size="small"
          />

          {!isHRManager && (
            <FormControl fullWidth margin="normal" size="small">
              <InputLabel>Company</InputLabel>
              <Select
                value={companyId}
                label="Company"
                onChange={(e) => handleCompanyChange(Number(e.target.value))}
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

          <FormControl
            fullWidth
            margin="normal"
            size="small"
            disabled={!companyId}
          >
            <InputLabel>Department</InputLabel>
            <Select
              value={departmentId}
              label="Department"
              onChange={(e) => setDepartmentId(Number(e.target.value))}
            >
              <MenuItem value="">Select Department</MenuItem>
              {departments.map((d) => (
                <MenuItem key={d.id} value={d.id}>
                  {d.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

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
            sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
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
