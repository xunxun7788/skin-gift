<template>
    <div class="op-dialog">
        <BaseDialog ref="baseDialogRef">
        </BaseDialog>
        <transition name="layout" @after-leave="props.dismiss">
            <div v-show="isShow" class="op-dialog-body">
                <img src="/image/b_bg.png" alt="">
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import BaseDialog from '../BaseDialog.vue';

const props = defineProps(['dismiss'])

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
    width: 500px;
    gap: 1.3rem;
    justify-content: center;
    align-items: center;
    background-size: 100%;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
}

.op-dialog-actions {
    display: flex;
    width: 100%;
    align-items: center;
    gap: 1rem;
    height: 2rem;
}

.op-dialog-btn {
    flex: 1;
    height: 100%;
    background-color: #333A47FF;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #EDEFF3FF;
    border-radius: 1rem;
}

@media screen and (max-width: 995px) {
    .op-dialog-body {
        max-width: 80%;
    }

    .op-dialog-body img {
        width: 100%;
    }
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