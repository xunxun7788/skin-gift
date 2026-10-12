<template>
    <div class="sky-scene">

        <!-- 星星层（更真实） -->
        <div class="stars-layer">
            <div v-for="star in stars" :key="star.id" class="star" :class="star.type" :style="star.style"></div>
        </div>

        <!-- 流星 -->
        <div v-for="s in shootingStars" :key="s.id" class="shooting-star" :style="s.style"></div>

        <!-- 多层乌云 -->
        <div class="cloud-layer cloud-1"></div>
        <div class="cloud-layer cloud-2"></div>
        <div class="cloud-layer cloud-3"></div>
        <div class="cloud-layer cloud-4"></div>

        <!-- 光柱增强 -->
        <div class="light-shaft"></div>
        <div class="light-glow"></div>

        <!-- 底部火星 / 尘埃 -->
        <div class="embers">
            <div v-for="e in embers" :key="e.id" class="ember" :style="e.style"></div>
        </div>

        <!-- 内容插槽 -->
        <div class="content">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'


interface StarItem {
    id: number
    type: string
    style: Record<string, string>
}

interface EmberItem {
    id: number
    style: Record<string, string>
}

interface ShootingStar {
    id: number
    style: Record<string, string>
}

const stars = ref<StarItem[]>([])
const embers = ref<EmberItem[]>([])
const shootingStars = ref<ShootingStar[]>([])

let shootingTimer: number | null = null

onMounted(() => {
    // ===== 生成星星 =====
    const list: StarItem[] = []
    for (let i = 0; i < 120; i++) {
        const size = Math.random()
        let type = 'small'
        let finalSize = 1.2

        if (size > 0.92) {
            type = 'large'
            finalSize = Math.random() * 2.2 + 2.8
        } else if (size > 0.75) {
            type = 'medium'
            finalSize = Math.random() * 1.4 + 1.8
        } else {
            finalSize = Math.random() * 1.1 + 0.7
        }

        const top = Math.random() * 68 // 主要在上半天空
        const left = Math.random() * 100
        const duration = 2.5 + Math.random() * 4.5
        const delay = Math.random() * 8
        const opacity = 0.35 + Math.random() * 0.65

        list.push({
            id: i,
            type,
            style: {
                width: `${finalSize}px`,
                height: `${finalSize}px`,
                top: `${top}%`,
                left: `${left}%`,
                '--duration': `${duration}s`,
                '--delay': `${delay}s`,
                '--opacity': String(opacity),
            },
        })
    }
    stars.value = list

    // ===== 生成底部火星 =====
    const emberColors = [
        '#e07a3d', // 暖橙
        '#c45c32', // 深橙红
        '#d4683a', // 中等暖红
        '#b85a2f', // 偏暗橙
        '#f0a05a', // 浅琥珀（少量）
    ]
    const emberList: EmberItem[] = []
    for (let i = 0; i < 28; i++) {
        const size = Math.random() * 2.3 + 1.1
        const startBottom = -(Math.random() * 25 + 8) // 继续从屏幕外开始
        const color = emberColors[Math.floor(Math.random() * emberColors.length)]

        emberList.push({
            id: i,
            style: {
                width: `${size}px`,
                height: `${size}px`,
                left: `${Math.random() * 100}%`,
                bottom: `${startBottom}%`,
                background: color,
                // 阴影颜色跟随主体，更柔和
                boxShadow: `0 0 6px 2px ${color}99, 0 0 12px 3px ${color}55`,
                animationDuration: `${12 + Math.random() * 9}s`,
                animationDelay: `${Math.random() * 12}s`,
            },
        })
    }
    embers.value = emberList
    // ===== 偶尔生成流星 =====
    const createShootingStar = () => {
        const id = Date.now()
        const top = 5 + Math.random() * 35
        const left = 10 + Math.random() * 60
        const duration = 0.9 + Math.random() * 0.7

        shootingStars.value.push({
            id,
            style: {
                top: `${top}%`,
                left: `${left}%`,
                animationDuration: `${duration}s`,
            },
        })

        // 动画结束后移除
        setTimeout(() => {
            shootingStars.value = shootingStars.value.filter(s => s.id !== id)
        }, duration * 1000 + 100)
    }

    // 每 6~14 秒出现一颗流星
    const scheduleShooting = () => {
        const delay = 3000 + Math.random() * 4000
        shootingTimer = window.setTimeout(() => {
            createShootingStar()
            scheduleShooting()
        }, delay)
    }
    scheduleShooting()
})

onUnmounted(() => {
    if (shootingTimer) clearTimeout(shootingTimer)
})
</script>

<style scoped>
.sky-scene {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
}


/* ========== 星星 ========== */
.stars-layer {
    position: absolute;
    inset: 0;
    pointer-events: none;
}

.star {
    position: absolute;
    border-radius: 50%;
    background: #fff;
    animation: twinkle var(--duration) ease-in-out infinite;
    animation-delay: var(--delay);
    opacity: var(--opacity);
}

.star.small {
    box-shadow: 0 0 4px 1px rgba(200, 220, 255, 0.6);
}

.star.medium {
    background: #e8f1ff;
    box-shadow: 0 0 8px 2px rgba(160, 200, 255, 0.75);
}

.star.large {
    background: #f0f6ff;
    box-shadow:
        0 0 12px 3px rgba(180, 210, 255, 0.9),
        0 0 20px 6px rgba(100, 160, 255, 0.4);
}

@keyframes twinkle {

    0%,
    100% {
        opacity: 0.15;
        transform: scale(0.75);
    }

    40% {
        opacity: 1;
        transform: scale(1.15);
    }

    70% {
        opacity: 0.5;
        transform: scale(0.9);
    }
}

/* ========== 流星 ========== */
.shooting-star {
    position: absolute;
    width: 90px;
    height: 2px;
    background: linear-gradient(90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(200, 230, 255, 0.9) 40%,
            rgba(255, 255, 255, 1) 100%);
    border-radius: 50%;
    transform: rotate(-35deg);
    animation: shoot linear forwards;

    pointer-events: none;
    filter: drop-shadow(0 0 6px rgba(180, 220, 255, 0.8));
}

@keyframes shoot {
    0% {
        transform: rotate(-35deg) translateX(0);
        opacity: 1;
    }

    100% {
        transform: rotate(-35deg) translateX(420px);
        opacity: 0;
    }
}

/* ========== 乌云层（关键提升） ========== */
.cloud-layer {
    position: absolute;
    pointer-events: none;

    filter: blur(50px);
    mix-blend-mode: screen;
}

.cloud-1 {
    top: -5%;
    left: -20%;
    width: 140%;
    height: 55%;
    background: radial-gradient(ellipse 70% 50% at 50% 50%,
            rgba(40, 60, 120, 0.45) 0%,
            rgba(20, 30, 70, 0.2) 45%,
            transparent 75%);
    animation: cloudMove1 55s linear infinite;
    opacity: 0.7;
}

.cloud-2 {
    top: 15%;
    left: -30%;
    width: 160%;
    height: 45%;
    background: radial-gradient(ellipse 60% 40% at 40% 50%,
            rgba(30, 45, 100, 0.4) 0%,
            rgba(15, 25, 60, 0.15) 50%,
            transparent 75%);
    animation: cloudMove2 75s linear infinite;
    opacity: 0.55;
}

.cloud-3 {
    top: 5%;
    left: -10%;
    width: 130%;
    height: 35%;
    background: radial-gradient(ellipse 50% 35% at 60% 40%,
            rgba(50, 80, 150, 0.3) 0%,
            transparent 70%);
    animation: cloudMove3 40s linear infinite reverse;
    opacity: 0.45;
}

.cloud-4 {
    top: 25%;
    left: -25%;
    width: 150%;
    height: 40%;
    background: radial-gradient(ellipse 65% 45% at 30% 60%,
            rgba(25, 40, 90, 0.35) 0%,
            transparent 70%);
    animation: cloudMove1 65s linear infinite;
    animation-delay: -20s;
    opacity: 0.4;
}

@keyframes cloudMove1 {
    0% {
        transform: translateX(0) translateY(0);
    }

    50% {
        transform: translateX(-8%) translateY(2%);
    }

    100% {
        transform: translateX(0) translateY(0);
    }
}

@keyframes cloudMove2 {
    0% {
        transform: translateX(0);
    }

    100% {
        transform: translateX(-12%);
    }
}

@keyframes cloudMove3 {
    0% {
        transform: translateX(0) scale(1);
    }

    50% {
        transform: translateX(6%) scale(1.05);
    }

    100% {
        transform: translateX(0) scale(1);
    }
}

/* ========== 光柱增强 ========== */
.light-shaft {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 55%;
    height: 75%;
    background: radial-gradient(ellipse 40% 70% at 50% 0%,
            rgba(120, 190, 255, 0.22) 0%,
            rgba(70, 140, 230, 0.1) 35%,
            transparent 70%);

    pointer-events: none;
    animation: shaftBreath 9s ease-in-out infinite;
}

.light-glow {
    position: absolute;
    top: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 30%;
    height: 50%;
    background: radial-gradient(ellipse at top,
            rgba(160, 210, 255, 0.15) 0%,
            transparent 70%);
    pointer-events: none;
    animation: shaftBreath 7s ease-in-out infinite reverse;
}

@keyframes shaftBreath {

    0%,
    100% {
        opacity: 0.7;
        transform: translateX(-50%) scaleX(1);
    }

    50% {
        opacity: 1;
        transform: translateX(-50%) scaleX(1.08);
    }
}

/* ========== 底部火星 ========== */
.embers {
    position: absolute;
    inset: 0;
    z-index: 5;
    pointer-events: none;
    overflow: hidden;
}

.ember {
    position: absolute;
    border-radius: 50%;
    /* 颜色和阴影已通过 inline style 控制 */
    animation: rise linear infinite;
    will-change: transform, opacity;
    opacity: 0.85;
}

@keyframes rise {
    0% {
        transform: translateY(0) translateX(0) scale(1);
        opacity: 0;
    }

    10% {
        opacity: 0.8;
    }

    70% {
        opacity: 0.5;
    }

    100% {
        transform: translateY(-95vh) translateX(20px) scale(0.25);
        opacity: 0;
    }
}

/* 内容层 */
.content {
    position: relative;
    z-index: 10;
    width: 100%;
    height: 100%;
}
</style>