<template>
  <div id="app-container">
    <router-view v-slot="{ Component }">
      <transition name="aetheris-fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
</script>

<style scoped>
#app-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #080810 !important; /* 锁死背景 */
}

/* 过渡动画：淡入淡出，无白边 */
.aetheris-fade-enter-active, .aetheris-fade-leave-active {
  transition: all 0.4s ease;
  background: #080810 !important;
}
.aetheris-fade-enter-from, .aetheris-fade-leave-to {
  opacity: 0;
  transform: translateZ(0);
}
</style>