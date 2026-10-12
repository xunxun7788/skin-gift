<template>
    <div class="root-layout">
        <BaseDialog ref="baseDialogRef"></BaseDialog>
        <transition name="layout" @after-leave="closeDialog">
            <div v-show="isShow" class="layout">
                <img id="bg" src="/image/op_dialog.png">
                <div class="content">
                    <div class="title">
                        {{ props.title ?? $t('opDialog.tip') }}
                    </div>
                    <div
                        style="margin: 0 5%;display: flex;flex-direction: column;justify-content: center;height: 100%;">

                        <div v-if="props.type == 'joinBattle'"
                            style="flex-grow: 1;display: flex;font-weight: bold;color: var(--color-d6);justify-content: center;align-items: center;height: 0;font-size: 150%;">
                            <span>{{ $t('opDialog.confirmConsume') }}</span>
                            <img style="height: 0.8rem;" src="/image/zs.svg">
                            <span class="text-gradien">{{ props.price }}</span>
                            {{ $t('opDialog.joinBattleQuestion') }}
                        </div>
                        <div v-else
                            style="flex-grow: 1;display: flex;justify-content: center;align-items: center;height: 0;font-size: 150%;">
                            {{
                                props.text }}</div>
                        <div style="display: flex;flex-direction: column;margin-bottom: 8%;">
                            <div class="actions">
                                <div @click="close_" class="btn">{{ $t('opDialog.cancel') }}</div>
                                <div @click="next" class="btn btn-fill">{{ $t('opDialog.confirm') }}</div>
                            </div>
                            <div v-if="props.agreeKey"
                                style="display: flex;gap: 0.2rem;font-size: var(--font-size-18);color: #999;justify-content: center;margin-top: 1rem;">
                                <img @click="isAgree = !isAgree" :src="`/image/a_cb${isAgree ? '1' : ''}.svg`">
                                {{ $t('opDialog.dontShowAgain') }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';
import BaseDialog from './BaseDialog.vue';

const { close, props, onSubmit, id } = defineProps(['close', 'onSubmit', 'props', 'id'])

const isShow = ref(false)

const isAgree = ref(false)

const baseDialogRef = ref(null)

const handleResizeEvent = () => {
    doHtmlBgSize()
}

function doHtmlBgSize() {
    if (window.innerWidth >= 650) {
        document.getElementById('bg')!.style.width = '600px'
        document.getElementById('bg')!.style.height = '430px'
    } else {
        let width = window.innerWidth - 50;
        let height = width / 600 * 430;
        document.getElementById('bg')!.style.width = `${width}px`
        document.getElementById('bg')!.style.height = `${height}px`
    }
}

onMounted(() => {
    doHtmlBgSize()
    window.addEventListener("resize", handleResizeEvent);
    isShow.value = true
})

function close_() {
    if (baseDialogRef.value) {
        baseDialogRef.value.close()
    }
    isShow.value = false
}

function next() {
    close_()
    if (props.agreeKey) {
        localStorage.setItem(props.agreeKey, '' + isAgree.value)
    }
    onSubmit()
}

function closeDialog() {
    close(id)
}

onUnmounted(() => {
    window.removeEventListener('resize', handleResizeEvent)
})

</script>

<style scoped>
.root-layout {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 200;
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
    align-items: center;
    position: relative;
    margin: 0 1rem;
    justify-content: center;
}

.content {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
}

.title {
    height: 25%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    font-size: 180%;
}


.actions {
    display: flex;
    justify-content: center;
    gap: 5%;
    font-weight: bold;
}

.actions .btn {
    border: 1px solid var(--theme-color);
    font-size: 140%;
    border-radius: 4px;
    cursor: pointer;
    white-space: nowrap;
    box-sizing: border-box;
    user-select: none;
    display: flex;
    padding: 2% 10%;
    color: var(--theme-color);
    align-items: center;
}

.actions .btn-fill {
    border: none;
    background: linear-gradient(180deg, white, var(--theme-color));
    color: #CD6200;
}
</style>