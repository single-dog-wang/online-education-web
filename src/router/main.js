import index from '@/views/main/index'
import welcome from '@/views/main/welcome'
import users from '@/views/main/users/users'
import rights from '@/views/main/rights/rights'
import roles from '@/views/main/rights/roles'

export default [
  {
    path: '/main',
    component: index,
    redirect: '/main/welcome',
    children: [
      { path: 'welcome', component: welcome },
      { path: 'users', component: users },
      { path: 'rights', component: rights },
      { path: 'roles', component: roles },
    ]
  }
]
