<template>
    <div class="headerNav">
        <div class="left">
            <img @click="jumpToHome()" class="logo" src="/logo.svg">
        </div>
        <div class="right">
            <div class="user">
                <div @click="goToRecharge"
                    style="cursor: pointer;user-select: none;display: flex;flex-direction: column;align-items: center;gap: 0.1rem;font-size: 0.635rem;">
                    <img style="width: 1.4rem;height: 1.4rem;" src="/image/zs.svg">
                    {{ $t('nav.recharge') }}
                </div>

                <div @click="goToKF"
                    style="margin-left: 1.5rem;cursor: pointer;user-select: none;display: flex;flex-direction: column;align-items: center;gap: 0.1rem;font-size: 0.635rem;">
                    <img style="width: 1.4rem;height: 1.4rem;" src="/image/kf.svg">
                    {{ $t('nav.customerService') }}
                </div>

                <div style="margin-left: 1.5rem;">
                    <LanguageSwitcher />
                </div>

                <div v-if="!userStore.isLogin" @click="showLogin" class="login">
                    <span>{{ $t('nav.loginRegister') }}</span>
                </div>
                <div class="userinfo" v-if="userStore.isLogin">
                    <div
                        style="display: flex;align-items: center;font-weight: bold;font-size: 1rem;color: var(--color-d6);">

                        <img @click="goToMine" class="avatar" :src="$cdnUrl + userStore.userInfo.avatar" alt="">
                    </div>
                    <div
                        style="margin: 0 var(--font-size-20);width: 1px;height: 2rem;background: linear-gradient(180deg,#333,#999,#333);">
                    </div>
                    <div
                        style="font-size: var(--font-size-20);font-family: din;font-weight: bold;color: var(--theme-color);margin-left: -0.25rem;display: flex;flex-direction: column;padding-right: 1rem;">
                        <div style="display: flex;align-items: center;height: 1.4rem;font-size: 1rem;">
                            <img style="width: 1.4rem;height: 70%;" src="/image/zs.svg">
                            {{ userStore.userInfo.amount }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup name="Nav">

import { inject, onMounted, watch } from 'vue'
import { isMobile } from 'vue-device-detect'
import { useRouter } from 'vue-router'
import useMine from '../hooks/useMine'
import { useUserStore } from '../store/user'
import { showLoginDialog } from '../utils'
import LanguageSwitcher from './LanguageSwitcher.vue'

const { apiUserInfo } = useMine()

const userStore = useUserStore()
const router = useRouter()

const emitter = inject("emitter");

onMounted(() => {
    emitter.on('upUserData', () => {
        upUserInfo()
    })
    // if (userStore.isLogin) {
    //     upUserInfo()
    // }
    upUserInfo()
})

async function upUserInfo() {
    const result = await apiUserInfo()
    if (result) {
        userStore.upDateUserInfo(result.data.data.list)
    }
}

function showLogin() {
    showLoginDialog()
}

function goToMine() {
    router.push({
        name: 'userinfo'
    })
}

function goToRecharge() {
    if (!userStore.isLogin) {
        showLoginDialog()
        return
    }
    router.push({
        name: 'recharge'
    })
}

function jumpToHome() {
    router.push({
        name: 'home'
    })
}

function goToKF() {
    if (isMobile) {
        window.open(`https://www.bangwo8.com/osp2016/im/h5/index.php?vendorID=1247107&authaccount=${userStore.userInfo.id}`, '_blank')
    } else {
        window.open(`https://www.bangwo8.com/osp2016/im/pc/index.php?vendorID=1247107&authaccount=${userStore.userInfo.id}`, '_blank')
    }
}

watch(() => userStore.isUpDateBalance, () => {
    upUserInfo()
})

</script>

<style scoped>
.headerNav {
    height: var(--window-headerNav-height);
    margin-bottom: 0.17rem;
    padding: 0 0.8rem;
    display: flex;
    justify-content: space-between;
    align-items: stretch;
    position: relative;
    z-index: 10;
    box-sizing: border-box;
    background: url(/image/t_bg.png) no-repeat;
    background-size: auto 100%;
    background-color: #1A1C24;
}

.headerNav .left {
    display: flex;
    align-items: center;
}

.headerNav .left .menuIcon {
    width: 1.29rem;
    margin-right: 0.67rem;
}

.headerNav .left .logo {
    height: 1.67rem;
    margin-right: 0.5rem;
    cursor: pointer;
}

.headerNav .left .task img {
    height: 3.77rem;
    width: auto;
    cursor: pointer;
}

.headerNav .right {
    display: flex;
    justify-content: space-between;
}

.headerNav .right .user {
    display: flex;
    align-items: center;
}

.headerNav .right .user .userinfo {
    display: flex;
    flex-direction: row;
    align-items: center;
}


.headerNav .right .user .avatar {
    width: 2.262rem;
    height: 2.262rem;
    margin-left: 2.1rem;
    border-radius: 2rem;
    display: flex;
    cursor: pointer;
    user-select: none;
    border: 1px solid var(--theme-color);
}

@media screen and (max-width:995px) {
    .headerNav .right .user .avatar {
        margin-right: 0;
    }
}

.headerNav .right .user .login {
    height: 2.67rem;
    display: flex;
    background-color: var(--theme-color);
    justify-content: center;
    margin-left: 1.5rem;
    align-items: center;
    padding: 0 1rem;
    color: #1A1C24;
    cursor: pointer;
    user-select: none;
    border-radius: 0.25rem;
}


.headerNav .right .user .login span {
    font-size: 0.9rem;
    font-weight: bold;
}
</style>