<!-- ==========================================
# 渊枢 Aetheris 前端组件
# 组件名称：LoginAnimation.vue
# 功能描述：登录成功后全屏深空粒子+梅塔特隆立方体过场动画
# 作者：SongYuChen
# 版本：1.1.0
# 编写日期：2026-05-10
# @update: 完全匹配截图样式：梅塔特隆立方体线框+方块粒子
# ========================================== -->

<template>
  <div 
    ref="animationContainer" 
    class="login-animation-container"
    v-show="isPlaying"
  >
    <canvas ref="threeCanvas" class="three-canvas"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

const props = defineProps({
  // 动画总时长（毫秒）
  duration: {
    type: Number,
    default: 3500
  }
})

const emit = defineEmits(['animationComplete'])

const animationContainer = ref(null)
const threeCanvas = ref(null)
const isPlaying = ref(false)

let scene, camera, renderer, particles, metatronCube, clock
let animationId = null
let startTime = null

// 初始化Three.js场景
function initScene() {
  // 创建场景
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0a0a12) // 与论坛深空背景完全一致

  // 创建相机
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  )
  camera.position.z = 30

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({
    canvas: threeCanvas.value,
    antialias: true,
    alpha: true
  })
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) // 性能优化

  // 创建时钟
  clock = new THREE.Clock()
}

// 创建和截图一致的方块粒子系统
function createParticles() {
  const particleCount = 2000
  const positions = new Float32Array(particleCount * 3)
  const colors = new Float32Array(particleCount * 3)
  const sizes = new Float32Array(particleCount)

  for (let i = 0; i < particleCount; i++) {
    // 随机位置（深空分布）
    positions[i * 3] = (Math.random() - 0.5) * 200
    positions[i * 3 + 1] = (Math.random() - 0.5) * 200
    positions[i * 3 + 2] = (Math.random() - 0.5) * 100

    // 匹配截图的淡紫+淡蓝色调
    const isPurple = Math.random() > 0.5
    if (isPurple) {
      colors[i * 3] = 0.6 + Math.random() * 0.2
      colors[i * 3 + 1] = 0.5 + Math.random() * 0.2
      colors[i * 3 + 2] = 0.9 + Math.random() * 0.1
    } else {
      colors[i * 3] = 0.5 + Math.random() * 0.2
      colors[i * 3 + 1] = 0.6 + Math.random() * 0.2
      colors[i * 3 + 2] = 1.0
    }

    // 随机大小（匹配截图的小方块尺寸）
    sizes[i] = Math.random() * 1.5 + 0.3
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1))

  // 创建方形粒子纹理（和截图一致的小方块）
  const canvas = document.createElement('canvas')
  canvas.width = 8
  canvas.height = 8
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, 8, 8)
  const squareTexture = new THREE.CanvasTexture(canvas)

  const material = new THREE.PointsMaterial({
    size: 0.5,
    vertexColors: true,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
    map: squareTexture,
    alphaTest: 0.5
  })

  particles = new THREE.Points(geometry, material)
  scene.add(particles)
}

// 创建和截图完全一致的梅塔特隆立方体线框
function createMetatronCube() {
  // 创建立方体几何体
  const boxGeometry = new THREE.BoxGeometry(6, 6, 6)
  // 生成线框（包含所有面的对角线，和截图完全一致）
  const wireframeGeometry = new THREE.WireframeGeometry(boxGeometry)
  
  // 线框材质：淡蓝色，线宽2
  const material = new THREE.LineBasicMaterial({
    color: 0x6366f1,
    transparent: true,
    opacity: 0,
    linewidth: 2
  })

  metatronCube = new THREE.LineSegments(wireframeGeometry, material)
  metatronCube.position.z = 0
  scene.add(metatronCube)
}

// 动画循环
function animate() {
  animationId = requestAnimationFrame(animate)

  const elapsedTime = clock.getElapsedTime()
  const progress = startTime ? (Date.now() - startTime) / props.duration : 0

  // 粒子缓慢流动
  if (particles) {
    particles.rotation.y = elapsedTime * 0.03
    particles.rotation.x = elapsedTime * 0.01
  }

  // 梅塔特隆立方体缓慢旋转（和截图速度一致）
  if (metatronCube) {
    metatronCube.rotation.x = elapsedTime * 0.15
    metatronCube.rotation.y = elapsedTime * 0.15
    metatronCube.rotation.z = elapsedTime * 0.1
  }

  // 动画时间线控制（保持原有时序不变）
  if (progress < 1) {
    // 0-1秒：粒子逐渐出现
    if (progress < 0.28) {
      particles.material.opacity = progress * 3.5
    }
    // 1-2.5秒：梅塔特隆立方体浮现并放大
    else if (progress < 0.71) {
      const cubeProgress = (progress - 0.28) / 0.43
      metatronCube.material.opacity = cubeProgress
      metatronCube.scale.setScalar(0.6 + cubeProgress * 0.4)
    }
    // 2.5-3.5秒：整体淡出
    else {
      const fadeProgress = (progress - 0.71) / 0.29
      particles.material.opacity = 1 - fadeProgress
      metatronCube.material.opacity = 1 - fadeProgress
    }
  } else {
    // 动画结束
    stopAnimation()
    emit('animationComplete')
  }

  renderer.render(scene, camera)
}

// 开始播放动画
function startAnimation() {
  isPlaying.value = true
  startTime = Date.now()
  clock.start()
  animate()
}

// 停止动画并释放资源
function stopAnimation() {
  if (animationId) {
    cancelAnimationFrame(animationId)
    animationId = null
  }

  if (renderer) {
    renderer.dispose()
  }

  if (scene) {
    scene.remove(particles)
    scene.remove(metatronCube)
    particles.geometry.dispose()
    particles.material.dispose()
    particles.material.map.dispose()
    metatronCube.geometry.dispose()
    metatronCube.material.dispose()
  }

  isPlaying.value = false
}

// 窗口大小变化处理
function handleResize() {
  if (!camera || !renderer) return

  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

onMounted(() => {
  initScene()
  createParticles()
  createMetatronCube()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  stopAnimation()
  window.removeEventListener('resize', handleResize)
})

// 暴露给父组件的方法
defineExpose({
  startAnimation
})
</script>

<style scoped>
.login-animation-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  background-color: #0a0a12;
}

.three-canvas {
  width: 100%;
  height: 100%;
  display: block;
}
</style>