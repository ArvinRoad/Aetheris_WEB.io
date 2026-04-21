/**
 * 项目: 渊枢 (Aetheris)
 * 功能: Axios 请求封装工具
 * 作用: 统一处理请求、响应、Token 自动携带、接口格式化
 * 适配: Rust Axum 后端统一 ApiResponse 结构
 */

import axios from 'axios'

// 创建 axios 实例，对接 Rust 后端
const request = axios.create({
    baseURL: 'http://localhost:3000', // 你的 Rust 后端地址（端口不对可改）
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json;charset=utf-8'
    }
})

// 请求拦截器：自动在请求头携带 JWT Token
request.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        console.error('请求拦截器错误：', error)
        return Promise.reject(error)
    }
)

// 响应拦截器：统一解析后端返回的 ApiResponse 格式
request.interceptors.response.use(
    (response) => {
        // 直接返回后端的响应体（已解包 data）
        return response.data
    },
    (error) => {
        console.error('响应拦截器错误：', error)
        // 统一错误提示
        alert('接口请求失败，请检查网络或后端服务')
        return Promise.reject(error)
    }
)

export default request