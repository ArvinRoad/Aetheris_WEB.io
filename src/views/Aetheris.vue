/**
 * 项目: 渊枢 (Aetheris)
 * 功能: Aetheris 以太宇宙 主页
 */

<template>
    <div class="aetheris-container" ref="containerRef">
        <div ref="sceneRef" class="scene"></div>
        <div class="transition-mask" :class="{ show: isTransitioning }"></div>
    </div>
</template>

<script setup>
    import { ref, onMounted, onUnmounted } from 'vue';
    import { useRouter } from 'vue-router';
    import * as THREE from 'three';
    import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

    const sceneRef = ref(null);
    const containerRef = ref(null);
    const router = useRouter();
    const isTransitioning = ref(false);

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

    // 过渡动画相关变量
    let cubeTargetOpacity = 0;
    let outlineTargetOpacity = 0.6;
    let ringGroupTargetOpacity = 0;
    let outerRingTargetOpacity = 0;
    let innerRingTargetOpacity = 0;
    let particleTargetOpacity = 0.3;
    let coreTargetOpacity = 0.8;
    const transitionSpeed = 0.08;

    const COLOR = {
        bg: '#080810',
        purple: '#1F1533',
        silver: '#E2E2F8',
        glow: '#C8C8FF'
    };

    // 初始化场景（修复移动端适配核心）
    const initScene = () => {
        const container = containerRef.value;
        if (!container) return;
        const width = container.clientWidth;
        const height = container.clientHeight;

        // 1. 场景初始化 - 强制背景色，避免白框
        scene = new THREE.Scene();
        scene.background = new THREE.Color(COLOR.bg);
        scene.fog = new THREE.Fog(COLOR.bg, 5, 20); // 增加雾效，避免边缘白框

        // 2. 相机适配 - 优化移动端视野和距离
        const aspectRatio = width / height;
        const fov = aspectRatio > 1 ? 60 : 35;
        const cameraZ = aspectRatio > 1 ? 6 : 8;
        camera = new THREE.PerspectiveCamera(fov, aspectRatio, 0.1, 1000);
        camera.position.set(0, 0, cameraZ);
        camera.lookAt(0, 0, 0);

        // 3. 渲染器配置 - 修复移动端白框和渲染问题
        renderer = new THREE.WebGLRenderer({
            antialias: true,
            powerPreference: "high-performance",
            alpha: false,
            preserveDrawingBuffer: true // 防止渲染缓冲区丢失导致白框
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(1);
        renderer.setClearColor(COLOR.bg, 1);
        renderer.domElement.style.display = 'block';
        renderer.domElement.style.outline = 'none';
        renderer.domElement.style.border = 'none';
        sceneRef.value.innerHTML = '';
        sceneRef.value.appendChild(renderer.domElement);

        // 4. 控制器优化 - 移动端彻底禁用所有交互
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

        // 创建自适应元素 - 优化移动端缩放
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

        // 启动动画
        animate();
    };

    // 创建自适应元素 - 修复移动端显示不全
    function createAdaptiveElements(aspectRatio) {
        // 移动端进一步缩小元素（竖屏缩小40%）
        const scaleFactor = aspectRatio > 1 ? 1 : 0.6;

        // 1. 外层立方体
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

        // 2. 核心梅塔特隆立方体
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

        // 3. 外层大圆环
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

        // 4. 背景粒子 - 减少移动端粒子数量
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

    function addMouseInteraction() {
        if (!sceneRef.value || !renderer) return;
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        handlePointerMove = (e) => {
            if (!sceneRef.value) return; // 空值保护，避免路由切换后报错
            let clientX = e.clientX || (e.touches && e.touches[0].clientX);
            let clientY = e.clientY || (e.touches && e.touches[0].clientY);

            const rect = sceneRef.value.getBoundingClientRect();
            mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObject(metatronCube, true);
            isHovering = intersects.length > 0;

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
            if (!isHovering || !sceneRef.value) return;
            isTransitioning.value = true;
            metatronGlowLayers.forEach(layer => {
                layer.mesh.material.opacity = 1;
                layer.mesh.scale.set(1.6, 1.6, 1.6);
            });
            coreWireMesh.material.opacity = 1.5;
            outlineMesh.material.opacity = 1.2;
            setTimeout(() => {
                router.push('/login');
            }, 800);
        };

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

    function easeOpacity(current, target) {
        return current + (target - current) * transitionSpeed;
    }

    function animate() {
        animationId = requestAnimationFrame(animate);
        const speed = isHovering ? 1.5 : 0.8;

        // 透明度过渡
        cube.material.opacity = easeOpacity(cube.material.opacity, cubeTargetOpacity);
        outlineMesh.material.opacity = easeOpacity(outlineMesh.material.opacity, outlineTargetOpacity);
        coreWireMesh.material.opacity = easeOpacity(coreWireMesh.material.opacity, coreTargetOpacity);
        ringGroup.traverse(child => {
            if (child.material) {
                child.material.opacity = easeOpacity(child.material.opacity, ringGroupTargetOpacity);
            }
        });
        ringOuter.material.opacity = easeOpacity(ringOuter.material.opacity, outerRingTargetOpacity);
        ringInner.material.opacity = easeOpacity(ringInner.material.opacity, innerRingTargetOpacity);
        particleSystem.material.opacity = easeOpacity(particleSystem.material.opacity, particleTargetOpacity);

        // 旋转逻辑
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

        // 发光层脉冲
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

    // 窗口大小变化处理
    function handleResize() {
        if (!renderer || !containerRef.value) return;
        const container = containerRef.value;
        const width = container.clientWidth;
        const height = container.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
        renderer.setPixelRatio(1);
    }

    onMounted(() => {
        setTimeout(() => {
            if (containerRef.value && sceneRef.value) {
                initScene();
                window.addEventListener('resize', handleResize);
                handleResize();
            }
        }, 100);
    });

    onUnmounted(() => {
        // 1. 停止动画循环
        cancelAnimationFrame(animationId);
        window.removeEventListener('resize', handleResize);

        // 3. 解绑鼠标/触摸事件
        if (renderer && renderer.domElement && handlePointerMove && handleClick) {
            const domElement = renderer.domElement;
            domElement.removeEventListener('mousemove', handlePointerMove);
            domElement.removeEventListener('touchmove', handlePointerMove);
            domElement.removeEventListener('click', handleClick);
            domElement.removeEventListener('touchend', handleClick);
        }

        // 4. 克隆节点清空所有残留事件
        if (renderer && renderer.domElement) {
            const domElement = renderer.domElement;
            const newDom = domElement.cloneNode(true);
            domElement.parentNode.replaceChild(newDom, domElement);
        }

        // 5. 释放Three.js资源
        if (renderer) {
            renderer.dispose();
        }
        if (scene) {
            scene.clear();
        }

        // 6. 重置所有引用，彻底释放内存
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
        sceneRef.value = null;
        containerRef.value = null;
        handlePointerMove = null;
        handleClick = null;
    });
</script>

<style scoped>
    :root, body {
        margin: 0 !important;
        padding: 0 !important;
        overflow: hidden !important;
        background: #080810 !important;
    }

    .aetheris-container {
        width: 100vw !important;
        height: 100vh !important;
        position: fixed !important;
        top: 0 !important;
        left: 0 !important;
        overflow: hidden !important;
        margin: 0 !important;
        padding: 0 !important;
        background: #080810 !important;
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
    }
</style>