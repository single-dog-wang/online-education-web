import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import '@/assets/css/global.css'
import webapi from './webapi'

// 把webapi组件添加到Vue函数对象的原型上
// (axios,不是Vue.js的第三方插件，不能使用Vue.use()全局注册，只能在原型添加)
Vue.prototype.$webapi = webapi

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
