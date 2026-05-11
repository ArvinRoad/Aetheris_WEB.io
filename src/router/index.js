/**
 * 项目：渊枢 (Aetheris)
 * 功能：全局路由管理 + 全站登录态权限守卫
 * 包含：主页、登录页、注册页、论坛页、学术回廊、关于页路由配置
 * 规则：除首页/登录/注册外，所有页面必须登录才能访问
 * 对接：前端 localStorage token 校验、Rust Axum 后端登录态
 * @author SongYuChen
 * @version 1.0.2
 */

import { createRouter, createWebHistory } from 'vue-router';
import Aetheris from '@/views/Aetheris.vue';
import Login from '@/views/Login.vue';
import Register from '@/views/Register.vue';
import ForumIndex from '@/views/ForumIndex.vue';
import Academy from '@/views/Academy.vue';
import About from '@/views/About.vue';

const routes = [
  // 核心：根路径指向3D首页
  {
    path: '/',
    name: 'Aetheris',
    component: Aetheris,
    meta: { requiresAuth: false } // 无需登录
  },
  // 登录页路径
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false } // 无需登录
  },
  // 注册页路径
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { requiresAuth: false } // 无需登录
  },
  // 论坛首页（登录成功进入）
  {
    path: '/forum',
    name: 'ForumIndex',
    component: ForumIndex,
    meta: { requiresAuth: true } // 必须登录才能访问
  },
  // 学术回廊（必须登录）
  {
    path: '/academy',
    name: 'Academy',
    component: Academy,
    meta: { requiresAuth: true } // 必须登录才能访问
  },
  // 关于渊枢（必须登录）
  {
    path: '/about',
    name: 'About',
    component: About,
    meta: { requiresAuth: true } // 必须登录才能访问
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

// 全局前置守卫 - 统一登录态拦截
router.beforeEach((to, from, next) => {
  // 从本地存储获取登录凭证
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  // 规则1：访问需要登录的页面，但未登录 → 跳转到登录页
  if (to.meta.requiresAuth && !isLoggedIn) {
    next('/login');
    return;
  }

  // 规则2：已登录用户访问登录/注册页 → 自动跳转到论坛
  if ((to.path === '/login' || to.path === '/register') && isLoggedIn) {
    next('/forum');
    return;
  }

  // 规则3：其他所有情况正常放行
  next();
});

export default router;