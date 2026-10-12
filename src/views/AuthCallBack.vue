<template>
    <div class="auth-layout">
        <span class="font-18 bold">{{ $t('mine.logging_in') }}</span>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import useMine from '../hooks/useMine'
import router from '../router'
import { useUserStore } from '../store/user'
const userStore = useUserStore()
const { apiThirdLogin } = useMine()

onMounted(() => {
    const result = parseSteamCallback()
    localStorage.setItem('steamId', result)
    loginTo(result)
})

async function loginTo(steamId: any) {
    const r = await apiThirdLogin(steamId)
    if (r) {
        if (r.data.data.userInfo) {
            userStore.cacheUserInfo(r.data.data.userInfo)
            router.push({
                name: 'home'
            })
        }
    }
}

function extractSteamId64(claimedId: string | null | undefined): string | null {
    if (!claimedId) return null
    const re = /^https?:\/\/steamcommunity\.com\/openid\/id\/(\d{17})$/i
    const m = claimedId.trim().match(re)
    return m?.[1] ?? null
}


function parseSteamCallback(search?: string): any {
    const q = new URLSearchParams(search ?? window.location.search)
    const claimedId = q.get('openid.claimed_id')
    const identity = q.get('openid.identity')
    const steamId =
        extractSteamId64(claimedId) ?? extractSteamId64(identity)
    return steamId
}

</script>

<style scoped>
.auth-layout {
    width: 100vw;
    height: 100vh;
    background-color: #171A21FF;
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>