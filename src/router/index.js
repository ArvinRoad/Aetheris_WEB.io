/**
 * 项目：渊枢 (Aetheris)
 * 功能：全局路由管理
 */
import { createRouter, createWebHistory } from 'vue-router';
import Aetheris from '../views/Aetheris.vue';
import Login from '../views/Login.vue';

const routes = [
    { path: '/', component: Aetheris },
    { path: '/login', component: Login }
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes
});

export default router;