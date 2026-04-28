import { useEffect, useState } from 'react'
import {
  getDepartmentsAPI,
  createDepartmentAPI,
  updateDepartmentAPI,
  deleteDepartmentAPI,
} from '../api/departments'
import { getCompaniesAPI } from '../api/companies'
import { useAuth } from '../hooks/useAuth'
import type { Department } from '../models/department'
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
import toast from 'react-hot-toast'

export default function Departments() {
  const { user, isHRManager } = useAuth()

  const [departments, setDepartments] = useState<Department[]>([])
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [showModal, setShowModal] = useState(false)
  const [editDepartment, setEditDepartment] = useState<Department | null>(null)
  const [name, setName] = useState('')
  const [companyId, setCompanyId] = useState<number | ''>('')
  const [formError, setFormError] = useState('')
  const [formLoading, setFormLoading] = useState(false)

  const fetchDepartments = (p = 1) => {
    setLoading(true)
    getDepartmentsAPI(isHRManager ? user.company_id : undefined, p)
      .then((res) => {
        setDepartments(res.data.list_items)
        setTotalPages(res.data.total_pages)
      })
      .catch(() => setError('Failed to load departments'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchDepartments(page)
    getCompaniesAPI(1)
      .then((res) => setCompanies(res.data.list_items))
      .catch(() => {})
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, isHRManager])

  const openCreate = () => {
    setEditDepartment(null)
    setName('')
    setCompanyId(isHRManager ? user.company_id : '')
    setFormError('')
    setShowModal(true)
  }

  const openEdit = (department: Department) => {
    setEditDepartment(department)
    setName(department.name)
    setCompanyId(department.company_id)
    setFormError('')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setName('')
    setCompanyId('')
    setFormError('')
    setEditDepartment(null)
  }

  const handleSubmit = async () => {
    if (!name.trim()) return setFormError('Department name is required')
    if (!companyId) return setFormError('Company is required')
    try {
      setFormLoading(true)
      if (editDepartment) {
        await updateDepartmentAPI(editDepartment.id, name, companyId as number)
        toast.success('Department updated successfully')
      } else {
        await createDepartmentAPI(name, companyId as number)
        toast.success('Department created successfully')
      }
      closeModal()
      fetchDepartments(page)
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

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return
    try {
      await deleteDepartmentAPI(id)
      toast.success('Department deleted successfully')
      fetchDepartments(page)
    } catch (err: unknown) {
      const errors = (
        err as {
          response?: { data?: { details?: { errors?: { error: string }[] } } }
        }
      ).response?.data?.details?.errors
      toast.error(errors?.[0]?.error || 'Failed to delete department')
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
          Departments
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreate}
          sx={{ bgcolor: 'primary.main', '&:hover': { bgcolor: 'primary.dark' } }}
        >
          Add Department
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
                  <TableCell sx={{ color: 'white' }}>Company</TableCell>
                  <TableCell sx={{ color: 'white' }}>Created At</TableCell>
                  <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {departments.map((dept, index) => (
                  <TableRow key={dept.id} hover>
                    <TableCell>{(page - 1) * 10 + index + 1}</TableCell>
                    <TableCell>{dept.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={dept.company_name}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(dept.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => openEdit(dept)}
                        size="small"
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(dept.id)}
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
          {editDepartment ? 'Edit Department' : 'Add Department'}
        </DialogTitle>
        <DialogContent>
          {!isHRManager && (
            <FormControl fullWidth margin="normal" size="small">
              <InputLabel>Company</InputLabel>
              <Select
                value={companyId}
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

          <TextField
            fullWidth
            label="Department Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
            size="small"
          />

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