import { useEffect, useState } from 'react'
import {
  getCompaniesAPI,
  createCompanyAPI,
  updateCompanyAPI,
  deleteCompanyAPI,
} from '../api/companies'
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
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
  Pagination,
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import toast from 'react-hot-toast'

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [showModal, setShowModal] = useState(false)
  const [editCompany, setEditCompany] = useState<Company | null>(null)
  const [name, setName] = useState('')
  const [formError, setFormError] = useState('')
  const [formLoading, setFormLoading] = useState(false)

  const fetchCompanies = (p = 1) => {
    setLoading(true)
    getCompaniesAPI(p)
      .then((res) => {
        setCompanies(res.data.list_items)
        setTotalPages(res.data.total_pages)
      })
      .catch(() => setError('Failed to load companies'))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCompanies(page)
  }, [page])

  const openCreate = () => {
    setEditCompany(null)
    setName('')
    setFormError('')
    setShowModal(true)
  }

  const openEdit = (company: Company) => {
    setEditCompany(company)
    setName(company.name)
    setFormError('')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setName('')
    setFormError('')
    setEditCompany(null)
  }

  const handleSubmit = async () => {
    if (!name.trim()) return setFormError('Company name is required')
    try {
      setFormLoading(true)
      if (editCompany) {
        await updateCompanyAPI(editCompany.id, name)
        toast.success('Company updated successfully')
      } else {
        await createCompanyAPI(name)
        toast.success('Company created successfully')
      }
      closeModal()
      fetchCompanies(page)
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
    if (!window.confirm('Are you sure you want to delete this company?')) return
    try {
      await deleteCompanyAPI(id)
      toast.success('Company deleted successfully')
      fetchCompanies(page)
    } catch (err: unknown) {
      const errors = (
        err as {
          response?: { data?: { details?: { errors?: { error: string }[] } } }
        }
      ).response?.data?.details?.errors
      toast.error(errors?.[0]?.error || 'Failed to delete company')
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
          Companies
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={openCreate}
          sx={{ background: '#1e1e2e' }}
        >
          Add Company
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
                  <TableCell sx={{ color: 'white' }}>Status</TableCell>
                  <TableCell sx={{ color: 'white' }}>Created At</TableCell>
                  <TableCell sx={{ color: 'white' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {companies.map((company, index) => (
                  <TableRow key={company.id} hover>
                    <TableCell>{(page - 1) * 10 + index + 1}</TableCell>
                    <TableCell>{company.name}</TableCell>
                    <TableCell>
                      <Chip
                        label={company.is_active ? 'Active' : 'Inactive'}
                        color={company.is_active ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {new Date(company.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => openEdit(company)}
                        size="small"
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleDelete(company.id)}
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
          {editCompany ? 'Edit Company' : 'Add Company'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Company Name"
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
