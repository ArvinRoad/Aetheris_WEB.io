/**
 * 项目: 渊枢 (Aetheris)
 * 功能: Aetheris 以太宇宙 主页
 * 包含: 3D 场景渲染、用户信息展示、退出登录功能、登录态校验
 * 对接: Rust Axum 后端 /me 接口、localStorage Token 管理
 * @author SongYuChen
 * @version 1.0.0
 */

<template>
    <div class="aetheris-container" ref="containerRef">
        <!-- 3D 场景核心容器 -->
        <div ref="sceneRef" class="scene"></div>
        <div class="transition-mask" :class="{ show: isTransitioning }"></div>
        
        <!-- 用户信息面板（悬浮在 3D 场景上层） -->
        <div class="user-panel">
            <div class="user-info">
                <span class="username">{{ username || '以太访客' }}</span>
                <!-- 未登录显示接入以太按钮，已登录显示退出按钮 -->
                <button class="login-btn" @click="handleGoLogin" v-if="!username" :disabled="isTransitioning">
                    接入以太
                </button>
                <button class="logout-btn" @click="handleLogout" v-else :disabled="isTransitioning">
                    退出以太
                </button>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, onUnmounted, onActivated } from 'vue';
    import { useRouter } from 'vue-router';
    import * as THREE from 'three';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
    import { getMeApi } from '@/api/auth';

    // 核心响应式变量
    const sceneRef = ref(null);
    const containerRef = ref(null);
    const router = useRouter();
    const isTransitioning = ref(false);
    const username = ref('');

    // Three.js 核心对象
    let scene, camera, renderer, controls;
    let cube, ringOuter, ringInner;
    let particleSystem;
    let metatronCube, coreWireMesh, outlineMesh, ringGroup;
    let metatronGlowLayers = [];
    let animationId;
    let isHovering = false;
    let interactiveGroup;
    let handlePointerMove = null;
    let handleClick = null;

    // 过渡动画参数
    let cubeTargetOpacity = 0;
    let outlineTargetOpacity = 0.6;
    let ringGroupTargetOpacity = 0;
    let outerRingTargetOpacity = 0;
    let innerRingTargetOpacity = 0;
    let particleTargetOpacity = 0.3;
    let coreTargetOpacity = 0.8;
    const transitionSpeed = 0.08;

    // 主题色配置
    const COLOR = {
        bg: '#080810',
        purple: '#1F1533',
        silver: '#E2E2F8',
        glow: '#C8C8FF'
    };

    // ========== 业务逻辑：用户信息与退出登录 ==========
    // 获取当前登录用户信息（核心修改：移除自动跳转）
    const getUserInfo = async () => {
        // 先校验 Token 是否存在
        const token = localStorage.getItem('token');
        if (!token) {
            username.value = ''; // 仅清空用户名，不跳转
            return;
        }

        try {
            const res = await getMeApi();
            if (res.code === 0) {
                username.value = res.data.username || '以太访客';
            } else {
                // Token 失效/用户不存在
                localStorage.removeItem('token');
                username.value = ''; // 仅清空，不跳转
            }
        } catch (err) {
            console.error('获取用户信息失败：', err);
            localStorage.removeItem('token');
            username.value = ''; // 仅清空，不跳转
        }
    };

    // 接入以太（跳转登录页）
    const handleGoLogin = () => {
        if (isTransitioning.value) return;
        isTransitioning.value = true;
        setTimeout(() => {
            router.push('/login');
            isTransitioning.value = false;
        }, 300);
    };

    // 退出登录逻辑
    const handleLogout = () => {
        if (isTransitioning.value) return;
        isTransitioning.value = true;
        
        // 过渡动画后清除 Token 并跳转
        setTimeout(() => {
            localStorage.removeItem('token');
            router.push('/login');
            isTransitioning.value = false;
        }, 800);
    };

    // ========== Three.js ==========
    // 初始化 3D 场景
    const initScene = () => {
        const container = containerRef.value;
        if (!container) return;
        const width = container.clientWidth;
        const height = container.clientHeight;

        // 1. 场景初始化
        scene = new THREE.Scene();
        scene.background = new THREE.Color(COLOR.bg);
        scene.fog = new THREE.Fog(COLOR.bg, 5, 20);

        // 2. 相机适配
        const aspectRatio = width / height;
        const fov = aspectRatio > 1 ? 60 : 35;
        const cameraZ = aspectRatio > 1 ? 6 : 8;
        camera = new THREE.PerspectiveCamera(fov, aspectRatio, 0.1, 1000);
        camera.position.set(0, 0, cameraZ);
        camera.lookAt(0, 0, 0);

        // 3. 渲染器配置
        renderer = new THREE.WebGLRenderer({
            antialias: true,
            powerPreference: "high-performance",
            alpha: false,
            preserveDrawingBuffer: true
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio || 1); // 适配高清屏
        renderer.setClearColor(COLOR.bg, 1);
        renderer.domElement.style.display = 'block';
        renderer.domElement.style.outline = 'none';
        renderer.domElement.style.border = 'none';
        sceneRef.value.innerHTML = '';
        sceneRef.value.appendChild(renderer.domElement);

        // 4. 控制器配置（禁用移动端交互）
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.enablePan = false;
        controls.enableRotate = false;
        controls.enableZoom = false;
        controls.enableKeys = false;
        controls.touches = {
            ONE: THREE.TOUCH.NONE,
            TWO: THREE.TOUCH.NONE
        };
        controls.update();

        // 创建自适应 3D 元素
        createAdaptiveElements(aspectRatio);
        interactiveGroup = new THREE.Group();
        interactiveGroup.add(cube, metatronCube);
        scene.add(interactiveGroup);

        // 绑定交互事件
        addMouseInteraction();

        // 核心渐入动画
        coreWireMesh.material.opacity = 0;
        outlineMesh.material.opacity = 0;
        let fadeInProgress = 0;
        const fadeInTimer = setInterval(() => {
            fadeInProgress += 0.015;
            coreWireMesh.material.opacity = Math.min(fadeInProgress, 0.8);
            outlineMesh.material.opacity = Math.min(fadeInProgress, 0.6);
            if (fadeInProgress >= 1) {
                clearInterval(fadeInTimer);
            }
        }, 25);

        // 启动动画循环
        animate();
    };

    // 创建自适应 3D 元素（适配移动端）
    function createAdaptiveElements(aspectRatio) {
        const scaleFactor = aspectRatio > 1 ? 1 : 0.6;

        // 外层立方体
        const cubeSize = 1.8 * scaleFactor;
        const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
        const cubeMat = new THREE.MeshBasicMaterial({
            color: COLOR.purple,
            transparent: true,
            opacity: 0,
            depthWrite: false,
            visible: true
        });
        cube = new THREE.Mesh(cubeGeo, cubeMat);

        // 核心梅塔特隆立方体
        metatronCube = new THREE.Group();
        // 核心线框
        const coreSize = 0.7 * scaleFactor;
        const coreGeo = new THREE.BoxGeometry(coreSize, coreSize, coreSize);
        const coreMat = new THREE.MeshBasicMaterial({
            color: COLOR.silver,
            transparent: true,
            opacity: 0.8,
            wireframe: true,
            side: THREE.DoubleSide
        });
        coreWireMesh = new THREE.Mesh(coreGeo, coreMat);
        metatronCube.add(coreWireMesh);

        // 正方形轮廓
        const outlineSize = 0.7 * scaleFactor;
        const outlineGeo = new THREE.BoxGeometry(outlineSize, outlineSize, outlineSize);
        const outlineMat = new THREE.MeshBasicMaterial({
            color: COLOR.silver,
            transparent: true,
            opacity: 0.6,
            wireframe: true,
            side: THREE.DoubleSide
        });
        outlineMesh = new THREE.Mesh(outlineGeo, outlineMat);
        metatronCube.add(outlineMesh);

        // 核心圆环组
        ringGroup = new THREE.Group();
        const ringRadius = 0.5 * scaleFactor;
        const ringGroupMat = new THREE.MeshBasicMaterial({
            color: COLOR.silver,
            transparent: true,
            opacity: 0,
            wireframe: true,
            side: THREE.DoubleSide
        });
        const ringXY = new THREE.Mesh(new THREE.RingGeometry(ringRadius, ringRadius + 0.02 * scaleFactor, 32), ringGroupMat);
        const ringXZ = ringXY.clone(); ringXZ.rotation.x = Math.PI / 2;
        const ringYZ = ringXY.clone(); ringYZ.rotation.z = Math.PI / 2;
        ringGroup.add(ringXY, ringXZ, ringYZ);
        metatronCube.add(ringGroup);

        // 发光层
        for (let i = 0; i < 3; i++) {
            const layerSize = (0.7 + i * 0.15) * scaleFactor;
            const glowGeo = new THREE.BoxGeometry(layerSize, layerSize, layerSize);
            const glowMat = new THREE.MeshBasicMaterial({
                color: COLOR.glow,
                transparent: true,
                opacity: 0,
                wireframe: true,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            const glowLayer = new THREE.Mesh(glowGeo, glowMat);
            glowLayer.position.set(0, 0, 0);
            metatronGlowLayers.push({
                mesh: glowLayer,
                delay: i * 0.12,
                baseScale: 1 + i * 0.03,
                baseOpacity: 0.18 - i * 0.05
            });
            metatronCube.add(glowLayer);
        }

        // 外层大圆环
        const outerRingRadius = 1.8 * scaleFactor;
        const outerRingMat = new THREE.MeshBasicMaterial({
            color: COLOR.silver,
            transparent: true,
            opacity: 0,
            side: THREE.DoubleSide,
            wireframe: true
        });
        ringOuter = new THREE.Mesh(new THREE.RingGeometry(outerRingRadius, outerRingRadius + 0.08 * scaleFactor, 64), outerRingMat);
        scene.add(ringOuter);

        // 内层大圆环
        const innerRingRadius = 1.4 * scaleFactor;
        const innerRingMat = new THREE.MeshBasicMaterial({
            color: COLOR.silver,
            transparent: true,
            opacity: 0,
            side: THREE.DoubleSide,
            wireframe: true
        });
        ringInner = new THREE.Mesh(new THREE.RingGeometry(innerRingRadius, innerRingRadius + 0.02 * scaleFactor, 64, 1, 0, Math.PI * 1.7), innerRingMat);
        scene.add(ringInner);

        // 背景粒子
        const particleCount = aspectRatio > 1 ? 9 : 4;
        const particleSize = aspectRatio > 1 ? 0.1 : 0.06;
        const positions = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
            const range = aspectRatio > 1 ? 12 : 6;
            positions[i * 3 + 0] = (Math.random() - 0.5) * range;
            positions[i * 3 + 1] = (Math.random() - 0.5) * range;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
        }
        const particleGeo = new THREE.BufferGeometry();
        particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const particleMat = new THREE.PointsMaterial({
            color: COLOR.silver,
            size: particleSize,
            transparent: true,
            opacity: 0.3,
        });
        particleSystem = new THREE.Points(particleGeo, particleMat);
        scene.add(particleSystem);
    }

    // 鼠标/触摸交互事件
    function addMouseInteraction() {
        if (!sceneRef.value || !renderer) return;
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        handlePointerMove = (e) => {
            if (!sceneRef.value || isTransitioning.value) return;
            let clientX = e.clientX || (e.touches && e.touches[0].clientX);
            let clientY = e.clientY || (e.touches && e.touches[0].clientY);

            const rect = sceneRef.value.getBoundingClientRect();
            mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObject(metatronCube, true);
            isHovering = intersects.length > 0;

            // 交互状态更新
            if (isHovering) {
                document.body.style.cursor = 'pointer';
                cubeTargetOpacity = 0.3;
                outlineTargetOpacity = 0.9;
                ringGroupTargetOpacity = 0.8;
                outerRingTargetOpacity = 0.45;
                innerRingTargetOpacity = 0.6;
                particleTargetOpacity = 0.8;
                coreTargetOpacity = 1.0;
            } else {
                document.body.style.cursor = 'default';
                cubeTargetOpacity = 0;
                outlineTargetOpacity = 0.6;
                ringGroupTargetOpacity = 0;
                outerRingTargetOpacity = 0;
                innerRingTargetOpacity = 0;
                particleTargetOpacity = 0.3;
                coreTargetOpacity = 0.8;
            }
        };

        handleClick = () => {
            if (!isHovering || !sceneRef.value || isTransitioning.value) return;
            isTransitioning.value = true;
            // 发光层动画
            metatronGlowLayers.forEach(layer => {
                layer.mesh.material.opacity = 1;
                layer.mesh.scale.set(1.6, 1.6, 1.6);
            });
            coreWireMesh.material.opacity = 1.5;
            outlineMesh.material.opacity = 1.2;
            // 跳转登录页
            setTimeout(() => {
                router.push('/login');
                isTransitioning.value = false;
            }, 800);
        };

        // 绑定事件
        const domElement = renderer.domElement;
        domElement.addEventListener('mousemove', handlePointerMove);
        domElement.addEventListener('touchmove', (e) => {
            e.preventDefault();
            handlePointerMove(e);
        }, { passive: false });
        domElement.addEventListener('click', handleClick);
        domElement.addEventListener('touchend', (e) => {
            e.preventDefault();
            handleClick();
        }, { passive: false });
    }

    // 透明度过渡缓动
    function easeOpacity(current, target) {
        return current + (target - current) * transitionSpeed;
    }

    // 动画循环
    function animate() {
        animationId = requestAnimationFrame(animate);
        const speed = isHovering ? 1.5 : 0.8;

        // 透明度过渡更新（增加空值判断，防止报错）
        if (cube && cube.material) {
            cube.material.opacity = easeOpacity(cube.material.opacity, cubeTargetOpacity);
        }
        if (outlineMesh && outlineMesh.material) {
            outlineMesh.material.opacity = easeOpacity(outlineMesh.material.opacity, outlineTargetOpacity);
        }
        if (coreWireMesh && coreWireMesh.material) {
            coreWireMesh.material.opacity = easeOpacity(coreWireMesh.material.opacity, coreTargetOpacity);
        }
        if (ringGroup) {
            ringGroup.traverse(child => {
                if (child.material) {
                    child.material.opacity = easeOpacity(child.material.opacity, ringGroupTargetOpacity);
                }
            });
        }
        if (ringOuter && ringOuter.material) {
            ringOuter.material.opacity = easeOpacity(ringOuter.material.opacity, outerRingTargetOpacity);
        }
        if (ringInner && ringInner.material) {
            ringInner.material.opacity = easeOpacity(ringInner.material.opacity, innerRingTargetOpacity);
        }
        if (particleSystem && particleSystem.material) {
            particleSystem.material.opacity = easeOpacity(particleSystem.material.opacity, particleTargetOpacity);
        }

        // 旋转动画
        if (metatronCube) {
            metatronCube.rotation.y += 0.0022 * speed;
            metatronCube.rotation.x += 0.0011 * speed;
            metatronCube.rotation.z += 0.0015 * speed;
        }
        if (cube) {
            cube.rotation.y = metatronCube.rotation.y;
            cube.rotation.x = metatronCube.rotation.x;
        }
        if (ringOuter) ringOuter.rotation.z += 0.0015 * speed;
        if (ringInner) ringInner.rotation.z -= 0.0012 * speed;

        // 粒子浮动
        if (particleSystem) {
            const pos = particleSystem.geometry.attributes.position.array;
            for (let i = 0; i < pos.length; i += 3) {
                pos[i + 1] += Math.sin(Date.now() * 0.0001 + i) * 0.00015;
                if (isHovering) {
                    pos[i] -= pos[i] * 0.0002;
                    pos[i + 1] -= pos[i + 1] * 0.0002;
                }
            }
            particleSystem.geometry.attributes.position.needsUpdate = true;
        }

        // 发光层脉冲动画
        if (isHovering && metatronGlowLayers.length) {
            const time = Date.now() * 0.001;
            metatronGlowLayers.forEach(layer => {
                const pulse = Math.sin(time * 1.8 - layer.delay);
                layer.mesh.material.opacity = layer.baseOpacity * (pulse > 0 ? pulse : 0);
                const scale = layer.baseScale + (pulse * 0.06);
                layer.mesh.scale.set(scale, scale, scale);
                layer.mesh.rotation.copy(metatronCube.rotation);
            });
        }

        controls.update();
        renderer.render(scene, camera);
    }

    // 窗口大小适配
    function handleResize() {
        if (!renderer || !containerRef.value) return;
        const container = containerRef.value;
        const width = container.clientWidth;
        const height = container.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    }

    // ========== 生命周期 ==========
    onMounted(() => {
        // 获取用户信息
        getUserInfo();
        // 初始化 3D 场景（延迟初始化，避免DOM未加载完成）
        setTimeout(() => {
            if (containerRef.value && sceneRef.value) {
                initScene();
                window.addEventListener('resize', handleResize);
                handleResize();
            }
        }, 200); // 延长延迟，确保DOM加载完成
    });

    // 路由激活时重新校验用户信息
    onActivated(() => {
        getUserInfo();
    });

    // 页面卸载：释放 Three.js 资源 + 解绑事件
    onUnmounted(() => {
        // 停止动画循环
        if (animationId) cancelAnimationFrame(animationId);
        window.removeEventListener('resize', handleResize);

        // 解绑交互事件
        if (renderer && renderer.domElement && handlePointerMove && handleClick) {
            const domElement = renderer.domElement;
            domElement.removeEventListener('mousemove', handlePointerMove);
            domElement.removeEventListener('touchmove', handlePointerMove);
            domElement.removeEventListener('click', handleClick);
            domElement.removeEventListener('touchend', handleClick);
        }

        // 清空事件残留
        if (renderer && renderer.domElement) {
            const domElement = renderer.domElement;
            const newDom = domElement.cloneNode(true);
            domElement.parentNode.replaceChild(newDom, domElement);
        }

        // 释放 Three.js 资源
        if (renderer) renderer.dispose();
        if (scene) scene.clear();

        // 重置所有引用，防止内存泄漏
        scene = null;
        camera = null;
        renderer = null;
        controls = null;
        cube = null;
        ringOuter = null;
        ringInner = null;
        particleSystem = null;
        metatronCube = null;
        coreWireMesh = null;
        outlineMesh = null;
        ringGroup = null;
        metatronGlowLayers = [];
        handlePointerMove = null;
        handleClick = null;
    });
</script>

<style scoped>
    /* 全局基础样式（穿透作用域） */
    :global(html), :global(body) {
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        height: 100% !important;
        background: #080810 !important;
        overflow: hidden !important;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    }

    .aetheris-container {
        width: 100vw !important;
        height: 100vh !important;
        height: -webkit-fill-available !important; /* 适配移动端视口 */
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        overflow: hidden !important;
        margin: 0 !important;
        padding: 0 !important;
        background: #080810 !important; /* 强制背景，渲染前不暴露白边 */
        background-image: radial-gradient(circle at center, rgba(31,21,51,0.1) 0%, #080810 100%) !important;
        touch-action: none !important;
        border: none !important;
        outline: none !important;
        z-index: 1;
    }

    .scene {
        width: 100% !important;
        height: 100% !important;
        display: block !important;
        position: relative !important;
        overflow: hidden !important;
        background: #080810 !important; /* 防止 canvas 渲染前留白 */
    }

    .scene canvas {
        width: 100% !important;
        height: 100% !important;
        display: block !important;
        object-fit: contain !important;
        border: none !important;
        outline: none !important;
        background: #080810 !important;
        will-change: transform, opacity;
        transform: translateZ(0);
    }

    .transition-mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: #080810;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.8s ease;
        z-index: 10;
    }

    .transition-mask.show {
        opacity: 1;
    }

    /* 用户信息面板样式 */
    .user-panel {
        position: absolute;
        top: 20px;
        right: 20px;
        z-index: 9;
        pointer-events: auto; /* 确保按钮可点击 */
    }

    .user-info {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 16px;
        background: rgba(16,16,28,0.85);
        backdrop-filter: blur(8px);
        border: 1px solid rgba(226,226,248,0.15);
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
    }

    .username {
        color: #E2E2F8;
        font-size: 14px;
        white-space: nowrap;
        font-weight: 500;
    }

    /* 接入以太按钮样式 */
    .login-btn {
        padding: 6px 12px;
        background: linear-gradient(90deg, #1F1533, #2A1E40);
        border: 1px solid rgba(200,200,255,0.3);
        border-radius: 4px;
        color: #E2E2F8;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 500;
    }

    .login-btn:hover {
        background: linear-gradient(90deg, #2A1E40, #352850);
        border-color: rgba(200,200,255,0.5);
        box-shadow: 0 0 10px rgba(200,200,255,0.1);
    }

    .login-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        background: linear-gradient(90deg, #1F1533, #1F1533);
    }

    .logout-btn {
        padding: 6px 12px;
        background: linear-gradient(90deg, #1F1533, #2A1E40);
        border: 1px solid rgba(200,200,255,0.3);
        border-radius: 4px;
        color: #E2E2F8;
        font-size: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-weight: 500;
    }

    .logout-btn:hover {
        background: linear-gradient(90deg, #2A1E40, #352850);
        border-color: rgba(200,200,255,0.5);
        box-shadow: 0 0 10px rgba(200,200,255,0.1);
    }

    .logout-btn:disabled {
        opacity: 0.7;
        cursor: not-allowed;
        background: linear-gradient(90deg, #1F1533, #1F1533);
    }

    /* 移动端适配 */
    @media screen and (max-width: 768px) {
        .aetheris-container {
            touch-action: none !important;
            -webkit-touch-callout: none !important;
            -webkit-user-select: none !important;
        }

        .scene canvas {
            transform: translateZ(0) !important;
            -webkit-transform: translateZ(0) !important;
            -webkit-tap-highlight-color: transparent !important;
        }

        .user-panel {
            top: 10px;
            right: 10px;
        }

        .user-info {
            padding: 6px 12px;
        }

        .username {
            font-size: 12px;
        }

        .login-btn, .logout-btn {
            padding: 4px 8px;
            font-size: 10px;
        }
    }

    /* 横屏手机适配 */
    @media screen and (max-height: 480px) and (orientation: landscape) {
        .aetheris-container {
            height: 100vh !important;
            width: 100vw !important;
        }

        .scene canvas {
            object-fit: cover !important;
        }

        .user-panel {
            top: 5px;
            right: 5px;
        }

        .user-info {
            padding: 4px 8px;
        }
    }
</style>