import Vue from 'vue'
// 按需加载element-ui组件
import { Button, Form, FormItem, Input, Message } from 'element-ui'

// 全局挂载element-ui组件
// 方式一：Vue.use() ---全局注册组件
// 方式二：Vue.prototype ---在Vue函数对象的原型上添加
Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message
