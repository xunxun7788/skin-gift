<template>
    <div class="op-dialog">
        <BaseDialog ref="baseDialogRef">
        </BaseDialog>
        <transition name="layout" @after-leave="props.dismiss">
            <div v-show="isShow" class="op-dialog-body">
                <span class="op-title font-32">{{ $t('recharge.Qrcode') }}</span>
                <div class="qr-box">
                    <QrcodeSvg :value="url" :size="200" render-as="svg" level="Q"></QrcodeSvg>
                </div>
                <div v-on:click="close_" class="close">
                    <img class="size-1rem" src="/image/close.svg" alt="">
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { QrcodeSvg } from 'qrcode.vue';
import { onMounted, ref } from 'vue';
import BaseDialog from '../BaseDialog.vue';

const props = defineProps(['dismiss', 'url'])

const isShow = ref(false)

const baseDialogRef = ref<any>(null)

onMounted(() => {
    isShow.value = true
})


function close_() {
    if (baseDialogRef.value) {
        baseDialogRef.value.close()
    }
    isShow.value = false
}

</script>

<style scoped>
.op-dialog {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 200;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.op-dialog-body {
    width: 300px;
    gap: 1.3rem;
    position: relative;
    justify-content: center;
    align-items: center;
    background-color: #171A21FF;
    border-radius: .66rem;
    border: 1px solid #333A47FF;
    padding: 1rem;
    display: flex;
    flex-direction: column;
}

.qr-box {
    padding: 12px;
    border-radius: 16px;
    background-color: white;
}

.close {
    position: absolute;
    right: 0;
    top: 0;
    padding: .5rem;
}

.op-title {
    height: 2rem;
}

.layout-enter-active {
    animation: anima-layout-in 0.3s ease;
}

.layout-leave-active {
    animation: anima-layout-out 0.3s ease;
}

@keyframes anima-layout-in {
    0% {
        opacity: 0;
        transform: scale(.5);
    }

    100% {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes anima-layout-out {
    0% {
        opacity: 1;
    }

    100% {
        opacity: 0;
        transform: scale(.5)
    }
}
</style>