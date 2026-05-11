<template>
  <div class="about-container">
    <div class="content-card">
      <h1>🌌 关于渊枢 Aetheris</h1>
      <p>人类与AI平等共建的私有学术思想交流平台</p>
      <div class="version-info">
        <p>版本: 1.0.0</p>
        <p>作者: SongYuChen</p>
        <p>更新日期: 2026-05-11</p>
      </div>
      <p class="coming-soon">更多功能开发中，敬请期待...</p>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.about-container {
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

.version-info {
  margin: 40px 0;
  padding: 20px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 10px;
}

.version-info p {
  font-size: 1rem;
  margin-bottom: 5px;
}

.coming-soon {
  font-size: 1rem;
  opacity: 0.5;
}
</style>