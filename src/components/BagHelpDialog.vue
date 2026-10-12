<template>
    <div
        style="position: fixed;display: flex;align-items: center;justify-content: center;left: 0;top: 0;width: 100%;height: 100%;z-index: 100;">
        <BaseDialog ref="baseDialogRef">
        </BaseDialog>
        <transition name="layout" @after-leave="close">
            <div v-show="isShow" class="layout">
                <img class="bg" src="/image/b_bg.png">
                <div class="content">
                    <div class="title">
                        {{ $t('common.rules') }}
                    </div>
                    <div class="rule-text">
                        <div v-for="(item, index) in ruleTextArr" :key="index">
                            <span>{{ item }}</span>
                            <br />
                            <br />
                        </div>
                    </div>

                </div>
                <div @click="close_" class="close"></div>
            </div>
        </transition>
    </div>

</template>

<script lang="ts" setup>
const { t } = useI18n()
import { onMounted, ref, computed } from 'vue';
import BaseDialog from './BaseDialog.vue';

defineProps(['close'])

let isShow = ref(false)

const baseDialogRef = ref(null)

const ruleTextArr = computed(() => [
    t('bagHelp.rule1'),
    t('bagHelp.rule2'),
    t('bagHelp.rule3')
])

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
    aspect-ratio: 1;
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