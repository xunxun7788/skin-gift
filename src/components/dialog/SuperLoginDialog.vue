<template>
    <div class="op-dialog">
        <BaseDialog ref="baseDialogRef">
        </BaseDialog>
        <transition name="layout" @after-leave="props.dismiss">
            <div v-show="isShow" class="op-dialog-body">
                <img src="/logo.svg" class="logo" alt="">
                <span class="font-16 font-9AA1AD margin-top-16 login-tips">{{ $t('login.loginTips') }}</span>
                <div v-on:click="loginWithSteam()" class="login-btn btn">
                    <img class="size-1rem" src="/image/steam.svg" alt="">
                    <span class="_windows">{{ $t('nav.loginSteam') }}</span>
                    <span class="_mobile font-14">{{ $t('nav.login') }}</span>
                </div>
                <div v-on:click="close_" class="close">
                    <img src="/image/close.svg" class="size-1rem btn" alt="">
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { config } from '../../utils/index.ts';
import BaseDialog from '../BaseDialog.vue';
const props = defineProps(['dismiss', 'type', 'text', 'price', 'onConfirm'])

const isShow = ref(false)

const baseDialogRef = ref<any>(null)

onMounted(() => {
    isShow.value = true
})

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
    width: 420px;
    padding: 2rem 0;
    box-sizing: border-box;
    justify-content: center;
    align-items: center;
    background-color: #171A21FF;
    border-radius: .66rem;
    border: 1px solid #333A47FF;
    display: flex;
    position: relative;
    flex-direction: column;
}

.logo {
    height: 4rem;
}

.login-btn {
    display: flex;
    box-sizing: border-box;
    width: calc(100% - 2rem);
    background-color: #FFBF00FF;
    border-radius: 1.5rem;
    align-items: center;
    justify-content: center;
    color: #1A1206FF;
    font-weight: bold;
    font-size: .67rem;
    gap: .5rem;
    margin-top: 1rem;
    padding: 0 1rem;
    height: 2rem;
}

.close {
    position: absolute;
    top: 0;
    right: 0;
    padding: .5rem;
}

@media screen and (max-width: 995px) {
    .op-dialog-body {
        width: 60%;
        padding: 0;
        padding-top: 30px;
        padding-bottom: 20px;
    }

    .login-btn {
        height: 44px;
        padding: 0;
        margin-top: 15px;
    }

    .logo {
        height: 80px;
    }

    .close {
        padding: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .close img {
        object-fit: fill;
    }

    .login-tips {
        padding: 0 15px;
        text-align: center;
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