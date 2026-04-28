import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { AppBar, Toolbar, Typography, Button, Box, Chip } from '@mui/material'
import BusinessIcon from '@mui/icons-material/Business'
import PeopleIcon from '@mui/icons-material/People'
import ApartmentIcon from '@mui/icons-material/Apartment'
import PersonIcon from '@mui/icons-material/Person'
import LogoutIcon from '@mui/icons-material/Logout'
import DashboardIcon from '@mui/icons-material/Dashboard'
import PeopleAltIcon from '@mui/icons-material/PeopleAlt'
import eBenLogo from '../../eBen-Logo.png'

export default function Navbar() {
  const navigate = useNavigate()
  const { user, isSystemAdmin, isHRManager, isEmployee } = useAuth()

  const handleLogout = () => {
    localStorage.clear()
    navigate('/login')
  }

  return (
    <AppBar position="static" sx={{ bgcolor: 'primary.main' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            component="img"
            src={eBenLogo}
            alt="eBen logo"
            sx={{ width: 52, height: 52, objectFit: 'contain', mr: 2 }}
          />

          {(isSystemAdmin || isHRManager) && (
            <Button
              component={Link}
              to="/dashboard"
              color="inherit"
              startIcon={<DashboardIcon />}
            >
              Dashboard
            </Button>
          )}
          {(isSystemAdmin || isHRManager) && (
            <Button
              component={Link}
              to="/users"
              color="inherit"
              startIcon={<PeopleAltIcon />}
            >
              Users
            </Button>
          )}
          {isSystemAdmin && (
            <Button
              component={Link}
              to="/companies"
              color="inherit"
              startIcon={<BusinessIcon />}
            >
              Companies
            </Button>
          )}

          {(isSystemAdmin || isHRManager) && (
            <Button
              component={Link}
              to="/departments"
              color="inherit"
              startIcon={<ApartmentIcon />}
            >
              Departments
            </Button>
          )}

          {(isSystemAdmin || isHRManager) && (
            <Button
              component={Link}
              to="/employees"
              color="inherit"
              startIcon={<PeopleIcon />}
            >
              Employees
            </Button>
          )}

          {isEmployee && (
            <Button
              component={Link}
              to="/profile"
              color="inherit"
              startIcon={<PersonIcon />}
            >
              My Profile
            </Button>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2">{user.email}</Typography>
          <Chip
            label={user.role}
            size="small"
            sx={{ bgcolor: 'primary.dark', color: 'white' }}
          />
          <Button
            color="inherit"
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  )
}
