<template>

    <div
        style="position: fixed;display: flex;align-items: center;justify-content: center;top: 0;left: 0;width: 100%;height: 100%;z-index: 103;">
        <BaseDialog ref="baseDialogRef" />
        <transition name="layout" @after-leave="close">
            <div v-show="isShow" class="layout">
                <img class="bg" :src="`/image/${type}.svg`">
                <div
                    style="display: flex;justify-content: center;width: 100%;height: 100%;top: 0;left: 0;position: absolute;">
                    <div
                        style="margin-top: 54.8%;height: 43%;aspect-ratio: 1;display: flex;align-items: center;justify-content: center;">
                        <img style="width: 90%;" :src="src">
                    </div>
                </div>
                <img @click="close_" v-show="isShowClose"
                    style="width: 1rem;height: 1rem;cursor: pointer;position: absolute;top: -0.5rem;right: -1rem;">
            </div>
        </transition>

    </div>

</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import BaseDialog from './BaseDialog.vue';

defineProps(['type', 'src', 'close'])

const baseDialogRef = ref(null)

const isShow = ref(false)

const isShowClose = ref(false)

onMounted(() => {
    isShow.value = true
    //2s 后 显示 x
    setTimeout(() => {
        isShowClose.value = true
    }, 2000);
})


function close_() {
    if (baseDialogRef.value) {
        baseDialogRef.value.close()
    }
    isShow.value = false
}

</script>

<style scoped>
.layout-enter-active {
    animation: anima-layout-in 0.3s ease;
}

.layout-leave-active {
    animation: anima-layout-out 0.3s ease;
}

@keyframes anima-layout-in {
    0% {
        opacity: 0;
        transform: translateY(-100%);
    }

    50% {
        transform: translateY(10%);
    }

    100% {
        opacity: 1;
    }
}

@keyframes anima-layout-out {
    0% {
        opacity: 1;
    }

    10% {
        transform: translateY(10%);
    }

    100% {
        opacity: 0;
        transform: translateY(-100%);
    }
}

.layout {
    position: relative;
    margin: 2rem;
}

.bg {
    width: 100%;
    max-width: 500px;
}
</style>