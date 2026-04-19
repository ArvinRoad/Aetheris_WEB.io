/**
 * 项目: 渊枢 (Aetheris)
 * 功能: Aetheris 登陆页面
 * 终极修复：彻底解决可拖动、底部白框、模拟器适配问题
 */

<template>
    <!-- 新增最外层全屏遮罩，彻底封死滚动/拖动 -->
    <div class="fullscreen-lock">
        <div class="login-container" ref="loginContainerRef">
            <div class="login-bg"></div>
            <div class="login-panel">
                <div class="metatron-icon"></div>
                <h1 class="login-title">渊枢 · Aetheris</h1>
                <p class="login-subtitle">Enter the Aether Realm</p>

                <input type="text" class="login-input" placeholder="以太账号" v-model="username" />
                <input type="password" class="login-input" placeholder="以太密钥" v-model="password" />
                <button class="login-btn" @click="handleLogin">接入以太</button>

                <div class="login-footer">
                    <a href="#" class="footer-link">忘记密钥</a>
                    <a href="#" class="footer-link">创建以太账号</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, onUnmounted } from 'vue';
    import { useRouter } from 'vue-router';

    const router = useRouter();
    const username = ref('');
    const password = ref('');
    const loginContainerRef = ref(null);

    const handleLogin = () => {
        if (!username.value || !password.value) return;
        router.push('/');
    };

    // 挂载后立即禁用所有滚动/拖动行为
    onMounted(() => {
        document.body.style.overflow = 'hidden';
        document.documentElement.style.overflow = 'hidden';
        // 禁用触摸拖动
        document.addEventListener('touchmove', preventTouchMove, { passive: false });
    });

    // 卸载时恢复（可选，根据项目需求）
    onUnmounted(() => {
        const container = loginContainerRef.value;
        if (container) {
            const elements = container.querySelectorAll('*');
            elements.forEach(el => {
                const clone = el.cloneNode(true);
                el.parentNode.replaceChild(clone, el);
            });
        }
        document.removeEventListener('touchmove', preventTouchMove);
        username.value = '';
        password.value = '';
    });

    // 阻止触摸拖动的核心函数
    const preventTouchMove = (e) => {
        e.preventDefault();
    };
</script>

<style scoped>
    /* 最外层锁死：覆盖整个屏幕，禁用所有交互滚动 */
    .fullscreen-lock {
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        width: 100vw !important;
        height: 100vh !important;
        overflow: hidden !important;
        background: #080810 !important;
        z-index: 9999 !important; /* 最高层级，避免被覆盖 */
        touch-action: none !important; /* 禁用所有触摸行为 */
        -webkit-overflow-scrolling: touch !important; /* 禁用移动端弹性滚动 */
    }

    /* 全局终极重置：干掉所有默认边距/滚动 */
    :root, body, html {
        margin: 0 !important;
        padding: 0 !important;
        overflow: hidden !important;
        background: #080810 !important;
        height: 100% !important;
        width: 100% !important;
        touch-action: none !important;
    }

    /* 核心容器：完全贴边，无任何偏移 */
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
        /* 禁用选择/拖动 */
        user-select: none !important;
        -webkit-user-select: none !important;
    }

    .login-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: radial-gradient(circle at 20% 30%, rgba(31,21,51,0.3) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(200,200,255,0.1) 0%, transparent 40%);
        z-index: 1;
    }

    /* 登录面板：精准适配，无溢出 */
    .login-panel {
        width: 90% !important;
        max-width: 380px;
        padding: 40px 30px;
        background: rgba(16,16,28,0.85);
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
        border: 1px solid rgba(226,226,248,0.15);
        border-radius: 12px;
        text-align: center;
        z-index: 2;
        box-sizing: border-box !important;
        /* 防止面板被拖动 */
        pointer-events: auto !important;
    }

    .metatron-icon {
        width: 60px;
        height: 60px;
        margin: 0 auto 20px;
        background: linear-gradient(45deg, #E2E2F8, #C8C8FF);
        -webkit-mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50 10 L90 30 L90 70 L50 90 L10 70 L10 30Z M50 20 L80 35 L80 65 L50 80 L20 65 L20 35Z M50 30 L70 40 L70 60 L50 70 L30 60 L30 40Z" fill="white"/><circle cx="50" cy="50" r="15" fill="white"/></svg>') center/100% no-repeat;
        mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50 10 L90 30 L90 70 L50 90 L10 70 L10 30Z M50 20 L80 35 L80 65 L50 80 L20 65 L20 35Z M50 30 L70 40 L70 60 L50 70 L30 60 L30 40Z" fill="white"/><circle cx="50" cy="50" r="15" fill="white"/></svg>') center/100% no-repeat;
        animation: rotate 15s linear infinite;
    }

    .login-title {
        color: #E2E2F8;
        font-size: 24px;
        margin-bottom: 8px;
        line-height: 1.2;
    }

    .login-subtitle {
        color: #C8C8FF;
        opacity: 0.7;
        margin-bottom: 30px;
        font-size: 14px;
    }

    .login-input {
        width: 100%;
        padding: 12px 15px;
        margin-bottom: 16px;
        background: rgba(8,8,16,0.6);
        border: 1px solid rgba(226,226,248,0.2);
        border-radius: 8px;
        color: #E2E2F8;
        box-sizing: border-box !important;
        font-size: 14px;
        outline: none !important;
    }

        .login-input::placeholder {
            color: rgba(226,226,248,0.5);
        }

    .login-btn {
        width: 100%;
        padding: 12px 0;
        background: linear-gradient(90deg, #1F1533, #2A1E40);
        border: 1px solid rgba(200,200,255,0.3);
        border-radius: 8px;
        color: #E2E2F8;
        cursor: pointer;
        margin-bottom: 20px;
        outline: none !important;
        transition: all 0.3s ease;
    }

        .login-btn:hover {
            background: linear-gradient(90deg, #2A1E40, #352850);
            border-color: rgba(200,200,255,0.5);
        }

        .login-btn:active {
            transform: scale(0.98);
        }

    .login-footer {
        display: flex;
        justify-content: space-between;
        padding: 0 5px;
    }

    .footer-link {
        color: #C8C8FF;
        font-size: 12px;
        opacity: 0.7;
        text-decoration: none !important;
    }

        .footer-link:hover {
            opacity: 1;
        }

    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }

        to {
            transform: rotate(360deg);
        }
    }

    /* 移动端终极适配 */
    @media screen and (max-width: 768px), (max-height: 800px) {
        .fullscreen-lock {
            position: fixed !important;
            height: 100vh !important;
            min-height: -webkit-fill-available !important; /* 兼容移动端视口高度 */
        }

        .login-panel {
            padding: 30px 20px;
            margin: 0 10px; /* 避免贴边 */
        }

        .metatron-icon {
            width: 50px;
            height: 50px;
        }

        .login-title {
            font-size: 20px;
        }

        .login-input {
            padding: 10px 12px;
        }

        .login-btn {
            padding: 10px 0;
        }
    }

    /* 针对iPhone模拟器的特殊修复 */
    @media screen and (device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) {
        .fullscreen-lock {
            height: 100vh !important;
            height: -webkit-fill-available !important;
        }

        .login-container {
            height: -webkit-fill-available !important;
        }
    }

    /* 禁用所有元素的拖动行为 */
    * {
        -webkit-touch-callout: none !important;
        -webkit-user-drag: none !important;
        user-drag: none !important;
        touch-action: none !important;
    }
</style>