// src/utils/request.js
import axios from 'axios'

// 创建 axios 实例
const service = axios.create({
  baseURL: '/', // 开发环境下用代理，直接写 / 就行
  timeout: 10000, // 超时时间
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 这里可以统一加 token
    const token = '586e55dc6188484c8aebb13d9f552292'
    if (token) {
      config.headers['token'] = `${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    return response.data // 直接返回后端 data
  },
  (error) => {
    console.error('请求错误：', error)
    return Promise.reject(error)
  }
)

// 封装 POST 请求方法
export function post(url, data = {}, config = {}) {
  return service.post(url, data, config)
}

// 如果以后需要 GET 也能直接用
export function get(url, params = {}, config = {}) {
  return service.get(url, { params, ...config })
}

export default service
