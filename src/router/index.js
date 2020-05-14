import Vue from 'vue'
import VueRouter from 'vue-router'
import auth from './auth'
import main from './main'

Vue.use(VueRouter)
const router = new VueRouter({
  routes: [...auth, ...main]
})

// beforeEach是VueRouter的生命周期函数
// 在所有路由跳转之前，会触发
router.beforeEach((to, from, next) => {
  // to，是一个route路由对象，包含了将要跳转页面的路由信息
  // from，是一个route路由对象，包含了跳转到当前页面的路由信息
  // next，是一个函数，主要是决定是否要跳转的路由跳转（放行）

  // 如果是将要跳转到login登录页面，则直接放行
  if (to.path === '/auth/login') return next()

  // 如果是将要跳转到其他页面（除了login登录页面），则需要检查服务器传入的token令牌
  const token = sessionStorage.getItem('token')
  // 如果token不存在，强制跳转到登录页面
  if (!token) return next('/auth/login')
  // 如果token存在，直接放行
  next()
})

export default router
