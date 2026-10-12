<template>
    <div v-show="isShow" class="layout">
        <div class="loading-overlay" v-if="isShowMask ?? true"></div>
        <div class="loadingLayout">
            <div class="loading-spinner"></div>
        </div>
    </div>
</template>

<script lang="ts" setup name="OverLoading">
import { onMounted, ref } from 'vue';
let isShow = ref(false)
defineProps(['isShowMask'])

onMounted(() => {
    isShow.value = true
})
</script>

<style scoped>
.layout {
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    touch-action: none;
    z-index: 1000;
}

.loading-overlay {
    width: 100%;
    height: 100%;
    background-color: #00000066;
    animation: mask 0.3s linear;
}

.loadingLayout {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.loading-spinner {
    border: 0.3rem solid #f3f3f3;
    border-top: .2rem solid var(--theme-color);
    border-radius: 50%;
    width: 2rem;
    height: 2rem;
    animation: spin 1s linear infinite, show 0.2s ease;
}


@keyframes mask {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

@keyframes show {
    0% {
        transform: scale(0);
    }

    100% {
        transform: scale(1);
    }
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>