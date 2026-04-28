import { useEffect, useState, type ReactNode } from 'react'
import { getDashboardStatsAPI } from '../api/dashboard'
import type { DashboardStats } from '../api/dashboard'
import { useAuth } from '../hooks/useAuth'
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Typography,
  Alert,
} from '@mui/material'
import BusinessIcon from '@mui/icons-material/Business'
import ApartmentIcon from '@mui/icons-material/Apartment'
import PeopleIcon from '@mui/icons-material/People'
import PersonOffIcon from '@mui/icons-material/PersonOff'
import PersonIcon from '@mui/icons-material/Person'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'

interface StatCardProps {
  title: string
  value: number | string
  icon: ReactNode
  color: string
}

function StatCard({ title, value, icon, color }: StatCardProps) {
  return (
    <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="body2" color="text.secondary">{title}</Typography>
            <Typography variant="h4" sx={{ mt: 1, fontWeight: 'bold' }}>
              {typeof value === 'number' ? value.toLocaleString() : value}
            </Typography>
          </Box>
          <Box sx={{
            background: color,
            borderRadius: '50%',
            p: 1.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )
}

export default function Dashboard() {
  const { isSystemAdmin, isHRManager, user } = useAuth()

  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const company_id = isHRManager ? user?.company_id : undefined
    getDashboardStatsAPI(company_id)
      .then((res) => setStats(res.data))
      .catch((err) => {
        console.error('Error loading dashboard stats:', err)
        setError('Failed to load dashboard stats')
      })
      .finally(() => setLoading(false))
  }, [isHRManager, user?.company_id])

  if (loading)
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
        <CircularProgress />
      </Box>
    )

  if (error) return <Alert severity="error">{error}</Alert>
  if (!stats) return <Alert severity="info">No stats available</Alert>

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold' }}>Dashboard</Typography>

      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 3,
      }}>
        {isSystemAdmin && (
          <Box sx={{ flex: '1 1 280px' }}>
            <StatCard
              title="Total Companies"
              value={stats.total_companies}
              icon={<BusinessIcon sx={{ color: 'white', fontSize: 28 }} />}
              color="#1e1e2e"
            />
          </Box>
        )}

        <Box sx={{ flex: '1 1 280px' }}>
          <StatCard
            title="Total Departments"
            value={stats.total_departments}
            icon={<ApartmentIcon sx={{ color: 'white', fontSize: 28 }} />}
            color="#1565c0"
          />
        </Box>

        <Box sx={{ flex: '1 1 280px' }}>
          <StatCard
            title="Total Employees"
            value={stats.total_employees}
            icon={<PeopleIcon sx={{ color: 'white', fontSize: 28 }} />}
            color="#2e7d32"
          />
        </Box>

        <Box sx={{ flex: '1 1 280px' }}>
          <StatCard
            title="Active Employees"
            value={stats.active_employees}
            icon={<PersonIcon sx={{ color: 'white', fontSize: 28 }} />}
            color="#388e3c"
          />
        </Box>

        <Box sx={{ flex: '1 1 280px' }}>
          <StatCard
            title="Inactive Employees"
            value={stats.inactive_employees}
            icon={<PersonOffIcon sx={{ color: 'white', fontSize: 28 }} />}
            color="#c62828"
          />
        </Box>

        <Box sx={{ flex: '1 1 280px' }}>
          <StatCard
            title="Avg Days Employed"
            value={`${stats.avg_days_employed} days`}
            icon={<TrendingUpIcon sx={{ color: 'white', fontSize: 28 }} />}
            color="#f57c00"
          />
        </Box>
      </Box>
    </Box>
  )
}