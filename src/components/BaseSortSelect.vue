<template>
    <div class="mask"></div>
    <transition name="layout">
        <div v-if="isShow" class="layout">
            <div v-for="[key, value] of actions" :key="key" @click="onSelect(key)" class="item">
                {{ isShowIcon == false ? key : key.substring(0, key.length - 1) }}
                <img v-if="isShowIcon != false"
                    :style="{ height: '0.83rem', 'margin-left': '0.2rem', 'transform': key.endsWith('2') ? 'scaleY(-1)' : 'scaleY(1)' }"
                    src="/image/down.svg">
            </div>
        </div>
    </transition>

</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

const x = defineProps(['actions', 'isShowIcon', 'onSelect'])

const isShow = ref(false)

onMounted(() => {
    isShow.value = true
})

</script>

<style scoped>
.layout-enter-from {
    transform: scale(0);
}

.layout-enter-active {
    transform-origin: 50% 0%;
    transition: all 0.3s ease;
}

.mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 9;
    background-color: transparent;
}

.layout {
    position: absolute;
    top: calc(100% + 4px);
    left: 0;
    min-width: 100%;
    border-radius: 4px;
    padding: 0.5rem 0;
    gap: 0.42rem;
    display: flex;
    flex-direction: column;
    background-color: #060403;
    z-index: 10;
}

.item {
    height: 1.5rem;
    color: #999;
    display: flex;
    padding: 0 1rem;
    font-size: var(--font-size-18);
    align-items: center;
    justify-content: start;
    font-size: var(--font-size-18);
}

@media screen and (max-width:995px) {
    .item {
        font-size: 1rem;
        height: 2rem;
    }
}
</style>