<template>
    <div class="top-layout">
        <img v-on:click="toggle" class="drawer _windows" src="/image/drawer.svg" alt="">
        <img class="_mobile" style="width: 30px;height: 30px;" src="/image/logor.svg" alt="">
        <div class="online">
            <img class="size-1rem" src="/image/online.svg" alt="">
            <div class="flex-col">
                <span class="line-count font-14">{{ onlineCount }}</span>
                <span class="line-user font-12">{{ $t('footer.onlineUsers') }}</span>
            </div>
        </div>
        <div class="top-right">
            <img v-on:click="changeSound" class="btn drawer _windows" :src="`/image/sound_${sound ? 'on' : 'off'}.svg`"
                alt="">
            <img v-on:click="showDialog" class="_mobile drawer" src="/image/set.svg" alt="">
            <LanguageSwitcher class="_windows" />
            <div v-if="!userStore.isLogin" v-on:click="loginWithSteam()" class="login-btn btn">
                <img class="size-1rem" src="/image/steam.svg" alt="">
                <span class="_windows">{{ $t('nav.loginSteam') }}</span>
                <span class="_mobile">{{ $t('nav.login') }}</span>
            </div>
            <div v-else class="base-row gap-12 flex-align-center font-18 font-FFBF00 bold din">
                <img v-on:click="goToProfile" class="user-logo btn" :src="getImageUrl(userStore.userInfo.avatar)"
                    alt="">
                <span>{{ priceUnit() }}{{ formatCoin(userStore.userInfo.amount) }}</span>
                <img v-on:click="goToRecharge" class="size-1rem btn" src="/image/create_add.svg" alt="">
                <div v-on:click="showNoticeDialog" class="notice btn">
                    <img class="size-1rem" src="/image/notice.svg" alt="">
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { inject, onMounted, onUnmounted, ref } from 'vue';
import useConfig from '../hooks/useConfig.ts';
import axiosTools from '../hooks/useHttp';
import useMine from '../hooks/useMine';
import router from '../router/index.ts';
import { useUserStore } from '../store/user.ts';
import { showNoticeDialog, showSetDialog } from '../utils/dialogs.ts';
import { config, formatCoin, getImageUrl, priceUnit } from '../utils/index.ts';
import LanguageSwitcher from './LanguageSwitcher.vue';

const { apiUserInfo } = useMine()

const userStore = useUserStore()
const { changeSound, sound } = useConfig()
const httpTools = axiosTools();

const emitter = inject<any>("emitter");


const onlineCount = ref('')

const isOpen = ref(true)

onMounted(() => {
    apiGetConfig()
    emitter.on('upUserData', handleUpUserData)
    upUserInfo()
})

const handleUpUserData = () => {
    upUserInfo()
}

function goToProfile() {
    router.push({
        name: 'profile'
    })
}

function goToRecharge() {
    router.push({
        name: 'recharge'
    })
}

function loginWithSteam() {
    const returnTo = encodeURIComponent(`${config.webUrl}auth`)
    const realm = encodeURIComponent(config.webUrl)
    const url =
        'https://steamcommunity.com/openid/login' +
        '?openid.ns=' + encodeURIComponent('http://specs.openid.net/auth/2.0') +
        '&openid.mode=checkid_setup' +
        `&openid.return_to=${returnTo}` +
        `&openid.realm=${realm}` +
        '&openid.identity=' + encodeURIComponent('http://specs.openid.net/auth/2.0/identifier_select') +
        '&openid.claimed_id=' + encodeURIComponent('http://specs.openid.net/auth/2.0/identifier_select')

    window.location.href = url
}


async function upUserInfo() {
    if (userStore.isLogin) {
        const result = await apiUserInfo()
        if (result) {
            userStore.upDateUserInfo(result.data.data.list)
        }
    }
}

function toggle() {
    isOpen.value = !isOpen.value;
    emitter.emit('toggleMainMenu', { isOpen: isOpen.value })
}


function showDialog(e: MouseEvent) {
    const el = e.currentTarget as HTMLElement
    const rect = el.getBoundingClientRect()
    const sx = e.view!.innerWidth - rect.left - 60
    const sy = rect.y + rect.height
    showSetDialog(
        {
            sx: sx,
            sy: sy
        }
    )
}

async function apiGetConfig(
) {
    try {
        const result = await httpTools.get("app/config");
        const code = result.data.code;
        if (code == 1) {
            onlineCount.value = result.data.data.online_nums
        }
    } catch (error) {

    }
}

onUnmounted(() => {
    emitter.off('upUserData', handleUpUserData)
})

</script>

<style scoped>
.top-layout {
    height: var(--window-headerNav-height);
    overflow-y: auto;
    background-color: #171A21;
    align-items: center;
    z-index: 10;
    flex-shrink: 0;
    overflow-y: hidden;
    padding: 0 .67rem;
    display: flex;
}

.user-logo {
    width: 1.9rem;
    height: 1.9rem;
    border-radius: 1rem;
}

.notice {
    position: relative;
    padding: .4rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.notice-point {
    position: absolute;
    top: .35rem;
    right: .35rem;
    width: .25rem;
    height: .25rem;
    background-color: #F85149FF;
    border-radius: .25rem;
}

.drawer {
    width: 1rem;
    height: 1rem;
    padding: .67rem;
    cursor: pointer;
}

.online {
    flex: 1;
    margin-left: .67rem;
    display: flex;
    padding: .41rem;
    gap: .33rem;
    font-size: .6rem;
    align-items: center;
}

.line-count {
    color: #3FB950FF;
    font-family: 'din';
    font-weight: bold;
}

.line-user {
    color: #6B7280FF;
}

.top-right {
    display: flex;
    gap: .67rem;
    align-items: center;
}

.login-btn {
    display: flex;
    background-color: #FFBF00FF;
    border-radius: 1.5rem;
    align-items: center;
    color: #1A1206FF;
    font-weight: bold;
    font-size: .67rem;
    gap: .5rem;
    padding: 0 1rem;
    height: 2.33rem;
}

@media screen and (max-width:995px) {

    .login-btn {
        padding: 0 4px;
        padding-right: 10px;
        height: 32px;
        font-size: 16px;
        gap: 8px;
    }

    .top-layout {
        background-color: #0E1014FF;
        height: 44px;
    }

    .top-right {
        gap: 8px;
    }

    .online {
        padding: 0;
        margin-left: 16px;
    }

    .drawer {
        width: 24px;
        height: 24px;
        padding: 8px;
    }

    .user-logo {
        width: 32px;
        height: 32px;
        border-radius: 16px;
    }

}
</style>
