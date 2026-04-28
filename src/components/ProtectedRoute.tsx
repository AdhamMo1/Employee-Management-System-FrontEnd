import { Navigate } from 'react-router-dom'
import Navbar from './Navbar'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('access_token')

  if (!token) {
    return <Navigate to='/login' />
  }

  return (
    <>
      <Navbar />
      <div style={{ padding: 24 }}>
        {children}
      </div>
    </>
  )
}