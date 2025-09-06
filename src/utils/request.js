// src/utils/request.js
import axios from 'axios'
import {showToast} from 'vant'

import router  from '../router'
// 创建 axios 实例
const service = axios.create({
  baseURL: '/', // 开发环境下用代理，直接写 / 就行
  timeout: 10000, // 超时时间
})

// 请求拦截器
service.interceptors.request.use(
  (config) => {
      config.headers['security-flag']= "sec"
    // 这里可以统一加 token
    const token = localStorage.getItem('token')
    if (token) {
      config.headers['Token'] = `${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
  
    
    if(response.data.code === 8000){
       // 清理本地 token
      localStorage.removeItem('token')

        // 提示用户，3秒自动关闭
      showToast({
        message: '登录已过期，请重新登录',
        duration: 3000, // 3 秒
      });

      // 3秒后跳转到登录页
      setTimeout(() => {
        router.replace('/login');
      }, 3000);

      // 阻止后续代码执行
      return Promise.reject(new Error('登录过期'))
    }else{
      return response.data
    }
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
