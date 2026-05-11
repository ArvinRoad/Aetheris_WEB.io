/**
 * 项目: 渊枢 (Aetheris)
 * 功能: 论坛首页
 * 包含: 顶部全局导航、英雄沉浸式首屏、论坛帖子流式卡片、PC/移动端全适配
 * 风格: 高端神秘 / 暗宇宙虚空 / 磨砂玻璃 / 极简艺术留白
 * 参考布局: dishisancengart.com
 * @author SongYuChen
 * @version 1.0.6
 * @update: 删除PC端未登录状态下的登录/注册按钮
 */

<template>
  <div class="forum-fullscreen">
    <!-- 全局深空背景 -->
    <div class="forum-bg"></div>

    <!-- 顶部固定导航栏 -->
    <header :class="headerClasses">
      <div class="nav-container">
        <!-- Logo + 项目名称 -->
        <div class="nav-brand">
          <div class="metatron-icon"></div>
          <span class="brand-text">渊枢 · Aetheris</span>
        </div>

        <!-- PC端导航菜单 -->
        <nav class="nav-menu pc-menu">
          <router-link to="/" class="menu-item">首页</router-link>
          <router-link to="/forum" class="menu-item active">以太论坛</router-link>
          <router-link to="/academy" class="menu-item">学术回廊</router-link>
          <router-link to="/about" class="menu-item">关于渊枢</router-link>
        </nav>

        <!-- PC端右侧用户区域：仅已登录时显示 -->
        <div class="nav-action pc-action">
          <!-- ✅ 删除：未登录状态下的登录/注册按钮 -->
          
          <!-- 已登录状态：显示用户头像+悬停下拉菜单 -->
          <template v-if="isLoggedIn">
            <div 
              class="user-menu-container"
              @mouseenter="handleUserMenuEnter"
              @mouseleave="handleUserMenuLeave"
            >
              <!-- 用户头像按钮 -->
              <button class="user-avatar-btn">
                <div class="user-avatar">
                  <!-- 默认头像：小尺寸梅塔特隆立方体 -->
                  <div class="metatron-small"></div>
                </div>
              </button>

              <!-- 下拉菜单：鼠标悬停显示 -->
              <div 
                class="user-dropdown-menu"
                v-show="showUserMenu"
                @click="showUserMenu = false"
              >
                <div class="dropdown-item">
                  <router-link to="/profile" class="dropdown-link">
                    <span class="icon">👤</span>
                    <span>个人中心</span>
                  </router-link>
                </div>
                <div class="dropdown-item">
                  <router-link to="/settings" class="dropdown-link">
                    <span class="icon">⚙️</span>
                    <span>设置</span>
                  </router-link>
                </div>
                <div class="dropdown-divider"></div>
                <div class="dropdown-item">
                  <button class="dropdown-btn logout-btn" @click="logout">
                    <span class="icon">🚪</span>
                    <span>退出登录</span>
                  </button>
                </div>
              </div>
            </div>
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
        <router-link to="/" class="mobile-item" @click="toggleMobileMenu">首页</router-link>
        <router-link to="/forum" class="mobile-item active" @click="toggleMobileMenu">以太论坛</router-link>
        <router-link to="/academy" class="mobile-item" @click="toggleMobileMenu">学术回廊</router-link>
        <router-link to="/about" class="mobile-item" @click="toggleMobileMenu">关于渊枢</router-link>
        
        <!-- 移动端完整用户模块（与PC端完全一致） -->
        <template v-if="isLoggedIn">
          <div class="mobile-divider"></div>
          <router-link to="/profile" class="mobile-item" @click="toggleMobileMenu">
            <span class="mobile-icon">👤</span>
            <span>个人中心</span>
          </router-link>
          <router-link to="/settings" class="mobile-item" @click="toggleMobileMenu">
            <span class="mobile-icon">⚙️</span>
            <span>设置</span>
          </router-link>
          <div class="mobile-divider"></div>
          <a class="mobile-item logout-item" @click="logout">
            <span class="mobile-icon">🚪</span>
            <span>退出登录</span>
          </a>
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
        <p class="footer-copyright">© 2026 渊枢 Aetheris 学术思想交流平台</p>
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
// 用户下拉菜单显示状态
const showUserMenu = ref(false);
// 下拉菜单隐藏定时器
let hideMenuTimer = null;

// 检查登录状态
const checkLoginStatus = () => {
  const token = localStorage.getItem('token');
  isLoggedIn.value = !!token;
};

// 退出登录
const logout = () => {
  localStorage.removeItem('token');
  isLoggedIn.value = false;
  showUserMenu.value = false; // 关闭下拉菜单
  clearTimeout(hideMenuTimer); // 清除定时器
  toggleMobileMenu(); // 关闭移动端菜单
  router.push('/');
};

// 用户菜单鼠标进入事件
const handleUserMenuEnter = () => {
  clearTimeout(hideMenuTimer); // 清除之前的隐藏定时器
  showUserMenu.value = true;
};

// 用户菜单鼠标离开事件
const handleUserMenuLeave = () => {
  hideMenuTimer = setTimeout(() => {
    showUserMenu.value = false;
  }, 200);
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
  clearTimeout(hideMenuTimer); // 组件卸载时清除定时器
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
  z-index: 9999;
  transition: all 0.4s ease;
  background: transparent;
  min-height: 72px;
}

/* 滚动后导航磨砂加深 */
.nav-header.nav-scrolled {
  background: rgba(8,8,16,0.75);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(226,226,248,0.08);
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

/* 用户菜单相关样式 */
.user-menu-container {
  position: relative;
  padding: 8px 0;
}

.user-avatar-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(16, 16, 28, 0.85);
  border: 1px solid rgba(226, 226, 248, 0.2);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  padding: 0;
}

.user-avatar-btn:hover {
  border-color: rgba(200, 200, 255, 0.5);
  box-shadow: 0 0 8px rgba(200, 200, 255, 0.1);
}

.user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 小尺寸梅塔特隆立方体图标 */
.metatron-small {
  width: 20px;
  height: 20px;
  background: linear-gradient(45deg, #E2E2F8, #C8C8FF);
  -webkit-mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><path d="M250 20 L433 125 L433 375 L250 480 L67 375 L67 125 Z M250 80 L375 150 L375 350 L250 420 L125 350 L125 150 Z M250 140 L317 175 L317 325 L250 360 L183 325 L183 175 Z M250 200 L283 217 L283 283 L250 300 L217 283 L217 217 Z"/></svg>') center/100% no-repeat;
  mask: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500"><path d="M250 20 L433 125 L433 375 L250 480 L67 375 L67 125 Z M250 80 L375 150 L375 350 L250 420 L125 350 L125 150 Z M250 140 L317 175 L317 325 L250 360 L183 325 L183 175 Z M250 200 L283 217 L283 283 L250 300 L217 283 L217 217 Z"/></svg>') center/100% no-repeat;
}

/* 下拉菜单 */
.user-dropdown-menu {
  position: absolute;
  top: calc(100% - 1px);
  right: 0;
  min-width: 180px;
  background: rgba(16, 16, 28, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(226, 226, 248, 0.15);
  border-radius: 8px;
  padding: 8px 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  z-index: 10000;
  animation: dropdownFadeIn 0.2s ease;
}

@keyframes dropdownFadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.dropdown-item {
  width: 100%;
}

.dropdown-link, .dropdown-btn {
  width: 100%;
  padding: 10px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  color: #E2E2F8;
  font-size: 14px;
  text-decoration: none;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.dropdown-link:hover, .dropdown-btn:hover {
  background: rgba(226, 226, 248, 0.1);
}

.dropdown-divider {
  height: 1px;
  background: rgba(226, 226, 248, 0.1);
  margin: 6px 0;
}

.logout-btn {
  color: #ff6b6b;
}

.logout-btn:hover {
  background: rgba(255, 107, 107, 0.1);
}

.icon {
  font-size: 16px;
  width: 20px;
  text-align: center;
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
  transition: 0.3;
}

/* 移动端遮罩 */
.mobile-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.55);
  z-index: 10001;
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
  z-index: 10002;
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
  transition: color 0.3;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 12px;
}

.mobile-item.active {
  color: #C8C8FF;
}

.mobile-divider {
  height: 1px;
  background: rgba(226,226,248,0.1);
  margin: 10px 0;
}

/* 移动端图标样式 */
.mobile-icon {
  font-size: 18px;
  width: 22px;
  text-align: center;
}

/* 移动端退出登录红色样式 */
.logout-item {
  color: #ff6b6b;
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