<template>
    <div class="ring-progress" :style="{ width: size + 'px', height: size + 'px' }">
        <svg viewBox="0 0 100 100">
            <!-- 背景底环 -->
            <circle class="ring-bg" cx="50" cy="50" :r="radius" fill="none" :stroke-width="strokeWidth" />
            <!-- 进度环 -->
            <circle class="ring-value" cx="50" cy="50" :r="radius" fill="none" :stroke-width="strokeWidth"
                stroke-linecap="round" :stroke-dasharray="dashArray" :stroke-dashoffset="dashOffset"
                :style="{ stroke: color, transition: 'stroke-dashoffset 0.4s ease' }" />
        </svg>

    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
    percent: number
    size?: number // 整体尺寸px
    strokeWidth?: number // 圆环粗细
    color?: string // 进度条颜色
    bgColor?: string // 背景环颜色
}

const props = withDefaults(defineProps<Props>(), {
    size: 120,
    strokeWidth: 10,
    color: '#36c',
    bgColor: '#e5e7eb'
})

// 计算半径
const radius = computed(() => {
    return 50 - props.strokeWidth / 2
})

const dashArray = computed(() => 2 * Math.PI * radius.value)
const dashOffset = computed(() => {
    const p = props.percent >= 100 ? 0 : Math.max(0, Math.min(100, props.percent))
    return dashArray.value * (1 - p / 100)
})
</script>

<style scoped>
.ring-progress {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

svg {
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
    /* 起点从顶部开始 */
}

.ring-bg {
    stroke: #6B7280FF;
}
</style>
