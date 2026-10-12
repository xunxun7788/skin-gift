<template>

    <div class="share-layout">
        <div class="share-top">
            <div class="base-row gap-12">
                <div class="share-top-one">
                    <div class="base-row gap-16 font-16">
                        <div class="logo">
                            <img class="logo" :src="getImageUrl(userStore.userInfo.avatar)" alt="">
                            <div v-on:click="selectImage" class="camera btn">
                                <img class="size-1rem" src="/image/camera.svg" alt="">
                            </div>
                            <input type="file" ref="fileInput" style="display: none" @change="handleFileChange"
                                accept="image/*" />
                        </div>
                        <div class="base-col gap-8 flex-content-center flex-align-start">
                            <span>{{ userStore.userInfo.nickname }}</span>
                            <span class="font-6B7280 bold">ID:{{ userStore.userInfo.id }}</span>
                        </div>
                    </div>
                    <div class="base-row gap-16">
                        <div class="ssteam">
                            <img src="/image/ssteam.svg" alt="">
                        </div>
                        <div v-on:click="logout" class="logout-btn gap-8 btn">
                            <img src="/image/logout.svg" alt="">
                            <span class="font-14 font-6B7280">{{ $t('user.logout') }}</span>
                        </div>
                    </div>
                </div>
                <div class="share-top-two">
                    <div class="base-row flex-align-center gap-16">
                        <div class="coin-box">
                            <UsdIcon class="coin-box-icon" color="#EDEFF3" v-if="isUsdUnit()"></UsdIcon>
                            <RsdIcon class="coin-box-icon" color="#EDEFF3" v-else></RsdIcon>
                        </div>
                        <div class="base-col din bold">
                            <span class="font-FFBF00">{{ priceUnit() }}{{ formatCoin(userStore.userInfo.amount)
                            }}</span>
                            <span class="font-6B7280">{{ $t('user.myBalance') }}</span>
                        </div>
                    </div>
                    <div v-on:click="goToRecharge" class="recharge-btn btn gap-10 font-16 btn">
                        <img src="/image/battle_add.svg" alt="">
                        <span class="bold">{{ $t('recharge.recharge') }}</span>
                    </div>
                </div>
            </div>
            <div class="share-top-three">
                <div class="base-row flex-align-center gap-12">
                    <span class="font-18 bold font-EDEFF3">
                        {{ $t('userInfo.steamTradeUrl') }}
                    </span>

                    <HelpIcon v-on:click="getSteamUrl" class="size-1rem btn" />
                </div>
                <div class="steam-input">
                    <input v-model:="userStore.userInfo.transaction_url" class="input-nick input-steam" type="text"
                        v-on:focus="showSteamSave = true" v-on:blur="showSteamSave = false"
                        :placeholder="$t('userInfo.pleaseInputSteamTradeUrl')">
                    <div v-if="showSteamSave" @mousedown.prevent="submitSteamUrl" class="save-btn btn font-16">
                        <img src="/image/save-dui.svg" alt="">
                        <span>
                            {{ $t('share.save') }}
                        </span>
                    </div>
                </div>
                <span class="margin-top-8 font-12 font-6B7280">{{ $t('userInfo.tradeUrlCannotChange') }}</span>
            </div>
        </div>
        <div class="right-content">
            <SuperRoundTab :tab-arr="tabArr" v-on:change="changeTab" />
            <div v-if="currentTabIndex == 0" class="base-col">
                <div class="code-layout font-16 font-9AA1AD">
                    <div class="base-col">
                        <div class="base-row">
                            <span class="left-title">{{ $t('share.myInviteCode') }}</span>
                            <div class="input-mycode-box">
                                <input class="input-nick input-code" v-model:="shareInfoData.invite_code"
                                    oninput="value=value.replace(/[^a-zA-Z0-9]/g,'').toUpperCase()"
                                    v-on:focus="showMyCodeSave = true" v-on:blur="showMyCodeSave = false" maxlength="8"
                                    type="text" :placeholder="$t('share.pleaseInputInviteCode')">
                                <div v-on:click="copyMyCode()" class="input-mycode-copy btn">
                                    <img src="/image/copy.svg" alt="">
                                </div>
                            </div>
                            <div v-if="showMyCodeSave" @mousedown.prevent="submitShareCode"
                                class="save-btn btn font-16">
                                <img src="/image/save-dui.svg" alt="">
                                <span>
                                    {{ $t('share.save') }}
                                </span>
                            </div>
                        </div>
                        <span style="margin-left: 4rem;margin-top: .3rem;" class="font-12">
                            {{ $t('share.inviteCodeOnlyOnce') }}
                        </span>
                    </div>
                    <div class="base-row width-full margin-top-16">
                        <span class="left-title">{{ $t('userInfo.bindInviteCode') }}</span>
                        <div class="input-mycode-box flex-1">
                            <input class="input-nick input-bind-code"
                                oninput="value=value.replace(/[^a-zA-Z0-9]/g,'').toUpperCase()" maxlength="8"
                                v-model:="userStore.userInfo.invite_code2" type="text" v-on:focus="showBindSave = true"
                                v-on:blur="showBindSave = false"
                                :placeholder="$t('userInfo.pleaseInputBindInviteCode')">
                            <div v-if="showBindSave" @mousedown.prevent="submitBindCode" class="save-btn btn font-16">
                                <img src="/image/save-dui.svg" alt="">
                                <span>
                                    {{ $t('share.save') }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="base-row width-full margin-top-16 flex-align-center">
                        <span class="left-title">{{ $t('share.promotionLink') }}</span>
                        <div class="input-mycode-box input-invite-link flex-1">
                            <span>{{ shareInfoData.invite_link }}</span>
                            <div v-on:click="copyLink" class="input-mycode-copy btn">
                                <img src="/image/copy.svg" alt="">
                            </div>
                        </div>
                        <div class="base-row gap-12">
                            <div v-for="value in mediaArr" class="media-btn btn">
                                <img :src="value" alt="">
                            </div>
                        </div>

                    </div>
                </div>
                <div class="value-layout">
                    <div class="item-1">
                        <div class="value-item-icon">
                            <img src="/image/s_2.svg">
                        </div>
                        <div class="value-item">
                            <span class="din bold font-15">{{
                                shareInfoData.invite_people_num }}</span>
                            <span class="font-14 font-6B7280">{{ $t('share.inviteTotalPeople') }}</span>
                        </div>
                    </div>
                    <div class="item-1">
                        <div class="value-item-icon">
                            <img src="/image/s_3.svg">
                        </div>
                        <div class="value-item">
                            <span class="din bold font-15">{{
                                shareInfoData.total_recharge }}</span>
                            <span class="font-14 font-6B7280">{{ $t('share.TotalRecharge') }}</span>
                        </div>
                    </div>
                    <div class="item-1">
                        <div class="value-item-icon">
                            <img src="/image/total_value.svg">
                        </div>
                        <div class="value-item">
                            <span class="din bold font-15">{{
                                shareInfoData.invite_reward }}</span>
                            <span class="font-14 font-6B7280">{{ $t('share.totalIncome') }}</span>
                        </div>
                    </div>
                    <div class="item-1">
                        <div class="value-item-icon">
                            <img src="/image/ss.svg">
                        </div>
                        <div class="value-item">
                            <span class="din bold font-15">LV{{
                                shareInfoData.level }}</span>
                            <span class="font-14 font-6B7280">{{ $t('share.inviteLevel') }}</span>
                        </div>
                    </div>
                </div>
                <div class="content">
                    <div class="item margin-top-1rem font-16 bold">
                        <div class="item-title">{{ $t('share.inviteLevelTitle') }}</div>
                        <div class="item-title">{{ $t('share.invitedUserBuyCoins') }}</div>
                        <div class="item-title">{{ $t('share.rebateRatio') }}</div>
                    </div>
                    <div v-for="item in shareInfoData.list" class="level-item font-14 font-9AA1AD">
                        <div class="item-title">
                            LV{{ item.level }}
                        </div>
                        <div style="gap:0.2rem" class="item-title">
                            $
                            {{ formatCoin(item.accumulate_num) }}
                        </div>
                        <div class="item-title">
                            {{ item.give_ratio }}%
                        </div>
                    </div>
                    <div class="base-col font-14 font-9AA1AD gap-8 margin-top-16">
                        <span>{{ $t('shareHelp.rule1') }}</span>
                        <span>{{ $t('shareHelp.rule2') }}</span>
                        <span>{{ $t('shareHelp.rule3') }}</span>
                    </div>
                </div>
            </div>
            <div v-show="currentTabIndex == 1" class="content">
                <div class="item margin-top-16 font-16 bold">
                    <div class="item-title">{{ $t('share.invitedPerson') }}</div>
                    <div class="item-title">{{ $t('share.totalRechargeAmount') }}</div>
                    <div class="item-title">{{ $t('share.totalIncomeTitle') }}</div>
                </div>
                <div style="width: 100%;flex-grow: 1;">
                    <div v-for="(item, index) in shareLogData" :key="index" style="background-color: transparent;"
                        class="item-1">
                        <div class="item-title">
                            <img class="avatar" :src="getImageUrl(item.avatar)" />
                            <span class="name">{{
                                item.nickname }}</span>
                        </div>
                        <div class="item-title">{{ priceUnit() }}{{ formatCoin(item.recharge_amount) }}</div>
                        <div class="item-title">{{ priceUnit() }}{{ formatCoin(item.reward_amount) }}</div>
                    </div>
                </div>
                <br>
                <LoadMoreButton ref="loadMoreRef" v-on:load-data="loadMore" />
            </div>
        </div>
        <StateLayout :load-state="shareLoadState" :empty-text="shareEmptyText" />
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import SuperRoundTab from '../components/common/SuperRoundTab.vue';
import HelpIcon from '../components/icons/main/HelpIcon.vue';
import RsdIcon from '../components/icons/main/RsdIcon.vue';
import UsdIcon from '../components/icons/main/UsdIcon.vue';
import useMine from '../hooks/useMine';
import router from '../router/index.ts';
import { useUserStore } from '../store/user.ts';
import { copyText, formatCoin, getImageUrl, isUsdUnit, priceUnit, showToast } from '../utils';
import { showSuperOpDialog } from '../utils/dialogs.ts';

const userStore = useUserStore()

const mediaArr = [
    '/image/discord.svg',
    '/image/tg.svg',
    '/image/x.svg'
]

const { apiMineShareLog, shareLoadState, userInfo, apiUserInfo, apiUpLoadFile, shareEmptyText, apiUpUserInfo, shareInfoData, apiMineShareInfo, shareLogData, shareLogTotal } = useMine()

let page = 1

let invite_code = ""

const currentTabIndex = ref(0)

const loadMoreRef = ref(null)

const showMyCodeSave = ref(false)

const showSteamSave = ref(false)

const showBindSave = ref(false)

const tabArr = [
    {
        't': 'share.levelDesc',
        'i': 0
    },
    {
        't': 'share.inviteRecord',
        'i': 1
    },
]

const fileInput = ref<any>();

const selectedFile = ref(null);

watch(userInfo, () => {
    Object.assign(userStore.userInfo, userInfo)
})

const selectImage = () => {
    fileInput.value.click();
};

const handleFileChange = async (event: any) => {
    selectedFile.value = event.target.files[0];
    if (selectedFile.value) {
        const result = await apiUpLoadFile(selectedFile.value)
        if (result?.data.data.url) {
            const r = await apiUpUserInfo("avatar", result?.data.data.url, 'mine.uploadSuccess')
            if (r) {
                apiUserInfo()
            }
        }
    }
};

onMounted(() => {
    getInfoData()
    getData()
})

function changeTab(index: number) {
    currentTabIndex.value = index
}

function goToRecharge() {
    router.push({
        name: 'recharge'
    })
}

function copyMyCode() {
    copyText(shareInfoData.invite_code)
}

function copyLink() {
    const url = shareInfoData.invite_link
    copyText(url)
}

function logout() {
    showSuperOpDialog({
        text: 'mine.confirmLogout',
        onConfirm: () => {
            userStore.logout()
            router.replace({
                name: 'home'
            })
        }
    })
}

async function getInfoData() {
    const result = await apiMineShareInfo()
    if (result) {
        invite_code = result.data.data.invite_code
    }
}

function isCanLoadMore() {
    if (currentTabIndex.value == 1) {
        return shareLogData.length != shareLogTotal.value
    } else {
        return false
    }
}

async function loadMore() {
    page++
    getData()
}

async function getData() {
    apiUserInfo()
    await apiMineShareLog(page)
    if (isCanLoadMore()) {
        loadMoreRef.value.chageStatus(1)
    } else {
        loadMoreRef.value.chageStatus(3)
    }
}

async function submitShareCode() {
    if (shareInfoData.invite_code.length <= 0) {
        showToast({
            'msg': 'share.pleaseInputInviteCode'
        })
        return
    }
    const result = await apiUpUserInfo('invite_code', shareInfoData.invite_code)
    if (!result) {
        shareInfoData.invite_code = invite_code
    } else {
        invite_code = shareInfoData.invite_code
    }
}


async function submitBindCode() {
    if (!userStore.userInfo.invite_code2 || userStore.userInfo.invite_code2.length <= 0) {
        showToast({
            'msg': 'userInfo.pleaseInputBindInviteCode'
        })
        return
    }
    apiUpUserInfo('invite_code2', userStore.userInfo.invite_code2)
}

function getSteamUrl() {
    window.open("https://steamcommunity.com/login/home/?goto=%2Fid%2Fme%2Ftradeoffers%2Fprivacy#trade_offer_access_url", '_blank')
}

function submitSteamUrl() {

    if (!userStore.userInfo.transaction_url || userStore.userInfo.transaction_url.length <= 0) {
        showToast({
            'msg': 'userInfo.pleaseInputSteamTradeUrl'
        })
        return
    }
    apiUpUserInfo('steam_url', userStore.userInfo.transaction_url)
}

</script>

<style scoped>
.share-layout {
    height: 100%;
    width: 100%;
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    padding: .5rem 0;
    align-items: center;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
}

.share-top {
    display: flex;
    padding: 0 1rem;
    box-sizing: border-box;
    width: 100%;
    gap: .5rem;
}

.share-top-one {
    display: flex;
    flex: 288;
    padding: 1rem;
    align-items: center;
    justify-content: center;
    gap: .66rem;
    flex-direction: column;
    background-color: #171A21FF;
    box-shadow: inset 0 0 0 1px #333A47FF;
    border-radius: .66rem;
}

.ssteam {
    width: 1.25rem;
    height: 1.25rem;
    padding: .2rem;
    box-sizing: border-box;
    border-radius: 1rem;
    box-shadow: inset 0 0 0 1px #333A47FF;
}

.ssteam img {
    width: 100%;
    height: 100%;
}

.logout-btn {
    height: 1.25rem;
    display: flex;
    border-radius: 1rem;
    align-items: center;
    padding: 0 .66rem;
    box-shadow: inset 0 0 0 1px #333A47FF;
}

.logout-btn img {
    width: .83rem;
    height: .83rem;
}

.logo {
    position: relative;
    width: 3rem;
    height: 3rem;
    border-radius: 2rem;
}

.camera {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    display: flex;
    align-items: center;
    border-radius: 2rem;
    justify-content: center;
    height: 100%;
}

.share-top-two {
    display: flex;
    flex: 288;
    padding: 1rem;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    flex-direction: column;
    background-color: #171A21FF;
    box-shadow: inset 0 0 0 1px #333A47FF;
    border-radius: .66rem;
}

.share-top-three {
    display: flex;
    flex: 776;
    padding: 1rem;
    align-items: start;
    justify-content: center;
    flex-direction: column;
    background-color: #171A21FF;
    box-shadow: inset 0 0 0 1px #333A47FF;
    border-radius: .66rem;
}

.coin-box {
    width: 3rem;
    height: 3rem;
    border-radius: 2rem;
    background-color: #262B35FF;
    display: flex;
    align-items: center;
    justify-content: center;
}

.coin-box-icon {
    width: 100%;
    height: 100%;
    padding: 10%;
}

.coin-box img {
    width: 1.8rem;
    height: 1.8rem;
}

.recharge-btn {
    height: 1.6rem;
    border-radius: 1rem;
    background-color: #FFBF00FF;
    width: 83%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1A1206FF;
}

.recharge-btn img {
    width: 1rem;
    height: 1rem;
}

.steam-input {
    width: 100%;
    margin-top: 1rem;
    display: flex;
    align-items: center;
}

.input-steam {
    margin-top: 0 !important;
}

.right-content {
    flex: 1;
    height: 0;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    height: 0;
    margin: 0 1rem;
    padding: 1rem;
    box-sizing: border-box;
    overflow-y: auto;
    width: calc(100% - 2rem);
    background-color: #171A21FF;
    border-radius: .66rem;
    margin-top: .5rem;
    box-shadow: inset 0 0 0 1px #333A47FF;
}

.code-layout {
    display: flex;
    margin-top: 1rem;
    flex-direction: column;
    align-items: start;
}

.left-title {
    height: 1.42rem;
    width: 4rem;
    display: flex;
    align-items: center;
}

.left-content {
    height: 1.42rem;
    display: flex;
    align-items: center;
}

.value-item {
    color: #999;
    display: flex;
    gap: .2rem;
    justify-content: center;
    flex-direction: column;
}

.value-item-icon {
    width: 2.08rem;
    height: 2.08rem;
    background-color: #262B35FF;
    border-radius: .25rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.value-item-icon img {
    width: 1.3rem;
    height: 1.3rem;
}

.left-content-realname {
    border: 1px solid #4F4F4F;
    border-radius: 2px;
    height: 1.42rem;
    display: flex;
    color: var(--color-d6);
    padding-left: 0.3rem;
    align-items: center;
    width: 100%;
}

.base-btn {
    display: flex;
    align-items: center;
    color: white;
    justify-content: center;
    width: 3.25rem;
    border-radius: 2px;
    margin-left: 0.3rem;
    height: 1.42rem;
    cursor: pointer;
    user-select: none;
    border: 1px solid var(--theme-color);
}

.save-btn {
    height: 1.5rem;
    background-color: #FFBF00FF;
    border-radius: 1rem;
    margin-left: .33rem;
    gap: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    padding-left: .33rem;
    padding-right: .66rem;
    color: #1A1206FF;
}

.save-btn img {
    width: 1.08rem;
    height: 1.08rem;
}

.input-mycode-box {
    position: relative;
    display: flex;
    align-items: center;
}

.media-btn {
    width: 1.75rem;
    height: 1.75rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 1rem;
    box-shadow: inset 0 0 0 1px #262B35FF;
}

.input-invite-link {
    box-shadow: inset 0 0 0 1px #FFFFFF26;
    height: 1.5rem;
    border-radius: 1rem;
    margin-right: 1rem;
    padding: 0 .7rem;
}

.input-mycode-copy {
    position: absolute;
    right: 0;
    width: .83rem;
    padding: 0 .5rem;
    height: .83rem;
}

.input-nick {
    flex-grow: 1;
    height: 1.5rem;
    width: 100%;
    box-sizing: border-box;
    padding: 0 .7rem;
    margin-top: 1rem;
    font-weight: bold;
    font-size: var(--font-size-16);
    border: 1px solid #FFFFFF26;
    border-radius: 1rem;
    background-color: transparent;
    color: white;
}

.input-nick::placeholder {
    color: #6B7280FF;
    font-weight: normal;
}

.input-code {
    flex-grow: 0;
    margin-top: 0;
    width: 8rem;
}

.input-bind-code {
    flex-grow: 0;
    margin-top: 0;
}

.input-nick:focus {
    border: 1px solid var(--theme-color);
}

.content {
    flex-grow: 1;
    display: flex;
    color: var(--color-d6);
    flex-direction: column;
    width: 100%;
}


.value-layout {
    display: grid;
    gap: .4rem;
    margin-top: 1rem;
    grid-template-columns: 1fr 1fr 1fr 1fr;
}

@media screen and (max-width:1300px) {
    .value-layout {
        gap: 0.3rem;
        grid-template-columns: 1fr 1fr;
    }


    .base-btn {
        height: 2rem;
        font-size: 0.9rem;
    }

    .left-content {
        height: 2rem;
        font-size: 0.9rem;
    }



}


.item-1 {
    background-color: #1F232CFF;
    border-radius: .33rem;
    display: flex;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
}

.level-item {
    height: 2rem;
    display: flex;
    padding: 0 1rem;
    border-bottom: 1px solid #333A47FF;
}

.item {
    height: 1.8rem;
    padding: 0 1rem;
    display: flex;
    background-color: #1F232CFF;
    border-radius: .33rem;
    color: #6B7280FF;
}

.item-title {
    flex-grow: 1;
    display: flex;
    width: 0;
    gap: 0.41rem;
    align-items: center;
}

.avatar {
    width: 1.67rem;
    height: 1.67rem;
    border-radius: 1rem;
}

.name {
    flex-grow: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}


@media screen and (max-width:995px) {


    .recharge-btn {
        height: 40px;
        border-radius: 20px;
        padding-left: 8px;
        padding-right: 16px;
        width: fit-content;
    }

    .coin-box {
        width: 40px;
        height: 40px;
    }

    .coin-box img {
        width: 24px;
        height: 24px;
    }

    .share-top-two {
        padding: 12px;
        gap: 10px;
        padding: 12px;
        font-size: 14px !important;
    }

    .share-top-one {
        padding: 12px;
        gap: 10px;
        font-size: 14px !important;
    }

    .share-top-three {
        padding: 12px;
        gap: 10px;
        font-size: 14px !important;
    }

    .right-content {
        margin-bottom: 55px;
    }

    .steam-input {
        margin-top: 12px;
    }

    .ssteam {
        width: 30px;
        height: 30px;
    }

    .recharge-btn img {
        width: 24px;
        height: 24px;
    }

    .share-top {
        flex-direction: column;
    }

    .value-item-icon {
        width: 2.4rem;
        height: 2.4rem;
    }

    .value-item {
        font-size: 0.9rem;
    }

    .item {
        height: 2.6rem;
    }

    .level-item {
        height: 2.6rem;
        font-size: 0.725rem;
    }

    .avatar {
        width: 2.4rem;
        height: 2.4rem;
        border-radius: 2rem;
    }

    .name {
        font-size: 1rem;
    }

    .help-icon {
        width: 1rem;
        height: 1rem;
    }

    .help {
        font-size: 0.9rem;
    }


}
</style>