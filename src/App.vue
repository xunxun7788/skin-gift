<template>
    <el-config-provider :locale="epLocale">
        <RouterView v-if="isAlive"></RouterView>
    </el-config-provider>
</template>

<script lang="ts" name="App" setup>
import en from "element-plus/es/locale/lang/en";
import ru from "element-plus/es/locale/lang/ru";
import { computed, getCurrentInstance, inject, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { RouterView, useRoute } from "vue-router";

import { useUserStore } from "./store/user";
import { showToast } from "./utils";
import emitter from "./utils/eventBus";

const { locale, t } = useI18n();

const { path } = useRoute()
const isAlive = ref(true)

const reloadRoute = () => {
    isAlive.value = false
    nextTick(() => isAlive.value = true)
}

// Element Plus 语言映射
const epLocale = computed(() => {
    switch (locale.value) {
        case "ru-RU":
            return ru;
        case "en-US":
        default:
            return en;
    }
});

const userStore = useUserStore()

let socket: any;

let isNeesShowRechargeTips = false

const emitterA = inject<any>("emitter");

//如果 >= 995 24px = 1rem
//如果 <995  32px(根据宽度变化) = 1rem

onMounted(() => {
    window.addEventListener("resize", () => {
        doHtmFontSize();
    });
    doHtmFontSize();
    initSocket()
    initEvent()
});

const handleMessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data)
    const cmd = data.cmd;
    if (cmd == 2020) {
        if (userStore.isVisible) {
            isNeesShowRechargeTips = false
            emitterA.emit('upUserData')
            showToast({ 'msg': t('recharge.rechargeSuccess'), 'type': 'success' })
        } else {
            isNeesShowRechargeTips = true
        }
    }
}

function initSocket() {
    socket = getCurrentInstance()?.appContext.config.globalProperties.$webSocket
    socket.addMessageListener(handleMessage);
    if (userStore.isLogin) {
        socket.initializeWebSocket(userStore.userInfo.id)
    }
}

function initEvent() {
    const q = new URLSearchParams(window.location.search)
    if (q.get('code')) {
        localStorage.setItem('invite_code', q.get('code')!.toString())
    }
    if (q.get('channel_code')) {
        localStorage.setItem('channel_code', q.get('channel_code')!.toString())
    }
    emitter.on('refreshRoute', reloadRoute)
    emitterA.on('logout', (_: any) => {
        userStore.logout()
    })
    document.addEventListener('visibilitychange', function () {
        if (document.visibilityState === 'visible') {
            userStore.isVisible = true
            if (isNeesShowRechargeTips) {
                isNeesShowRechargeTips = false
                emitterA.emit('upUserData')
                showToast({ 'msg': t('recharge.rechargeSuccess'), 'type': 'success' })
            }
        } else {
            userStore.isVisible = false
        }
    });

}

watch(() => userStore.isLogin, () => {
    if (userStore.isLogin) {
        socket.initializeWebSocket(userStore.userInfo.id)
    } else {
        socket.disConnect()
    }
})


function doHtmFontSize() {
    if (window.innerWidth > 995) {
        document.documentElement.style.fontSize = 24 + "px";
        //变成PC样式
    } else {
        let s = window.innerWidth / 995;
        // if (s <= 0.52) {
        //     s = 0.52
        // }
        document.documentElement.style.fontSize = s * 32 + "px";
        //变成手机样式
    }
}

onUnmounted(() => {
    emitter.off('refreshRoute', reloadRoute)
})

</script>
