import { useEffect, useState } from 'react'
import axiosInstance from '../api/base'
import { useAuth } from '../hooks/useAuth'
import type { Employee } from '../models/employee'
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  Avatar,
} from '@mui/material'
import EmailIcon from '@mui/icons-material/Email'
import PhoneIcon from '@mui/icons-material/Phone'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import WorkIcon from '@mui/icons-material/Work'
import BusinessIcon from '@mui/icons-material/Business'
import ApartmentIcon from '@mui/icons-material/Apartment'
import CalendarTodayIcon from '@mui/icons-material/CalendarToday'

export default function Profile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Employee | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    axiosInstance
      .get(`employees/${user.employee_id}/`)
      .then((res) => setProfile(res.data.data.object_info))
      .catch(() => setError('Failed to load profile'))
      .finally(() => setLoading(false))
  }, [user.employee_id])

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
        <CircularProgress />
      </Box>
    )

  if (error) return <Alert severity="error">{error}</Alert>
  if (!profile) return <Alert severity="warning">Profile not found</Alert>

  return (
    <Box sx={{ maxWidth: 600, margin: '40px auto' }}>
      <Card sx={{ borderRadius: 3, boxShadow: 4 }}>
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
            <Avatar
              sx={{
                width: 72,
                height: 72,
                background: '#1e1e2e',
                fontSize: 28,
              }}
            >
              {profile.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                {profile.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {profile.title}
              </Typography>
              <Chip
                label={profile.is_active ? 'Active' : 'Inactive'}
                color={profile.is_active ? 'success' : 'error'}
                size="small"
                sx={{ mt: 0.5 }}
              />
            </Box>
          </Box>

          <Divider sx={{ mb: 3 }} />

          {/* Info Grid */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <EmailIcon sx={{ color: '#1e1e2e' }} />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="body1">{profile.email}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <PhoneIcon sx={{ color: '#1e1e2e' }} />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Mobile
                </Typography>
                <Typography variant="body1">{profile.mobile || '—'}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <LocationOnIcon sx={{ color: '#1e1e2e' }} />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Address
                </Typography>
                <Typography variant="body1">
                  {profile.address || '—'}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <BusinessIcon sx={{ color: '#1e1e2e' }} />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Company
                </Typography>
                <Typography variant="body1">{profile.company_name}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <ApartmentIcon sx={{ color: '#1e1e2e' }} />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Department
                </Typography>
                <Typography variant="body1">
                  {profile.department_name}
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <CalendarTodayIcon sx={{ color: '#1e1e2e' }} />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Hire Date
                </Typography>
                <Typography variant="body1">{profile.hire_date}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <WorkIcon sx={{ color: '#1e1e2e' }} />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Days Employed
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                  {profile.days_employed} days
                </Typography>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}
