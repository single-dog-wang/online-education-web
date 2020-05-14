import index from '@/views/main/index'
import welcome from '@/views/main/welcome'
import list from '@/views/main/users/list'

export default [
  {
    path: '/main',
    component: index,
    redirect: '/main/welcome',
    children: [
      { path: 'welcome', component: welcome },
      { path: 'users', component: list }
    ]
  }
]
