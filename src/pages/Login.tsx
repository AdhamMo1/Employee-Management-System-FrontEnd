import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loginAPI } from '../api/auth'
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import toast from 'react-hot-toast'

export default function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const validateEmail = (value: string) => {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!email) return setError('Email is required')
    if (!validateEmail(email)) return setError('Invalid email format')
    if (!password) return setError('Password is required')

    try {
      setLoading(true)
      const response = await loginAPI({ email, password })

      const user = response.data.user_info
      localStorage.setItem('access_token', response.data.session.access_token)
      localStorage.setItem('refresh_token', response.data.session.refresh_token)
      localStorage.setItem('user', JSON.stringify(user))

      toast.success('Welcome back!')

      if (user.role === 'SYSTEM_ADMINISTRATOR') {
        navigate('/dashboard')
      } else if (user.role === 'HR_MANAGER') {
        navigate('/dashboard')
      } else {
        navigate('/profile')
      }
    } catch (err: unknown) {
      if (typeof err === 'object' && err !== null && 'response' in err) {
        const message =
          (err as { response: { data: { details: string } } }).response.data
            .details || 'Login failed'
        setError(message)
        toast.error(message)
      } else {
        setError('Login failed')
        toast.error('Login failed')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1e1e2e 0%, #2d2d44 100%)',
      }}
    >
      <Card sx={{ minWidth: 380, borderRadius: 3, boxShadow: 10 }}>
        <CardContent sx={{ p: 4 }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Box
              sx={{
                background: '#1e1e2e',
                borderRadius: '50%',
                p: 1.5,
                mb: 2,
              }}
            >
              <LockOutlinedIcon sx={{ color: 'white', fontSize: 28 }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              Employee Management
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to your account
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              size="small"
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              size="small"
            />

            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 3, py: 1.2, background: '#1e1e2e' }}
            >
              {loading ? (
                <CircularProgress size={22} color="inherit" />
              ) : (
                'Login'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}
