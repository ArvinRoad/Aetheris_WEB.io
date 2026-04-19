/**
 * 项目：渊枢 (Aetheris)
 * 功能：根组件，全局路由入口
 */
<template>
    <div id="app-container">
        <router-view />
    </div>
</template>

<script setup>
</script>

<style scoped>
    #app-container {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        background-color: #000;
    }
</style>