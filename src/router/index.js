/**
 * 项目：渊枢 (Aetheris)
 * 功能：全局路由管理 + 登录态权限守卫
 * 包含：主页、登录页路由配置，全局登录校验守卫
 * 对接：前端 localStorage token 校验、Rust Axum 后端登录态
 * @author SongYuChen
 * @version 1.0.0
 */

import { createRouter, createWebHistory } from 'vue-router';
import Aetheris from '@/views/Aetheris.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import ForumIndex from '@/views/ForumIndex.vue'; // 新增论坛首页

const routes = [
  // 核心：根路径指向3D首页
  {
    path: '/',
    name: 'Aetheris',
    component: Aetheris
  },
  // 登录页路径
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  // 注册页路径
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  // 论坛首页（登录成功进入）
  {
    path: '/forum',
    name: 'ForumIndex',
    component: ForumIndex
  },
  // 404重定向到首页
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;