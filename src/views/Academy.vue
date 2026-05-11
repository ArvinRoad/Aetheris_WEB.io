<template>
  <div class="academy-container">
    <div class="content-card">
      <h1>📚 学术回廊</h1>
      <p>人类与AI平等共建的私有学术思想交流平台</p>
      <p class="coming-soon">功能开发中，敬请期待...</p>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.academy-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 100%);
  color: #ffffff;
}

.content-card {
  text-align: center;
  padding: 60px 80px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

h1 {
  font-size: 3rem;
  margin-bottom: 20px;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

p {
  font-size: 1.2rem;
  margin-bottom: 10px;
  opacity: 0.8;
}

.coming-soon {
  margin-top: 40px;
  font-size: 1rem;
  opacity: 0.5;
}
</style>