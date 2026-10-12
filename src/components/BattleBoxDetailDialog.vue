<template>
    <div ref="layoutRef"
        style="z-index: 101;position: fixed;left: 0;top: 0;display: flex;align-items: center;justify-content: center;width: 100%;height: 100%;font-size: 1rem;">
        <BaseDialog ref="baseDialogRef" />
        <div style="display: flex;align-items: center;justify-content: center;">
            <transition name="layout" @after-leave="close">
                <div v-show="isShow" class="layout">
                    <div
                        style="position: absolute;left: 0;top: 0;width: 100%;height: 100%;display: flex;flex-direction: column;">
                        <div style="height: 8.8%;">
                            <div
                                style="height: 8.8%;margin-left: 2%;margin-right: 7%;position: absolute;top: 0;left: 0;width: calc(100% - 9%);font-weight: bold;display: flex;align-items: center;justify-content: space-between;">
                                <span>{{ boxDetailData?.item?.box_name }}</span>
                                <div v-show="boxDetailData.probability != null"
                                    style="display: flex;gap: 0.65rem;align-items: center;height: 100%;">
                                    <div v-for="(value, key) in boxDetailData.probability"
                                        style="display: flex;align-items: center;">
                                        <svg width="0.83rem" height="0.83rem" viewBox="0 0 20 21" fill="none"
                                            xmlns="http://www.w3.org/2000/svg">
                                            <g id="&#230;&#166;&#130;&#231;&#142;&#135;"
                                                clip-path="url(#clip0_819_37821)">
                                                <path :fill="key" id="box-gl" fill-rule="evenodd" clip-rule="evenodd"
                                                    d="M11.6378 0.506232C16.0219 0.997899 19.5019 4.47957 19.9944 8.8629H19.9936C20.0076 8.99819 19.993 9.13491 19.9508 9.2642C19.9086 9.3935 19.8397 9.51248 19.7486 9.61344C19.6574 9.7144 19.5461 9.79508 19.4218 9.85026C19.2975 9.90543 19.163 9.93387 19.0269 9.93373H11.5394C11.0028 9.93373 10.5669 9.4979 10.5669 8.96207V1.47373C10.5666 1.33761 10.5948 1.20294 10.6499 1.07846C10.705 0.953981 10.7856 0.842491 10.8866 0.751236C10.9876 0.659981 11.1067 0.591006 11.2361 0.548795C11.3655 0.506584 11.5024 0.492082 11.6378 0.506232ZM10.4603 11.007H17.9478C18.0838 11.0065 18.2185 11.0347 18.343 11.0897C18.4674 11.1446 18.5789 11.2252 18.6702 11.3262C18.7615 11.4271 18.8305 11.5461 18.8727 11.6755C18.9149 11.8049 18.9294 11.9417 18.9153 12.077C18.3753 16.8879 14.2386 20.6095 9.25859 20.492C4.22609 20.3754 0.121921 16.2695 0.00275389 11.2354C-0.113079 6.25535 3.60859 2.11952 8.41775 1.58035C8.98859 1.51535 9.48775 1.97202 9.48775 2.54702V10.0354C9.48797 10.2931 9.59053 10.5403 9.77289 10.7225C9.95524 10.9047 10.2025 11.007 10.4603 11.007Z" />
                                            </g>
                                            <defs>
                                                <clipPath id="clip0_819_37821">
                                                    <rect width="20" height="20" fill="white"
                                                        transform="translate(0.000244141 0.5)" />
                                                </clipPath>
                                            </defs>
                                        </svg>
                                        <span :style="{ color: key }" class="probability-text">{{ value }}%</span>
                                    </div>
                                </div>
                            </div>
                            <img @click="close_"
                                style="width: 3.5%;cursor: pointer;position: absolute;top: 1.8%;right: 1.8%;">
                        </div>
                        <div class="content">
                            <div class="gridBox">
                                <div v-for="(item, index) in boxDetailData.goods_list" class="content-item"
                                    :key="index">
                                    <img class="itemBg" :src="getGoodsBgByColor(item.color)">
                                    <img class="gun" :src="$cdnUrl + item.goods_image">
                                    <div class="text">
                                        <div
                                            style="font-family: din;color: var(--theme-color);display: flex;align-items: center;">
                                            <span
                                                style="background: url(/image/zs.svg) no-repeat;background-size: cover;width: 0.5rem;margin-right: 0.1rem;height: 0.5rem;"></span>
                                            {{ item.show_price }}
                                        </div>
                                        <div class="name">{{ item.goods_name }}</div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </transition>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';
import useBattle from '../hooks/useBattle';
import { getGoodsBgByColor } from '../utils';
import BaseDialog from './BaseDialog.vue';

const { apiBattleBoxDetail, boxDetailData, boxDetailEmptyText, boxDetailLoadState } = useBattle()

const x = defineProps(['id', 'close'])

const isShow = ref(false)

const baseDialogRef = ref(null)

const layoutRef = ref(null)

const handleResizeEvent = () => {
    doHtmFontSize();
}

function doHtmFontSize() {
    if (window.innerWidth >= 760) {
        layoutRef.value.style.fontSize = '24px'
    } else {
        layoutRef.value.style.fontSize = '1rem'
    }
}

onMounted(() => {
    window.addEventListener("resize", handleResizeEvent);
    isShow.value = true
    apiBattleBoxDetail(x.id)
})

onUnmounted(() => {
    window.removeEventListener('resize', handleResizeEvent)
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
    display: flex;
    flex-direction: column;
}

.bg {
    width: 100%;
    max-width: 700px;
}

.probability-text {
    font-family: din;
    font-size: var(--font-size-20);
    font-weight: bold;
    margin-left: 0.15rem;
}

.content {
    flex-grow: 1;
    width: 100%;
    height: 0;
    margin-bottom: 0.6rem;
    box-sizing: border-box;
    overflow-y: auto;
}

.gridBox {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    padding: var(--font-size-15);
    gap: 0.3rem;
    row-gap: 0.3rem;
}

.content-item {
    display: flex;
    position: relative;
    justify-content: center;
    align-items: center;
    text-align: center;
    cursor: pointer;
}

.itemBg {
    width: 100%;
}

.gun {
    height: 70%;
    position: absolute;
    top: 50%;
    left: 50%;
    object-fit: contain;
    transform: translate(-50%, -50%);
    vertical-align: middle;
}


.text {
    position: absolute;
    display: flex;
    width: 100%;
    flex-direction: column;
    text-align: left;
    bottom: 0.5rem;
    left: 0.5rem;
    font-size: var(--font-size-14);
}

.name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 90%;
    text-align: left;
    font-size: 0.5rem;
}
</style>