<template>
    <div
        style="position: fixed;display: flex;align-items: center;justify-content: center;left: 0;top: 0;width: 100%;height: 100%;z-index: 100;">
        <BaseDialog ref="baseDialogRef">
        </BaseDialog>
        <transition name="layout" @after-leave="dismiss">
            <div v-show="isShow" class="layout">
                <img id="bg" src="/image/b_bg.png">
                <div class="content">
                    <div class="title">
                        {{ $t('common.gameIntro') }}
                    </div>
                    <div class="rule-text">
                        <p>
                            {{ $t('fuliHelp.rule1') }}
                            <span style="color: white">{{ $t('fuliHelp.rule1Note') }}</span>
                            {{ $t('fuliHelp.rule1Decay') }}
                        </p>
                        <br>
                        <p style="color: white">{{ $t('fuliHelp.rule2') }}</p>
                        <br>
                        <p>{{ $t('fuliHelp.rule3') }}</p>
                        <br>
                        <p>{{ $t('fuliHelp.rule4') }}</p>
                        <br>
                        <table border="1" style="border-collapse:collapse;width: 100%;">
                            <tbody>
                                <!-- 表头：字段名称 -->
                                <tr>
                                    <td align="center">{{ $t('fuliHelp.level') }}</td>
                                    <td align="center">{{ $t('fuliHelp.levelValue') }}</td>
                                    <td align="center">{{ $t('fuliHelp.decayValue') }}</td>
                                </tr>
                                <!-- 循环每一条helpData，一条数据 = 一行tr -->
                                <tr v-for="item in helpData" :key="item.level">
                                    <td align="center">
                                        <font color="#FFBF00">{{ item.level }}</font>
                                    </td>
                                    <td align="center" style="color: var(--color-d6);">
                                        {{ item.accumulate_num }}
                                    </td>
                                    <td align="center" style="color: var(--color-d6);">
                                        {{ item.decr }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <br>
                        <p>{{ $t('fuliHelp.rule5') }}</p>
                    </div>
                </div>

                <!-- <div @click="close_" class="close"></div> -->
            </div>
        </transition>
    </div>

</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from 'vue';
import useFuli from '../hooks/useFuli';
import BaseDialog from './BaseDialog.vue';

const { apiFuliHelp } = useFuli()

defineProps(['dismiss'])

let isShow = ref(false)

const helpData = reactive([])

const baseDialogRef = ref(null)

const handleResizeEvent = () => {
    doHtmlBgSize()
}

function doHtmlBgSize() {
    if (window.innerWidth >= 550) {
        document.getElementById('bg')!.style.width = '550px'
        document.getElementById('bg')!.style.height = '680px'
    } else {
        let width = window.innerWidth;
        let height = width / 550 * 680;
        document.getElementById('bg')!.style.width = `${width}px`
        document.getElementById('bg')!.style.height = `${height}px`
    }
}

onMounted(async () => {
    isShow.value = true
    window.addEventListener("resize", handleResizeEvent);
    doHtmlBgSize()
    const result = await apiFuliHelp()
    if (result) {
        Object.assign(helpData, result.data.data.level)
    }
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
    align-items: center;
    position: relative;
    margin: 0 1rem;
    justify-content: center;
}

.close {
    height: 6.5%;
    width: 7.5%;
    position: absolute;
    right: 0;
    top: 0;
    cursor: pointer;
    user-select: none;
}

.bg {
    width: 100%;
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
    height: 8%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    font-size: 1rem;
}

.rule-text {
    height: 0;
    flex-grow: 1;
    padding: 0 0.6rem;
    margin-top: 1rem;
    margin-bottom: 2rem;
    font-size: var(--font-size-18);
    color: #999;
    overflow-y: auto;
}
</style>