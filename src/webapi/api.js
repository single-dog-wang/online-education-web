import axios from 'axios'

// 自定义axios的规则，并创建一个axios实例
const instance = axios.create({
  // 会在请求的url前面，拼接基础路径baseURL
  baseURL: 'http://127.0.0.1:8888/api/private/v1',
  // 请求的超时时间，超过时间请求自动断开，单位/毫秒
  timeout: 5000,
  // 请求发送数据是以json字符串的格式
  headers: { 'content-type': 'application/json' }
})

// 请求拦截器
// 除了登录请求，其他的请求发送到后台，必须要在请求头中添加
// 键值对：key---Authorization value--token值（登录成功，服务器返回的token值）
// instance.interceptors.request.use(request => {
//   // console.log(request) 当前拦截的请求对象request

//   // 在请求对象request上面，添加一个键值对：key---Authorization value--token值
//   request.headers.Authorization = sessionStorage.getItem('token')
//   // 必须返回请求对象request
//   return request
// })

export default instance
