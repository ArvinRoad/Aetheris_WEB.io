/**
 * 项目：渊枢 (Aetheris)
 * 功能：Vue3 应用入口文件
 */
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

const app = createApp(App);
app.use(router);

if (import.meta.env.PROD) {
    app.config.devtools = false;
}

app.mount('#app');