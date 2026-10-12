<template>
    <div class="layout _windows">
        <div @click="goToPage(item.action)" v-for="(item, index) in arr" :key="index" class="item">
            <div class="item-bg"></div>
            <div
                style="position: absolute;gap: 0.1rem;top: 0;left: 0;width: 100%;height: 100%;display: flex;flex-direction: column;justify-content: center;align-items: center;">
                <img style="height: 28%;" :src="`/image/f_i${item.icon}.svg`">
                <span style="font-size: 0.5rem;">{{ item.text }}</span>
            </div>
        </div>
    </div>
    <div :style="{ 'transform': isShowMobileLayout ? 'translateX(0) translateY(-50%)' : 'translateX(67.5%) translateY(-50%)' }"
        class="layout _mobile mobile-layout">
        <div style="display: flex;align-items: center;">
            <div @click="showMobileLayout" class="left-arrow">
                <div style="width: 30px;height: 65px;background-color: #4F4F4F;border-radius: 4px 0 0 4px;"></div>
                <div
                    style="cursor: pointer;position: absolute;left: 0;top: 0;right: 0;bottom: 0;display: flex;align-items: center;justify-content: center;">
                    <img :style="`transform: rotate(${isShowMobileLayout ? '0' : '180'}deg);transition: all 0.5s ease;`"
                        src="/image/f_right.svg">
                </div>
            </div>
            <div class="right-body">
                <div @click="goToPage('fuli')" class="cell">
                    <img style="width: 34px;height: 34px;" :src="`/image/f_i6.svg`">
                    {{ $t('nav.fuli') }}
                </div>
                <div @click="goToPage(item.action)" class="cell" v-for="item in arr">
                    <img style="width: 34px;height: 34px;" :src="`/image/f_i${item.icon}.svg`">
                    {{ item.text }}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
const { t } = useI18n()
import { computed, ref } from 'vue';
import { isMobile } from 'vue-device-detect';
import router from '../router';
import { useUserStore } from '../store/user';
import { showLoginDialog } from '../utils';


const useUser = useUserStore()


const isShowMobileLayout = ref(false)

const arr = computed(() => [
    { 'icon': '1', 'action': 'share', 'text': t('common.promotion') },
    { 'icon': '2', 'action': 'bag', 'text': t('mine.myBag') },
    { 'icon': '3', 'action': 'kf', 'text': t('common.customerService') },
    { 'icon': '4', 'action': 'redpacket', 'text': t('common.redPacket') },
    { 'icon': '5', 'action': 'top', 'text': t('common.backToTop') },
])

function showMobileLayout() {
    isShowMobileLayout.value = !isShowMobileLayout.value
}

function goToPage(action: string) {

    switch (action) {
        case 'share':
        case 'bag':
        case 'fuli':
            if (!useUser.isLogin) {
                showLoginDialog()
                return
            }
            showMobileLayout()
            router.push({
                name: action
            })
            break;
        case 'top':
            window.scrollTo({
                top: 0, left: 0, behavior: 'smooth'
            })
            break;

        case 'kf':
            if (isMobile) {
                window.open(`https://www.bangwo8.com/osp2016/im/h5/index.php?vendorID=1247107&authaccount=${useUser.userInfo.id}`, '_blank')
            } else {
                window.open(`https://www.bangwo8.com/osp2016/im/pc/index.php?vendorID=1247107&authaccount=${useUser.userInfo.id}`, '_blank')
            }
            break;
    }

}

</script>

<style scoped>
.layout {
    position: fixed;
    right: 0;
    top: 50%;
    display: flex;
    z-index: 10;
    transform: translateY(-50%);
    flex-direction: column;
    justify-content: center;
    gap: 0.4rem;
}

.item {
    position: relative;
    cursor: pointer;
    user-select: none;
}

.item:hover>.item-bg {
    background: url('/image/f_bg1.svg') no-repeat;
    background-size: 100% 100%;
}

.item-bg {
    background: url('/image/f_bg.svg') no-repeat;
    background-size: 100% 100%;
    width: 3.33rem;
    height: 3.33rem;
}

.left-arrow {
    position: relative;
}


.mobile-layout {
    transition: all 0.3s ease;
}

.right-body {
    display: flex;
    flex-direction: column;
    background-color: #4F4F4F;
    border-radius: 4px 0 0 4px;
    gap: 14px;
    padding: 12px 12px;
}

.cell {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 12px;
    gap: 4px;
    cursor: pointer;
}
</style>