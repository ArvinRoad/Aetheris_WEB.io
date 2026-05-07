/**
 * 项目: 渊枢 (Aetheris)
 * 功能: 登录页
 * 包含: 账号密码登录、表单校验、注册跳转、登录态存储、弹窗提示
 * 对接: Rust Axum 后端 /login 接口
 * @author SongYuChen
 * @version 1.0.0
 */

<template>
    <div class="fullscreen-lock">
        <div class="login-container" ref="loginContainerRef">
            <div class="login-bg"></div>
            <div class="login-panel">
                <!-- 动态六边形品牌图标（带旋转动画） -->
                <div class="metatron-icon"></div>
                <h1 class="login-title">渊枢 · Aetheris</h1>
                <p class="login-subtitle">Enter the Aether Realm</p>

                <!-- 登录错误提示框 -->
                <div class="error-tip" v-if="errorMsg">{{ errorMsg }}</div>

                <!-- 登录表单：提交时触发handleLogin，阻止默认提交行为 -->
                <form class="login-form" @submit.prevent="handleLogin">
                    <div class="form-item">
                        <label class="form-label">账号</label>
                        <input 
                            type="text" 
                            class="login-input" 
                            placeholder="请输入账号" 
                            v-model="username"
                            :disabled="isLoading"
                            @input="clearError"
                            @blur="checkUsernameOnBlur"
                        />
                    </div>
                    <div class="form-item">
                        <label class="form-label">密码</label>
                        <input 
                            type="password" 
                            class="login-input" 
                            placeholder="请输入密码" 
                            v-model="password"
                            :disabled="isLoading"
                            @input="clearError"
                        />
                    </div>
                    
                    <!-- 登录按钮：加载中/空值时禁用 -->
                    <button 
                        type="submit" 
                        class="login-btn"
                        :disabled="isLoading || !username || !password"
                    >
                        <span v-if="!isLoading">登录</span>
                        <span v-else class="loading">接入中...</span>
                    </button>
                </form>

                <!-- 注册跳转链接 -->
                <div class="login-footer">
                    <span>还没有账号？</span>
                    <a href="javascript:;" class="footer-link" @click="goRegister">创建以太账号</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    // 导入Vue核心API
    import { ref, onMounted, onUnmounted, onErrorCaptured } from 'vue';
    import { useRouter } from 'vue-router';
    import * as authModule from '@/api/auth';
    
    // 异常处理：接口不存在时使用空实现，防止组件崩溃
    const loginApi = authModule.loginApi || (() => Promise.reject({ msg: '登录接口模块未配置' }));

    // 响应式数据定义
    const router = useRouter();           // 路由实例
    const loginContainerRef = ref(null);  // 登录容器DOM引用
    const username = ref('');             // 账号输入值
    const password = ref('');             // 密码输入值
    const isLoading = ref(false);         // 登录请求加载状态
    const errorMsg = ref('');             // 错误提示信息

    /**
     * 全局错误捕获：过滤组件内常见错误，避免控制台爆红
     * @param {Error} err - 错误对象
     * @param {Object} instance - 组件实例
     * @param {String} info - 错误信息
     * @returns {Boolean} - 是否阻止错误向上传播
     */
    onErrorCaptured((err, instance, info) => {
        console.error('组件内部错误捕获：', err.message, info);
        // 过滤空值读取/异步组件相关错误，给出友好提示
        if (err.message.includes('Cannot read properties of null') || 
            err.message.includes('Suspense')) {
            errorMsg.value = '页面加载异常，请刷新重试';
            return false; // 阻止错误向上传播
        }
        return true;
    });

    /**
     * 清除错误提示：输入框触发输入时清空错误信息
     */
    const clearError = () => {
        if (errorMsg.value) errorMsg.value = '';
    };

    // 输入框失去焦点时校验邮箱
    const checkUsernameOnBlur = () => {
        const account = username.value?.trim();
        if (account && account.includes('@')) {
            errorMsg.value = '请使用用户名登录，请勿使用邮箱';
        }
    };

    /**
     * 登录核心逻辑：表单校验 → 接口调用 → 结果处理
     * 全量异常捕获，确保任何错误都不会导致页面崩溃
     */
    const handleLogin = async () => {
        // 1. 表单空值校验
        if (!username.value?.trim()) {
            errorMsg.value = '请输入账号';
            return;
        }
        if (!password.value?.trim()) {
            errorMsg.value = '请输入密码';
            return;
        }

        // 拦截邮箱，提示使用用户名登录
        const account = username.value.trim();
        if (account.includes('@')) {
            errorMsg.value = '请使用用户名登录，请勿使用邮箱';
            return;
        }

        try {
            isLoading.value = true;
            clearError(); // 清空历史错误提示

            // 2. 调用后端登录接口
            const res = await loginApi({
                username: username.value.trim(),
                password: password.value.trim()
            });

            if (res && res.data && res.data.code === 200) {
                // 登录成功：存储Token + 跳转到论坛首页 /forum
                const token = res.data.data?.token || '';
                if (token) localStorage.setItem('token', token);
                
                // 路由跳转异常捕获，避免跳转失败导致流程中断
                await router.push('/forum').catch(err => {
                    console.warn('首页跳转失败：', err);
                    errorMsg.value = '登录成功，但页面跳转失败，请手动刷新';
                });
            } else {
                // 登录失败：显示后端返回的错误信息
                errorMsg.value = res?.data?.message || '登录失败，请检查账号密码';
            }
        } catch (err) {
            console.error('登录接口调用异常：', err);
            if (err.response?.status === 401) {
                errorMsg.value = '账号或密码错误，请重新输入';
            } 
            else if (err.message?.includes('ERR_CONNECTION_REFUSED')) {
                errorMsg.value = '后端服务未启动，请先运行Rust Axum服务（端口8080）';
            } else if (err.message?.includes('Network Error')) {
                errorMsg.value = '网络连接异常，请检查网络或后端服务状态';
            } else if (err.message?.includes('loginApi is not a function')) {
                errorMsg.value = '登录接口未正确配置，请检查/api/auth文件';
            } else {
                errorMsg.value = '登录失败：账号或密码不正确';
            }
        } finally {
            // 无论成功/失败，都重置加载状态 + 清空密码
            isLoading.value = false;
            password.value = '';
        }
    };

    /**
     *  注册跳转逻辑：跳转到注册页
     */
    const goRegister = () => {
        try {
            router.push('/register'); // 【修改】从弹窗改成路由跳转
        } catch (err) {
            console.warn('注册页跳转失败：', err);
        }
    };

    /**
     * 页面挂载钩子：锁定页面滚动（防止背景滚动）
     * 兼容移动端触摸滚动阻止
     */
    onMounted(() => {
        try {
            if (document?.body) {
                document.body.style.overflow = 'hidden';
                document.documentElement.style.overflow = 'hidden';
                // 移动端滚动阻止（兼容passive模式，capture提高优先级）
                document.addEventListener('touchmove', preventTouchMove, { 
                    passive: false, 
                    capture: true 
                });
            }
        } catch (err) {
            console.warn('挂载时滚动锁定失败：', err);
        }
    });

    /**
     * 页面卸载钩子：清理所有资源，避免内存泄漏
     * 1. 清空敏感数据 2. 恢复滚动 3. 移除事件监听 4. 清理DOM事件残留
     */
    onUnmounted(() => {
        try {
            // 清空敏感数据
            username.value = '';
            password.value = '';
            errorMsg.value = '';

            // 恢复页面滚动
            if (document?.body) {
                document.body.style.overflow = '';
                document.documentElement.style.overflow = '';
                document.removeEventListener('touchmove', preventTouchMove, { capture: true });
            }

            // 清理DOM事件残留（克隆节点方式）
            const container = loginContainerRef.value;
            if (container) {
                const elements = container.querySelectorAll('*');
                elements.forEach(el => {
                    try {
                        if (el && el.parentNode) {
                            const clone = el.cloneNode(true);
                            el.parentNode.replaceChild(clone, el);
                        }
                    } catch (e) { /* 静默失败，不影响主流程 */ }
                });
            }
        } catch (err) {
            console.warn('卸载时资源清理失败：', err);
        }
    });

    /**
     * 移动端触摸滚动阻止：防止登录页在移动端上下滑动
     * 异常捕获：部分浏览器阻止默认行为会报错，静默处理
     * @param {Event} e - 触摸事件对象
     */
    const preventTouchMove = (e) => {
        try {
            e.preventDefault();
        } catch (err) { /* 静默处理兼容性错误 */ }
    };
</script>

<style scoped>
    /* 全屏锁死容器：禁用滚动和交互，覆盖整个视口 */
    .fullscreen-lock {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        height: -webkit-fill-available !important; /* 兼容iOS视口高度 */
        overflow: hidden !important;
        background: #080810 !important;
        z-index: 9999 !important;
        touch-action: none !important;
        -webkit-overflow-scrolling: touch !important;
    }

    /* 全局样式重置：统一html/body样式，禁用滚动 */
    :global(html), :global(body) {
        margin: 0 !important;
        padding: 0 !important;
        overflow: hidden !important;
        background: #080810 !important;
        height: 100% !important;
        width: 100% !important;
        touch-action: none !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    /* 登录容器：居中展示登录面板，背景渐变效果 */
    .login-container {
        width: 100% !important;
        height: 100% !important;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #080810 !important;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        margin: 0 !important;
        padding: 0 !important;
        overflow: hidden !important;
        z-index: 1;
        user-select: none !important; /* 禁用文本选择 */
        -webkit-user-select: none !important;
    }

    /* 登录背景渐变：双层径向渐变，增强视觉层次 */
    .login-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at 20% 30%, rgba(31,21,51,0.3) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(200,200,255,0.1) 0%, transparent 40%);
        z-index: 1;
    }

    /* 登录面板：半透明磨砂玻璃效果，自适应宽度 */
    .login-panel {
        width: 90% !important;
        max-width: 380px;
        padding: 40px 30px;
        background: rgba(16,16,28,0.85);
        backdrop-filter: blur(12px); /* 磨砂玻璃效果 */
        -webkit-backdrop-filter: blur(12px); /* 兼容webkit内核 */
        border: 1px solid rgba(226,226,248,0.15);
        border-radius: 12px;
        text-align: left !important;
        z-index: 2;
        box-sizing: border-box !important;
        pointer-events: auto !important;
    }

    /* 六边形品牌图标：带线性渐变+旋转动画 */
    .metatron-icon {
        width: 60px;
        height: 60px;
        margin: 0 auto 20px;
        background: linear-gradient(45deg, #E2E2F8, #C8C8FF);
        /* SVG遮罩实现六边形形状 */
        -webkit-mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50 5 L85 25 L85 75 L50 95 L15 75 L15 25 Z" fill="white"/></svg>') center/100% no-repeat;
        mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50 5 L85 25 L85 75 L50 95 L15 75 L15 25 Z" fill="white"/></svg>') center/100% no-repeat;
        animation: rotate 15s linear infinite; /* 匀速旋转动画 */
    }

    /* 登录标题样式 */
    .login-title {
        color: #E2E2F8;
        font-size: 24px;
        margin-bottom: 8px;
        line-height: 1.2;
        text-align: center !important;
        margin-top: 0;
    }

    /* 登录副标题样式 */
    .login-subtitle {
        color: #C8C8FF;
        opacity: 0.7;
        margin-bottom: 30px;
        font-size: 14px;
        text-align: center !important;
        margin-top: 0;
    }

    /* 错误提示框：红色系，醒目且不刺眼 */
    .error-tip {
        padding: 8px 12px;
        background: rgba(255, 77, 77, 0.15);
        border: 1px solid rgba(255, 77, 77, 0.3);
        border-radius: 8px;
        color: #ff4d4d;
        font-size: 12px;
        margin-bottom: 20px;
        text-align: center;
    }

    /* 表单项容器：统一间距和宽度 */
    .form-item {
        margin-bottom: 20px;
        width: 100%;
        box-sizing: border-box;
    }

    /* 表单标签样式 */
    .form-label {
        display: block;
        color: #E2E2F8;
        font-size: 14px;
        margin-bottom: 8px;
        font-weight: 500;
    }

    /* 登录输入框：深色背景+浅色系边框，聚焦时有高亮效果 */
    .login-input {
        width: 100%;
        padding: 14px 15px;
        background: rgba(8,8,16,0.8);
        border: 1px solid rgba(226,226,248,0.2);
        border-radius: 8px;
        color: #E2E2F8;
        box-sizing: border-box !important;
        font-size: 14px;
        outline: none !important;
        transition: border-color 0.3s ease;
    }

    /* 输入框占位符样式 */
    .login-input::placeholder {
        color: rgba(226,226,248,0.5);
    }

    /* 输入框聚焦样式：边框高亮+轻微发光效果 */
    .login-input:focus {
        border-color: #C8C8FF;
        box-shadow: 0 0 8px rgba(200,200,255,0.1);
    }

    /* 输入框禁用样式 */
    .login-input:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    /* 登录按钮：渐变背景+hover/active效果，禁用态降透明度 */
    .login-btn {
        width: 100%;
        padding: 14px 0;
        background: linear-gradient(90deg, #1F1533, #2A1E40);
        border: 1px solid rgba(200,200,255,0.3);
        border-radius: 8px;
        color: #E2E2F8;
        cursor: pointer;
        margin-bottom: 20px;
        outline: none !important;
        transition: all 0.3s ease;
        font-size: 16px;
        font-weight: 500;
        text-align: center;
    }

    /* 按钮hover效果：加深渐变+边框高亮 */
    .login-btn:hover:not(:disabled) {
        background: linear-gradient(90deg, #2A1E40, #352850);
        border-color: rgba(200,200,255,0.5);
        box-shadow: 0 0 10px rgba(200,200,255,0.1);
    }

    /* 按钮点击效果：轻微缩放 */
    .login-btn:active {
        transform: scale(0.98);
    }

    /* 按钮禁用样式 */
    .login-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        transform: none;
    }

    /* 加载中文字样式 */
    .loading {
        font-size: 14px;
        color: rgba(226,226,248,0.8);
    }

    /* 底部注册链接容器：居中展示 */
    .login-footer {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 5px;
        gap: 5px;
    }

    /* 底部文本样式 */
    .login-footer span {
        color: rgba(226,226,248,0.7);
        font-size: 14px;
    }

    /* 注册链接样式：hover变色+下划线 */
    .footer-link {
        color: #C8C8FF;
        font-size: 14px;
        opacity: 1;
        text-decoration: none !important;
        transition: color 0.3s ease;
    }

    /* 链接hover效果 */
    .footer-link:hover {
        color: #E2E2F8;
        text-decoration: underline !important;
    }

    /* 六边形旋转动画：匀速360度旋转 */
    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    /* 移动端适配：缩小间距和尺寸，适配小屏设备 */
    @media screen and (max-width: 768px), (max-height: 800px) {
        .fullscreen-lock {
            position: fixed !important;
            height: 100vh !important;
            min-height: -webkit-fill-available !important;
        }

        .login-panel {
            padding: 30px 20px;
            margin: 0 10px;
        }

        .metatron-icon {
            width: 50px;
            height: 50px;
        }

        .login-title {
            font-size: 20px;
        }

        .login-input {
            padding: 12px 12px;
        }

        .login-btn {
            padding: 12px 0;
            font-size: 15px;
        }
    }

    /* iPhone 14 Pro Max 适配：修复视口高度问题 */
    @media screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) {
        .fullscreen-lock {
            height: 100vh !important;
            height: -webkit-fill-available !important;
        }

        .login-container {
            height: -webkit-fill-available !important;
        }
    }

    /* 全局禁用：文本选择、拖拽、触摸操作 */
    * {
        -webkit-touch-callout: none !important;
        -webkit-user-drag: none !important;
        user-drag: none !important;
        touch-action: none !important;
    }
</style>