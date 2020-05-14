import axios from 'axios'

// 自定义axios的规则，并创建一个axios实例
export default axios.create({
  // 会在请求的url前面，拼接基础路径baseURL
  baseURL: 'http://127.0.0.1:8888/api/private/v1',
  // 请求的超时时间，超过时间请求自动断开，单位/毫秒
  timeout: 5000,
  // 请求发送数据是以json字符串的格式
  headers: { 'content-type': 'application/json' }
})
