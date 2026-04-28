export const useAuth = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const token = localStorage.getItem('access_token')

  return {
    user,
    token,
    isSystemAdmin: user.role === 'SYSTEM_ADMINISTRATOR',
    isHRManager: user.role === 'HR_MANAGER',
    isEmployee: user.role === 'EMPLOYEE',
  }
}