/**
 * 项目: 渊枢 (Aetheris)
 * 功能: 论坛首页
 * 包含: 顶部全局导航、英雄沉浸式首屏、论坛帖子流式卡片、PC/移动端全适配
 * 风格: 高端神秘 / 暗宇宙虚空 / 磨砂玻璃 / 极简艺术留白
 * 参考布局: dishisancengart.com
 * @author SongYuChen
 * @version 1.0.0
 */

<template>
  <div class="forum-fullscreen">
    <!-- 全局深空背景 -->
    <div class="forum-bg"></div>

    <!-- 顶部固定导航栏（修复了 :class 语法） -->
    <header :class="headerClasses">
      <div class="nav-container">
        <!-- Logo + 项目名称 -->
        <div class="nav-brand">
          <div class="metatron-icon"></div>
          <span class="brand-text">渊枢 · Aetheris</span>
        </div>

        <!-- PC端导航菜单 -->
        <nav class="nav-menu pc-menu">
          <a href="/" class="menu-item active">首页</a>
          <a href="/forum" class="menu-item">以太论坛</a>
          <a href="/academy" class="menu-item">学术回廊</a>
          <a href="/about" class="menu-item">关于渊枢</a>
        </nav>

        <!-- 右侧登录/注册 / 退出登录 -->
        <div class="nav-action pc-action">
          <template v-if="isLoggedIn">
            <a class="action-link" @click="logout">退出登录</a>
          </template>
          <template v-else>
            <a href="/login" class="action-link">登录</a>
            <a href="/register" class="action-link register-btn">创建账号</a>
          </template>
        </div>

        <!-- 移动端汉堡按钮 -->
        <div class="hamburger" @click="toggleMobileMenu">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </div>
      </div>
    </header>

    <!-- 移动端侧边菜单遮罩 -->
    <div class="mobile-mask" v-if="showMobileMenu" @click="toggleMobileMenu"></div>
    <!-- 移动端侧边菜单 -->
    <div class="mobile-menu" :class="{ show: showMobileMenu }">
      <div class="mobile-menu-inner">
        <a href="/" class="mobile-item active" @click="toggleMobileMenu">首页</a>
        <a href="/forum" class="mobile-item" @click="toggleMobileMenu">以太论坛</a>
        <a href="/academy" class="mobile-item" @click="toggleMobileMenu">学术回廊</a>
        <a href="/about" class="mobile-item" @click="toggleMobileMenu">关于渊枢</a>
        <div class="mobile-divider"></div>
        
        <template v-if="isLoggedIn">
          <a class="mobile-item" @click="logout">退出登录</a>
        </template>
        <template v-else>
          <a href="/login" class="mobile-item" @click="toggleMobileMenu">登录</a>
          <a href="/register" class="mobile-item" @click="toggleMobileMenu">创建以太账号</a>
        </template>
      </div>
    </div>

    <!-- 英雄首屏区域 -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">踏入以太虚空</h1>
        <p class="hero-subtitle">Enter the Aether Realm</p>
        <p class="hero-desc">思想在此沉寂交汇，文明于深空悄然延续</p>
      </div>
      <!-- 向下指引暗示 -->
      <div class="scroll-guide">
        <div class="guide-line"></div>
        <span>向下探索</span>
      </div>
    </section>

    <!-- 论坛帖子列表区域 -->
    <section class="forum-section">
      <div class="section-wrap">
        <div class="section-head">
          <h2 class="section-title">最新以太论题</h2>
          <p class="section-desc">静默阅览 · 理性思辨 · 学术共生</p>
        </div>

        <div class="card-grid">
          <!-- 帖子卡片 1 -->
          <div class="post-card">
            <div class="card-img"></div>
            <div class="card-body">
              <h3 class="card-title">虚空架构与思想边界初探</h3>
              <p class="card-desc">探讨抽象思想在虚拟空间中的存在形式与延伸维度...</p>
              <div class="card-footer">
                <span class="card-tag">学术思辨</span>
                <span class="card-time">2026-05-07</span>
              </div>
            </div>
          </div>

          <!-- 帖子卡片 2 -->
          <div class="post-card">
            <div class="card-img"></div>
            <div class="card-body">
              <h3 class="card-title">Web4.0 去中心化学术生态构想</h3>
              <p class="card-desc">基于区块链与AI共建的私有学术交流新模式...</p>
              <div class="card-footer">
                <span class="card-tag">技术构想</span>
                <span class="card-time">2026-05-06</span>
              </div>
            </div>
          </div>

          <!-- 帖子卡片 3 -->
          <div class="post-card">
            <div class="card-img"></div>
            <div class="card-body">
              <h3 class="card-title">暗物质美学与界面设计语言</h3>
              <p class="card-desc">以深空、神秘、极简为内核的高端视觉设计逻辑...</p>
              <div class="card-footer">
                <span class="card-tag">美学设计</span>
                <span class="card-time">2026-05-05</span>
              </div>
            </div>
          </div>

          <!-- 帖子卡片 4 -->
          <div class="post-card">
            <div class="card-img"></div>
            <div class="card-body">
              <h3 class="card-title">Rust 后端架构分层实践记录</h3>
              <p class="card-desc">DDD领域驱动设计在Axum项目中的落地与规范...</p>
              <div class="card-footer">
                <span class="card-tag">开发日志</span>
                <span class="card-time">2026-05-04</span>
              </div>
            </div>
          </div>

          <!-- 帖子卡片 5 -->
          <div class="post-card">
            <div class="card-img"></div>
            <div class="card-body">
              <h3 class="card-title">人与AI平等共生的思想平台价值</h3>
              <p class="card-desc">打破单向输出，构建双向共创的学术思想圈层...</p>
              <div class="card-footer">
                <span class="card-tag">理念思考</span>
                <span class="card-time">2026-05-03</span>
              </div>
            </div>
          </div>

          <!-- 帖子卡片 6 -->
          <div class="post-card">
            <div class="card-img"></div>
            <div class="card-body">
              <h3 class="card-title">极简主义下的留白叙事美学</h3>
              <p class="card-desc">少即是多，克制的设计自带高级与神秘感...</p>
              <div class="card-footer">
                <span class="card-tag">人文美学</span>
                <span class="card-time">2026-05-02</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 页脚 -->
    <footer class="forum-footer">
      <div class="footer-inner">
        <p class="footer-slogan">Enter the Aether Realm · 踏入以太虚空</p>
        <p class="footer-copyright">© 2026 渊枢 Aetheris 私有学术思想交流平台</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// 移动端菜单状态
const showMobileMenu = ref(false);
// 导航栏滚动状态
const isScrolled = ref(false);
// 登录状态
const isLoggedIn = ref(false);

// 检查登录状态
const checkLoginStatus = () => {
  const token = localStorage.getItem('token');
  isLoggedIn.value = !!token;
};

// 退出登录
const logout = () => {
  localStorage.removeItem('token');
  isLoggedIn.value = false;
  router.push('/');
};

// 导航栏类名（用计算属性消除 TS 误报）
const headerClasses = computed(() => ({
  'nav-header': true,
  'nav-scrolled': isScrolled.value
}));

// 切换移动端菜单
const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value;
};

// 滚动监听
const handleScroll = () => {
  isScrolled.value = window.scrollY > 60;
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
  checkLoginStatus(); // 进入页面检查登录状态
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped>
/* 全局根容器 */
.forum-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  height: -webkit-fill-available;
  overflow-x: hidden;
  overflow-y: auto;
  background: #080810;
  z-index: 1;
  touch-action: none;
  -webkit-overflow-scrolling: touch;
}

/* 深空背景渐变 */
.forum-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 15% 20%, rgba(31,21,51,0.35) 0%, transparent 45%),
    radial-gradient(circle at 85% 75%, rgba(200,200,255,0.12) 0%, transparent 45%);
  z-index: -1;
}

/* 顶部导航栏 */
.nav-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  padding: 18px 0;
  z-index: 999;
  transition: all 0.4s ease;
  background: transparent;
}

/* 滚动后导航磨砂加深 */
.nav-header.nav-scrolled {
  background: rgba(8,8,16,0.75);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(226,226,248,0.08);
  padding: 15px 0;
}

.nav-container {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 品牌Logo区域 */
.nav-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.metatron-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(45deg, #E2E2F8, #C8C8FF);
  -webkit-mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50 5 L85 25 L85 75 L50 95 L15 75 L15 25 Z" fill="white"/></svg>') center/100% no-repeat;
  mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M50 5 L85 25 L85 75 L50 95 L15 75 L15 25 Z" fill="white"/></svg>') center/100% no-repeat;
  animation: rotate 15s linear infinite;
}

.brand-text {
  font-size: 17px;
  color: #E2E2F8;
  letter-spacing: 1px;
  font-weight: 500;
}

/* PC端导航菜单 */
.pc-menu {
  display: flex;
  gap: 36px;
}

.menu-item {
  color: rgba(226,226,248,0.75);
  font-size: 15px;
  text-decoration: none;
  transition: all 0.3s ease;
  letter-spacing: 0.5px;
}

.menu-item:hover,
.menu-item.active {
  color: #C8C8FF;
}

/* PC端右侧操作 */
.pc-action {
  display: flex;
  align-items: center;
  gap: 20px;
}

.action-link {
  color: rgba(226,226,248,0.75);
  font-size: 15px;
  text-decoration: none;
  transition: color 0.3s ease;
  cursor: pointer;
}

.action-link:hover {
  color: #E2E2F8;
}

.register-btn {
  padding: 7px 16px;
  border: 1px solid rgba(200,200,255,0.25);
  border-radius: 6px;
  color: #C8C8FF;
  transition: all 0.3s ease;
}

.register-btn:hover {
  background: rgba(200,200,255,0.08);
  border-color: rgba(200,200,255,0.4);
}

/* 汉堡按钮 默认PC隐藏 */
.hamburger {
  display: none;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
}

.bar {
  width: 26px;
  height: 2px;
  background: #E2E2F8;
  border-radius: 1px;
  transition: 0.3s;
}

/* 移动端遮罩 */
.mobile-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.55);
  z-index: 1000;
}

/* 移动端侧边菜单 */
.mobile-menu {
  position: fixed;
  top: 0;
  right: 0;
  width: 280px;
  height: 100vh;
  background: rgba(16,16,28,0.92);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border-left: 1px solid rgba(226,226,248,0.1);
  z-index: 1001;
  transform: translateX(100%);
  transition: transform 0.4s ease;
}

.mobile-menu.show {
  transform: translateX(0);
}

.mobile-menu-inner {
  padding: 80px 30px;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

.mobile-item {
  color: rgba(226,226,248,0.8);
  font-size: 16px;
  text-decoration: none;
  transition: color 0.3s;
  cursor: pointer;
}

.mobile-item.active {
  color: #C8C8FF;
}

.mobile-divider {
  height: 1px;
  background: rgba(226,226,248,0.1);
  margin: 10px 0;
}

/* 英雄首屏 */
.hero-section {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 0 20px;
  box-sizing: border-box;
}

.hero-title {
  font-size: 42px;
  color: #E2E2F8;
  font-weight: 500;
  margin: 0 0 12px;
  letter-spacing: 6px;
}

.hero-subtitle {
  font-size: 16px;
  color: rgba(200,200,255,0.65);
  margin: 0 0 18px;
  letter-spacing: 2px;
}

.hero-desc {
  font-size: 14px;
  color: rgba(226,226,248,0.55);
  max-width: 500px;
  line-height: 1.8;
  margin: 0;
}

/* 向下滚动指引 */
.scroll-guide {
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: rgba(226,226,248,0.45);
  font-size: 12px;
}

.guide-line {
  width: 1px;
  height: 40px;
  background: linear-gradient(to bottom, transparent, rgba(226,226,248,0.4));
  animation: scrollLine 2.5s ease-in-out infinite;
}

/* 论坛主体区域 */
.forum-section {
  padding: 100px 0 80px;
}

.section-wrap {
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
}

.section-head {
  text-align: center;
  margin-bottom: 60px;
}

.section-title {
  font-size: 28px;
  color: #E2E2F8;
  font-weight: 500;
  letter-spacing: 3px;
  margin: 0 0 10px;
}

.section-desc {
  font-size: 14px;
  color: rgba(226,226,248,0.55);
  margin: 0;
}

/* 卡片网格布局 */
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

/* 帖子卡片 */
.post-card {
  background: rgba(16,16,28,0.7);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border: 1px solid rgba(226,226,248,0.12);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.35s ease;
}

.post-card:hover {
  transform: translateY(-6px);
  border-color: rgba(200,200,255,0.25);
  box-shadow: 0 10px 30px rgba(200,200,255,0.08);
}

.card-img {
  width: 100%;
  height: 180px;
  background: radial-gradient(circle at center, rgba(31,21,51,0.4), transparent 70%);
}

.card-body {
  padding: 22px;
}

.card-title {
  font-size: 16px;
  color: #E2E2F8;
  margin: 0 0 12px;
  font-weight: 500;
  line-height: 1.5;
}

.card-desc {
  font-size: 13px;
  color: rgba(226,226,248,0.55);
  line-height: 1.7;
  margin: 0 0 18px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-tag {
  font-size: 12px;
  color: #C8C8FF;
  padding: 3px 10px;
  border: 1px solid rgba(200,200,255,0.18);
  border-radius: 4px;
}

.card-time {
  font-size: 12px;
  color: rgba(226,226,248,0.45);
}

/* 页脚 */
.forum-footer {
  padding: 50px 20px;
  text-align: center;
  border-top: 1px solid rgba(226,226,248,0.08);
}

.footer-slogan {
  font-size: 14px;
  color: rgba(200,200,255,0.6);
  margin: 0 0 8px;
  letter-spacing: 1px;
}

.footer-copyright {
  font-size: 12px;
  color: rgba(226,226,248,0.4);
  margin: 0;
}

/* 动画 */
@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes scrollLine {
  0% { opacity: 0.3; transform: scaleY(0.8); }
  50% { opacity: 1; transform: scaleY(1.1); }
  100% { opacity: 0.3; transform: scaleY(0.8); }
}

/* 移动端适配 */
@media screen and (max-width: 900px) {
  .pc-menu, .pc-action {
    display: none;
  }
  .hamburger {
    display: flex;
  }
  .card-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .hero-title {
    font-size: 32px;
    letter-spacing: 4px;
  }
}

@media screen and (max-width: 600px) {
  .card-grid {
    grid-template-columns: 1fr;
  }
  .hero-title {
    font-size: 26px;
    letter-spacing: 2px;
  }
  .section-title {
    font-size: 24px;
  }
  .nav-container {
    width: 92%;
  }
}
</style>