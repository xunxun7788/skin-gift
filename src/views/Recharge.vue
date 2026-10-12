<template>
    <div class="recharge-layout">
        <SuperTab class="super-tab" :tab-arr="tabArr" v-on:change="onChange"></SuperTab>
        <div v-if="tabIndex == 0" class="flex-1 base-row gap-1rem recharge-body">
            <div class="recharge-left">
                <div class="width-fit">
                    <SuperRoundTab class="card-tab" v-if="cardTabArr.length > 0" :tab-arr="cardTabArr"
                        v-on:change="changeTab"></SuperRoundTab>
                </div>
                <div v-for="(value, key, index) in payInfo">
                    <div v-if="typeTabIndex == 0 || ((typeTabIndex - 1) == index)"
                        class="recharge-card margin-top-1rem">
                        <div class="base-row gap-8 font-18 font-EDEFF3 bold card-title">
                            <img class="size-1rem" src="/image/card.svg" alt="">
                            <span>{{ $t(getNameBy(key)) }}</span>
                        </div>
                        <div v-if="key == 'fiat' || key == 'crypto'" class="deposit-box">
                            <DepositCell :class="{ 'box-cell-active': selectData.id == item.id }"
                                v-on:item-click="onItemClick($event, key)" v-for="item in value" :data="item">
                                <div class="deposit-box-tips">
                                    <span class="bold font-13 font-EDEFF3">{{ item.name }}</span>
                                </div>
                            </DepositCell>
                        </div>
                        <div v-else class="base-col width-full gap-12">
                            <GiftCardCell v-for="cell in value" :data="cell">

                            </GiftCardCell>
                        </div>
                    </div>
                </div>
            </div>
            <div class="recharge-right">
                <div class="recharge-code">
                    <div class="base-row gap-8 font-16">
                        <img class="size-1rem" src="/image/pcode.svg" alt="">
                        <span>{{ $t('recharge.Promocode') }}</span>
                    </div>
                    <div class="base-row gap-8 margin-top-1rem">
                        <input class="input-pcode font-15" v-model="inputCode" type="text"
                            :placeholder="$t('recharge.EnterPromocode')">
                        <div v-on:click="applyCode" class="pcode-save btn gap-4"
                            :class="{ 'pcode-sava-acvive': inputCode.length > 0 }">
                            <img class="size-1rem" src="/image/tick.svg" alt="">
                            <span class="font-1A1206 font-16 bold">{{ $t('recharge.Apply') }}</span>
                        </div>
                    </div>
                    <span v-if="pcodeTips" class="margin-top-8 font-14 font-3FB950">
                        {{ $t(pcodeTips, { amount: getpcodeAmout() }) }}
                    </span>
                </div>
                <div v-if="isGiftCard" class="giftcard-box">
                    <span class="font-16 font-6B7280">{{ $t('recharge.GiftCardCode') }}</span>
                    <div class="giftcard-input-box">
                        <img class="size-1rem" src="/image/gift.svg" alt="">
                        <input class="giftcard-input font-16" :placeholder="$t('recharge.GiftCardCode')" type="text">
                    </div>
                    <div class="submit-btn btn font-1A1206 bold">
                        {{ $t('recharge.ApplyCode') }}
                    </div>
                </div>
                <div class="base-col gap-1rem" v-if="Object.keys(selectData).length > 0">
                    <div class="recharge-method font-16">
                        <span class="font-6B7280">{{ $t('recharge.Selectedmethod') }}</span>
                        <div class="base-row flex-align-center gap-16 margin-top-16">
                            <div class="method-select-box">
                                <img :src="getImageUrl(selectData.icon)" alt="">
                            </div>
                            <span class="bold">{{ selectData.name }}</span>
                        </div>
                        <span class="font-6B7280 margin-top-1rem">
                            {{ $t("recharge.Entertheamount") }}
                        </span>
                        <div class="base-row margin-top-16 gap-8 flex-align-center">
                            <div class="method-select-box-input">
                                <CardIcon class="size-1rem" />
                                <input class="input-btc font-16 bold" v-model="currentAmount" type="text">
                            </div>
                            <img class="size-1rem" src="/image/rr.svg" alt="">
                            <div class="method-select-box-input">
                                <UsdIcon v-if="userStore.unitValue == 'usd'" color="#9AA1AD" class="size-1rem" />
                                <RsdIcon v-else class="size-1rem" color="#9AA1AD"></RsdIcon>
                                <input class="input-btc font-16 bold" v-model="currentAmountChange" type="text">
                            </div>
                        </div>
                    </div>
                    <span class="font-14 font-EDEFF3">
                        {{ $t('recharge.Minimumamount') + ' ' + minAmount }}
                    </span>
                    <div v-if="!payUrl" v-on:click="goToPay" class="submit-btn btn font-1A1206 bold">
                        {{ $t('recharge.GenerateWallet') }}
                    </div>
                    <div v-else class="pay-result-box gap-8">
                        <div v-on:click="copyPayUrl" class="pay-result-url">
                            <span class="flex-1 text-single-line"> {{ payUrl }}</span>
                            <CopyIcon class="size-1rem btn"></CopyIcon>
                        </div>
                        <div v-on:click="showQrCodeDialog(payUrl)" class="pay-result-qr">
                            <img src="/image/qr.svg" class="size-1rem btn" alt="">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <PendingDeposits v-else-if="tabIndex == 1" />
        <PendingDeposits v-else-if="tabIndex == 2" />
        <MineBalance v-else-if="tabIndex == 3" />
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from 'vue';
import SuperRoundTab from '../components/common/SuperRoundTab.vue';
import SuperTab from '../components/common/SuperTab.vue';
import CardIcon from '../components/icons/mine/CardIcon.vue';
import CopyIcon from '../components/icons/mine/CopyIcon.vue';
import DepositCell from '../components/recharge/DepositCell.vue';
import GiftCardCell from '../components/recharge/GiftCardCell.vue';
import PendingDeposits from '../components/recharge/PendingDeposits.vue';
import useMine from '../hooks/useMine.ts';

import RsdIcon from '../components/icons/main/RsdIcon.vue';
import UsdIcon from '../components/icons/main/UsdIcon.vue';
import { useUserStore } from '../store/user.ts';
import { showQrCodeDialog } from '../utils/dialogs.ts';
import { copyText, formatCoin, getImageUrl, priceUnit, toFixedTruncate } from '../utils/index.ts';
import MineBalance from './MineBalance.vue';
const userStore = useUserStore()
const { apiPayInfo, apiPayCodeVerfy, apiPayOrder } = useMine()

const tabIndex = ref(0)

const tabArr = reactive([
    {
        't': 'recharge.recharge',
        'i': 0
    },
    // {
    //     't': 'recharge.PendingDeposits',
    //     'i': 1
    // },
    // {
    //     't': 'recharge.DepositHistory',
    //     'i': 2
    // },
    {
        't': 'recharge.BalanceDetails',
        'i': 3
    }
])

const payInfo = reactive<any>({})

const selectData = reactive<any>({})

const currentAmount = ref(0)

const currentAmountChange = ref(0)

const inputCode = ref('')

const payUrl = ref('')

const pcodeData = reactive<any>({})

const typeTabIndex = ref(0)

const minAmount = computed(() => {
    if (selectData.key == 'crypto') {
        const a = selectData.network[0]
        const usd = a.min_amount_usd
        const c = a.min_amount_crypto
        return `${priceUnit()}${formatCoin(usd)}(${c} ${selectData.name})`
    } else if (selectData.key == 'fiat') {
        const usd = selectData.amount_min
        const c = selectData.currency_symbol
        return `${formatCoin(usd)}(${c})`
    }
    return ''
})

const isGiftCard = computed(() => {
    return cardTabArr[typeTabIndex.value]?.key == 'giftcard'
})

const cardTabArr = reactive<any[]>([])

function getNameBy(name: any) {
    switch (name) {
        case "fiat":
            return 'recharge.Cards';
        case "crypto":
            return 'recharge.Crypto'
        case "giftcard":
            return 'recharge.GiftCard'
    }
    return ''
}

onMounted(() => {
    getData()
})

function onChange(index: number) {
    tabIndex.value = index
}

function copyPayUrl() {
    copyText(payUrl.value)
}

function changeTab(index: number) {
    typeTabIndex.value = index
}

async function goToPay() {
    currentAmountChange.value = toFixedTruncate(currentAmountChange.value)
    if (Object.keys(selectData).length > 0) {
        const r = await apiPayOrder(selectData.id, currentAmountChange.value.toString(), currentAmount.value.toString(), inputCode.value)
        if (r?.data.data) {
            payUrl.value = r.data.data.pay_url
        }
    }
}

let isStopA = false
let isStopB = false

watch(currentAmountChange, () => {
    if (isStopB) {
        isStopB = false
        return
    }
    isStopA = true
    currentAmount.value = currentAmountChange.value / selectData.rate
})

watch(currentAmount, () => {
    if (isStopA) {
        isStopA = false
        return
    }
    isStopB = true
    const key = selectData.key
    if (key == 'fiat') {
        currentAmountChange.value = toFixedTruncate(currentAmount.value * selectData.rate)
    } else if (key == 'crypto') {
        const a = selectData.network
        if (a[0]) {
            currentAmountChange.value = toFixedTruncate(currentAmount.value * selectData.rate)
        }
    }
})

function onItemClick(data: any, key: any) {
    payUrl.value = ''
    data['key'] = key
    Object.assign(selectData, data)
    if (key == 'fiat') {
        currentAmount.value = selectData.amount_min
    } else if (key == 'crypto') {
        const a = selectData.network
        if (a[0]) {
            currentAmount.value = a[0].min_amount_crypto
        }
    }
}

async function applyCode() {
    const r = await apiPayCodeVerfy(inputCode.value)
    if (r?.data.data) {
        Object.assign(pcodeData, r.data.data)
    }
}

const pcodeTips = computed(() => {
    if (Object.keys(pcodeData).length > 0) {
        const type = pcodeData.type
        if (type == 1) {
            return 'recharge.promo_bonus_percent'
        } else if (type == 2) {
            return 'recharge.promo_bonus_amount'
        }
    }
    return ''
})

function getpcodeAmout() {
    const type = pcodeData.type
    if (type == 1) {
        return pcodeData.value * 100
    } else {
        return pcodeData.value
    }
}

async function getData() {
    const r = await apiPayInfo()
    if (r?.data.data) {
        cardTabArr.length = 0
        let count = 0
        for (const key in r.data.data) {
            let text = ""
            switch (key) {
                case 'giftcard':
                    text = "recharge.GiftCard"
                    break;
                case "crypto":
                    text = "recharge.Crypto"
                    break;
                case "fiat":
                    text = "recharge.Cards"
                    break;
            }
            if (count == 0) {
                cardTabArr.push({
                    't': 'common.all',
                    'i': count
                })
            }
            cardTabArr.push({
                't': text,
                'key': key,
                'i': ++count
            })
        }
        Object.assign(payInfo, r.data.data)
    }
}

</script>

<style scoped>
.recharge-layout {
    height: 100%;
    width: 100%;
    overflow: hidden;
    position: absolute;
    box-sizing: border-box;
    top: 0;
    left: 0;
    overflow-y: auto;
    align-items: center;
    display: flex;
    flex-direction: column;
}


.recharge-body {
    margin: 1rem;
    width: 100%;
    padding: 0 1rem;
    display: flex;
    box-sizing: border-box;
}

.super-tab {
    margin: 0 1rem;
    width: calc(100% - 2rem);
}

.recharge-left {
    display: flex;
    flex: 3;
    height: fit-content;
    overflow-y: auto;
    margin-bottom: 1rem;
    flex-direction: column;
    box-shadow: inset 0 0 0 1px #333A47FF;
    background-color: #171A21FF;
    border-radius: .66rem;
    padding: 1rem;
    box-sizing: border-box;
}

.card-tab {
    margin: 0;
    width: fit-content;
}

.recharge-card {
    width: 100%;
    background-color: #0E1014FF;
    padding: 0 .6rem .6rem .6rem;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    border-radius: .66rem;
}

.card-title {
    padding: .66rem 0;
    width: 100%;
}

.deposit-box {
    display: grid;
    gap: .5rem;
    row-gap: .5rem;
    grid-template-columns: 1fr 1fr 1fr;
}

.box-cell-active {
    box-shadow: inset 0 0 0 1px #FFBF00FF;
}

.deposit-box-tips {
    position: absolute;
    left: .3rem;
    top: .3rem;
    border-radius: .25rem;
    padding: 0 .25rem;
    background-color: #FFFFFF26;
    border: 1px solid #FFFFFF26;
}

.recharge-right {
    display: flex;
    gap: 1rem;
    width: 28%;
    flex-direction: column;
}

.recharge-code {
    background-color: #171A21FF;
    border-radius: .66rem;
    box-shadow: inset 0 0 0 1px #333A47FF;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
}

.input-pcode {
    flex: 1;
    height: 1.5rem;
    width: 100%;
    box-sizing: border-box;
    padding: 0 .7rem;
    border: 1px solid #333A47FF;
    border-radius: 1rem;
    background-color: transparent;
    color: white;
}


.input-pcode::placeholder {
    color: #6B7280FF;
}


.pcode-save {
    height: 1.5rem;
    border-radius: 1rem;
    display: flex;
    background-color: #FFFFFF26;
    align-items: center;
    backdrop-filter: blur(10px);
    justify-content: center;
    padding-left: .33rem;
    padding-right: .66rem;
}

.pcode-sava-acvive {
    background-color: #FFBF00FF;
}

.recharge-method {
    padding: 1rem;
    display: flex;
    flex-direction: column;
    background-color: #171A21FF;
    box-shadow: inset 0 0 0 1px #333A47FF;
    border-radius: .66rem;
}

.method-select-box {
    display: flex;
    align-items: center;
    box-shadow: inset 0 0 0 1px #333A47FF;
    border-radius: .33rem;
    height: 2rem;
    width: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 .5rem;
}

.method-select-box img {
    height: 60%;
    width: 90%;
    object-fit: contain;
}

.method-select-box-input {
    display: flex;
    align-items: center;
    border-radius: 1.5rem;
    height: 1.5rem;
    padding: 0 .33rem;
    flex: 1;
    box-sizing: border-box;
    box-shadow: inset 0 0 0 1px #333A47FF;
}

.input-btc {
    flex: 1;
    width: 0;
    margin-left: 8px;
    background-color: transparent;
}

.submit-btn {
    width: 100%;
    background-color: #FFBF00FF;
    height: 2rem;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.pay-result-box {
    display: flex;
    align-items: center;
    height: 2rem;
}

.pay-result-url {
    height: 100%;
    box-shadow: inset 0 0 0 1px #FFBF00FF;
    font-size: 16px;
    display: flex;
    width: 0;
    overflow: hidden;
    font-weight: bold;
    align-items: center;
    padding: 0 12px;
    color: #FFBF00FF;
    border-radius: 1rem;
    flex: 1;
}

.pay-result-qr {
    height: 100%;
    width: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: inset 0 0 0 1px #6B7280FF;
    border-radius: 1rem;
}

.giftcard-box {
    display: flex;
    flex-direction: column;
    background-color: #171A21FF;
    padding: 1rem;
    box-sizing: border-box;
    border-radius: .66rem;
    box-shadow: inset 0 0 0 1px #333A47FF;
}

.giftcard-input-box {
    display: flex;
    align-items: center;
    padding: 0 .4rem;
    gap: .3rem;
    box-shadow: inset 0 0 0 1px #333A47FF;
    border-radius: 1.5rem;
    height: 1.5rem;
    margin-top: .66rem;
    margin-bottom: 1.5rem;
}

.giftcard-input {
    flex: 1;
    background-color: transparent;
}

.giftcard-input::placeholder {
    color: #6B7280FF;
}

@media screen and (min-width: 1200px) {
    .deposit-box {
        grid-template-columns: 1fr 1fr 1fr;
    }
}

@media screen and (min-width: 1440px) {


    .deposit-box {
        grid-template-columns: 1fr 1fr 1fr 1fr;
    }

}

@media screen and (max-width: 995px) {
    .recharge-layout {
        padding-bottom: 44px;
    }
}
</style>