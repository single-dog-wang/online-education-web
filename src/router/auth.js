import login from '@/views/auth/login'

export default [
  {
    path: '/',
    redirect: '/auth/login'
  },
  {
    path: '/auth/login',
    component: login
  }
]
