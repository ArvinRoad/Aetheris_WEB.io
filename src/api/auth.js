/**
 * 项目: 渊枢 (Aetheris)
 * 功能: 认证相关接口封装
 * @author SongYuChen
 * @version 1.0.0
 */

import axios from 'axios';

// 创建axios实例（统一配置基础路径）
const request = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 登录接口
export const loginApi = (data) => {
  return request.post('/api/auth/login', data);
};

// 注册接口
export const registerApi = (data) => {
  return request.post('/api/auth/register', data);
};

// 用户信息接口
export const getMeApi = () => {
  // 请求时携带Token
  return request.get('/me', {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
  });
};