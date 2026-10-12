<template>
    <div class="mobile-layout _mobile">
        <div style="height: 4rem;padding: 0 1rem;">
            <BaseTab ref="baseTabRef" :tabs="tabs"
                :change-tab="changeTab" />
        </div>
    </div>
</template>

<script lang="ts" setup>
const { t } = useI18n()
import { onMounted, ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BaseTab from './BaseTab.vue';
const router = useRouter()
let { path } = useRoute()

const baseTabRef = ref(null)

const tabs = computed(() => [
    t('mine.personalCenter'),
    t('mine.accountRecharge'),
    t('mine.myBag'),
    t('mine.balanceDetail'),
    t('mine.goodsRecord'),
    t('mine.promotionDividend'),
    t('mine.siteMessage')
])

onMounted(() => {
    router.beforeEach((to, from, next) => {
        setCurrentTab(to.path)
        next()
    })
    setCurrentTab(path)
})

function setCurrentTab(path: string) {
    if (baseTabRef.value == null) {
        return
    }
    if (path.endsWith('userinfo')) {
        baseTabRef.value.setCurrentTab(0)
    } else if (path.endsWith('recharge')) {
        baseTabRef.value.setCurrentTab(1)
    } else if (path.endsWith('bag')) {
        baseTabRef.value.setCurrentTab(2)
    } else if (path.endsWith('balance')) {
        baseTabRef.value.setCurrentTab(3)
    } else if (path.endsWith('goods')) {
        baseTabRef.value.setCurrentTab(4)
    } else if (path.endsWith('share')) {
        baseTabRef.value.setCurrentTab(5)
    } else if (path.endsWith('message')) {
        baseTabRef.value.setCurrentTab(6)
    }
}

function changeTab(index: number) {
    let path = ""
    switch (index) {
        case 0:
            path = "userinfo"
            break;
        case 1:
            path = "recharge"
            break;
        case 2:
            path = "bag"
            break;
        case 3:
            path = 'balance'
            break;
        case 4:
            path = 'goods'
            break;
        case 5:
            path = "share"
            break;
        case 6:
            path = "message"
            break;
    }
    router.push({
        name: path
    })
}

</script>

<style scoped>
.mobile-layout {
    z-index: 20;
    position: fixed;
    overflow-x: auto;
    width: 100%;
    top: var(--window-headerNav-height);
    white-space: nowrap;
    border-bottom: 1px solid var(--theme-color-30);
    background-color: #1A1C24;
}
</style>