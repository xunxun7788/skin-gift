<template>
    <div class="foot-layout font-14">
        <img class="logo-name" src="/image/logo-name.svg" alt="">
        <div class="foot-info">
            <div class="foot-info-tip">
                <span>Open cases, win skins, withdraw straight to your Steam inventory. </span>
                <span>Entertainment for adults, 18+ in permitted regions.</span>
            </div>
            <div class="foot-right-box">
                <div class="foot-right">
                    <div class="btn" v-on:click="goToPage(value.a)" v-for="value in actionArr">
                        {{ $t(value.t) }}
                    </div>
                </div>
                <div class="p18-box">
                    <img class="p18" src="/image/18+.svg" alt="">
                    <span>Provably Fair</span>
                    <span>SSL Secured</span>
                </div>
            </div>
        </div>
        <div class="link-layout">
            <img src="/image/tg.svg" alt="">
            <img src="/image/discord.svg" alt="">
            <img src="/image/x.svg" alt="">
        </div>
        <div class="base-col" style="gap: 6px;color: #6B7280FF;">
            <span style="color: #9AA1ADFF;">Trademark Notice.</span>
            <span>Counter-Strike 2, CS:GO and Steam are trademarks of Valve Corporation. Giftskin is not affiliated
                with, endorsed by, or sponsored by Valve Corporation or Steam. All in-game skins remain the property
                of Valve Corporation and are subject to Valve’s own terms.</span>
            <span style="color: #9AA1ADFF;margin-top: 10px;">Entertainment Only.</span>
            <span>Items obtained on Giftskin are virtual digital items with no real-world monetary value. Giftskin
                is a case-opening entertainment service and is not a casino or betting operator. Service
                availability depends on your location — you are responsible for complying with the laws of your
                jurisdiction. 18+ only. Please play within your limits.</span>
            <span style="margin-top: 6px;">Copyright © 2026 Giftskin. All rights reserved.</span>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive } from 'vue';
import axiosTools from '../hooks/useHttp';
import router from '../router';
const httpTools = axiosTools();

const infoData = reactive({})

const actionArr = [
    {
        't': 'footer.userAgreement',
        'a': 'agreement'
    },
    {
        't': 'footer.privacyPolicy',
        'a': 'privacy'
    },
    {
        't': 'footer.contactUs',
        'a': 'contact'
    }
]

onMounted(() => {
    apiGetConfig()
})

async function apiGetConfig(
) {
    try {
        const result = await httpTools.get("app/config");
        const code = result.data.code;
        if (code == 1) {
            Object.assign(infoData, result.data.data)
        }
    } catch (error) {

    }
}


function goToPage(name: string) {
    router.push({
        name: name
    })
}

</script>

<style scoped>
.foot-layout {
    padding: 2.1rem 2rem 2.9rem 2rem;
    box-sizing: border-box;
    display: flex;
    color: #9AA1ADFF;
    flex-direction: column;
    align-items: start;
    gap: .8rem;
    background-color: #171A21FF;
}

.logo-name {
    height: 1.66rem;
}

.foot-info {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 100%;
}

.foot-info-tip {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.foot-right-box {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.foot-right {
    display: flex;
    flex-wrap: wrap;
    gap: .8rem;
}

.p18-box {
    display: flex;
    gap: 15px;
    justify-content: end;
    align-items: center;
    color: #6B7280FF;
}

.p18 {
    width: 1.25rem;
    height: 1.25rem;
}

.link-layout {
    display: flex;
    align-items: center;
    gap: .6rem;
}

@media screen and (max-width:995px) {

    .foot-layout {
        padding: 24px 16px;
        padding-bottom: 80px;
    }

    .logo-name {
        height: 40px;
    }

    .foot-info {
        display: flex;
        flex-direction: column;
    }

    .foot-info-tip {
        gap: 0;
    }

    .foot-right-box {
        margin-top: 15px;
    }

    .p18-box {
        margin-top: 10px;
    }
}
</style>