<template>
    <div
        style="position: fixed;display: flex;align-items: center;justify-content: center;left: 0;top: 0;width: 100%;height: 100%;z-index: 100;">
        <BaseDialog ref="baseDialogRef">
        </BaseDialog>
        <transition name="layout" @after-leave="props.dismiss">
            <div v-show="isShow" class="layout">
                <img id="bg" src="/image/b_bg.png">
                <div class="content">
                    <div class="title">
                        {{ $t('common.gameIntro') }}
                    </div>
                    <div class="rule-text">
                        <div v-for="(item, index) in ruleTextArr" :key="index">
                            <span :style="{ 'color': item.startsWith('#') ? 'white' : '#999' }">{{ item.replace('#', '')
                                }}</span>
                            <br />
                            <br />
                        </div>
                    </div>

                </div>
                <div @click="close_" class="close">
                    <img src="/image/close.svg" alt="">
                </div>
            </div>
        </transition>
    </div>

</template>

<script lang="ts" setup>
const { t } = useI18n()
import { computed, onMounted, ref } from 'vue';
import BaseDialog from './BaseDialog.vue';

const props = defineProps(['dismiss'])

let isShow = ref(false)

const baseDialogRef = ref(null)

const ruleTextArr = computed(() => [
    t('battleHelp.rule1'),
    t('battleHelp.rule2'),
    t('battleHelp.rule3'),
    t('battleHelp.rule4'),
    t('battleHelp.rule5'),
    t('battleHelp.twoPlayer'),
    t('battleHelp.twoRule1'),
    t('battleHelp.twoRule2'),
    t('battleHelp.threePlayer'),
    t('battleHelp.threeRule1'),
    t('battleHelp.threeRule2'),
    t('battleHelp.threeRule3'),
    t('battleHelp.fourPlayer'),
    t('battleHelp.fourRule1'),
    t('battleHelp.fourRule2'),
    t('battleHelp.fourRule3')
])

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

onMounted(() => {
    window.addEventListener("resize", handleResizeEvent);
    doHtmlBgSize()
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
    width: 7%;
    position: absolute;
    right: 0;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
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
    height: 9%;
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


@media screen and (max-width:995px) {


    .title {
        font-size: 18px;
    }

    .rule-text {
        font-size: 16px;
    }
}
</style>