<template>
    <div class="roll-detail-layout">
        <div class="back-layout">
            <div @click="back" class="back-text">
                <img class="size-1rem" src="/image/m_back.svg">
            </div>
            <div class="top-right">
                <div @click="share" class="line-btn btn">
                    <img src="/image/share.svg" alt="">
                </div>
            </div>
        </div>
        <div class="info-layout">
            <div style="display: flex;flex-direction: row;width: 100%;align-items: center;margin-bottom: 0.83rem;">
                <div class="roll-avatar">
                    <img v-show="rollDetailData.roll_image" :src="getImageUrl(rollDetailData.roll_image)"
                        class="roll-avatar" />
                </div>
                <div v-show="Object.keys(rollDetailData).length > 0" class="roll-info">
                    <span class="font-18">{{
                        rollDetailData.roll_name }}11</span>
                    <div class="type-box font-14" :class="{ 'type-box-2': rollDetailData.roll_type == 2 }">
                        <img class="type-icon"
                            :src="`/image/${rollDetailData.roll_type == 1 ? 'official' : 'streamer'}.svg`">
                        <span>{{ $t(rollDetailData.roll_type == 1 ? 'roll.Official' : 'roll.Streamer') }}</span>
                    </div>
                </div>
            </div>
            <div v-show="rollDetailData.end_status && rollDetailData.end_status != 3"
                class="roll-open-time-windows _windows">
                <RollTimeDown v-if="rollDetailData.lottery_time" :isShowTip="false"
                    :time="rollDetailData.lottery_time" />
            </div>
            <div class="value-rule-layout">
                <div class="value-layout">
                    <div class="value-layout-item">
                        <img class="value-layout-item-icon" src="/image/i_value.svg">
                        <div style="display: flex;flex-direction: column;">
                            <span class="value-layout-item-text">{{
                                rollDetailData.total_value }}</span>
                            <span class="value-layout-item-tip">{{ $t('rollDetail.totalValue') }}</span>
                        </div>
                    </div>
                    <div class="value-layout-item-2 value-layout-item-2-border">
                        <img class="value-layout-item-icon" src="/image/i_goods.svg">
                        <div style="display: flex;flex-direction: column;">
                            <span class="value-layout-item-text">{{
                                rollDetailData.goods_num }}</span>
                            <span class="value-layout-item-tip">{{ $t('rollDetail.goodsCount') }}</span>
                        </div>
                    </div>
                    <div class="value-layout-item-2">
                        <img class="value-layout-item-icon" src="/image/i_people.svg">
                        <div style="display: flex;flex-direction: column;">
                            <span class="value-layout-item-text">{{
                                rollDetailData.joined_user_count }}</span>
                            <span class="value-layout-item-tip">{{ $t('rollDetail.participantCount') }}</span>
                        </div>
                    </div>
                </div>
                <div style="width: 1px;background-color: #99999922;margin: 0 2.5rem;"></div>
                <div style="display: flex;flex-direction: column;width: 100%;">
                    <span class="rule-info-title">{{ $t('rollDetail.rules') }}</span>
                    <span class="rule-info-text">{{
                        rollDetailData.rule_txt }}</span>
                    <div class="rule-info-btn">
                        <div v-show="rollDetailData.end_status && rollDetailData.end_status != 3"
                            class="roll-open-time _mobile">
                            <div class="time-down-layout">
                                <div class="time-item">
                                    {{ timeDownArr[0] }}
                                    <span>D</span>
                                </div>
                                <div class="time-line">

                                </div>
                                <div class="time-item">
                                    {{ timeDownArr[1] }}
                                    <span>H</span>
                                </div>
                                <div class="time-line">

                                </div>
                                <div class="time-item">
                                    {{ timeDownArr[2] }}
                                    <span>M</span>
                                </div>
                                <div class="time-line">

                                </div>
                                <div class="time-item">
                                    {{ timeDownArr[3] }}
                                    <span>S</span>
                                </div>
                            </div>
                        </div>
                        <div :class="{ 'btn-status': true, 'btn-status-wait': joinStatus == 1, 'btn-status-join': joinStatus == 2, 'btn-status-joined': joinStatus == 3 }"
                            @click="submit" class="rule-info-btn-i">
                            {{ $t(getStatusText(rollDetailData.end_status)) }}</div>
                    </div>
                </div>
            </div>
        </div>
        <BaseTab class="tab-box"
            :tabs="rollDetailData.end_status == 3 ? [$t('rollDetail.prizePool'), $t('rollDetail.participants'), $t('rollDetail.winners')] : [$t('rollDetail.prizePool'), $t('rollDetail.participants')]"
            :changeTab="changeTab" />
        <div v-if="tabIndex == 0" class="boxGridFather">
            <div v-show="rollGoodsList.length > 0" class="boxGrid">
                <div v-for="(item, index) in rollGoodsList" class="gridItem" :key="index"
                    :style="{ background: getGoodsBgColor(item.color) }">
                    <LogosIcon class="logos" :color="getGoodsBottomColor(item.color)" />
                    <img class="gun" :src="getImageUrl(item.goods_image)">
                    <div class="text">
                        <div class="name">{{ item.name }}</div>
                        <div class="price">
                            {{ priceUnit() }} {{ item.show_price }}
                        </div>
                    </div>
                    <div class="bottom-box" :style="{ backgroundColor: getGoodsBottomColor(item.color) }"></div>


                </div>
            </div>
        </div>
        <div v-show="tabIndex == 1" class="boxGrid-users-layout">
            <div v-for="item in rollJoined"
                style="display: flex;flex-direction: column;align-items: center;width: 4.88rem;">
                <img class="join-avatar" :src="getImageUrl(item.avatar)" />
                <span class="join-nickname text-single-line">{{
                    item.nickname }}</span>
            </div>
        </div>
        <div v-if="tabIndex == 2" class="boxGridFather">
            <div v-show="rollLucky.length > 0" class="boxGrid">
                <div v-for="(item, index) in rollLucky" class="gridItem card" :key="index"
                    :style="{ background: getGoodsBgColor(item.color) }">
                    <LogosIcon class="logos" :color="getGoodsBottomColor(item.color)" />
                    <img class="gun" style="flex:0;height: 50%;" :src="getImageUrl(item.goods_image)">

                    <div class="drop-text">
                        <div v-if="getExteriorName(item.exterior)" class="exterior">
                            <span>{{ getExteriorName(item.exterior) }}</span>
                        </div>
                        <div class="name font-14 text-single-line">{{ item.name }}</div>
                        <div class="bottom-box" :style="{ backgroundColor: getGoodsBottomColor(item.color) }"></div>
                    </div>
                    <div class="user">
                        <img class="avatarsImg" :src="getImageUrl(item.avatar)">
                        <div class="userName">{{ item.nickname }}</div>
                    </div>
                </div>
            </div>
        </div>
        <Footer></Footer>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import BaseTab from '../components/BaseTab.vue';
import RollTimeDown from '../components/roll/RollTimeDown.vue';
import useRoll from '../hooks/useRoll';
import { useUserStore } from '../store/user.ts';
import { copyText, getExteriorName, getGoodsBgColor, getGoodsBottomColor, getImageUrl, priceUnit, showLoginDialog } from '../utils';
import { showRollPwdDialog } from '../utils/dialogs.ts';
const userStore = useUserStore()
const x = defineProps(['id'])
const router = useRouter()

const { rollDetailData, rollLucky, apiRollLucky, apiJoinToRoll, apiRollDetail, rollGoodsList, apiRollGoods, apiRollJoined, rollJoined } = useRoll()

let tabIndex = ref(0)

let joinStatus = ref(0)


const timeDownArr = reactive(['00', '00', '00', '00'])

onMounted(async () => {
    await apiRollDetail(x.id)
    apiRollGoods(x.id)
    getCountTimeDown()
})

function back() {
    router.push({
        path: '/roll'
    })
}


function share() {
    let url = window.location.href
    if (userStore.isLogin) {
        url += "?code=" + userStore.userInfo.invite_code
    }
    copyText(url)
}

let intervalId = 0

function getCountTimeDown() {
    //如果状态为2 并且倒计时为0 
    if ((rollDetailData.count_down == 0 && rollDetailData.end_status != 3) || rollDetailData.count_down > 0) {
        Object.assign(timeDownArr, formatTime(rollDetailData.count_down).split(":"))
        //开启计时器
        if (intervalId == -100) {
            return
        }
        intervalId = setInterval(async () => {
            rollDetailData.count_down--
            if (rollDetailData.count_down <= 0) {
                rollDetailData.count_down = 0
            }
            Object.assign(timeDownArr, formatTime(rollDetailData.count_down).split(":"))
            if (rollDetailData.count_down <= 0) {
                clearInterval(intervalId)
                setTimeout(async () => {
                    await apiRollDetail(x.id)
                    //如果状态没有变为已结束，重新获取倒计时
                    if (rollDetailData.end_status != 3) {
                        getCountTimeDown()
                    }
                }, 2000);
            }
        }, 1000);
    }
}

function formatTime(mill: number) {
    // 计算天数、小时数、分钟数和秒数
    const days = Math.floor(mill / (24 * 3600));
    const hours = Math.floor((mill % (24 * 3600)) / 3600);
    const minutes = Math.floor((mill % 3600) / 60);
    const remainingSeconds = mill % 60;
    // 格式化输出为 dd:hh:mm:ss，使用padStart确保两位数显示
    return `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function changeTab(index: number) {
    tabIndex.value = index;
    if (index == 1) {
        apiRollJoined(x.id)
    } else if (index == 2) {
        //获取中奖名单
        apiRollLucky(x.id)
    }
}

async function submit() {
    if (!userStore.isLogin) {
        showLoginDialog()
        return
    }
    if (joinStatus.value == 2) {
        if (rollDetailData.need_password == 1) {
            showRollPwdDialog((value: string) => {
                doSubmit(value)
            })
            return;
        }
        doSubmit()
    }
}

async function doSubmit(pwd?: string) {
    const result = await apiJoinToRoll(x.id, pwd)
    if (result != null) {
        apiRollDetail(x.id)
    }
}

watch(rollDetailData, () => {
    joinStatus.value = 0
    const status = rollDetailData.end_status;
    switch (status) {
        case 1:
            joinStatus.value = 1
            break;
        case 2:
            if (rollDetailData.join_status == 1) {
                joinStatus.value = 3
            } else {
                joinStatus.value = 2
            }
            break;
    }
})

function getStatusText(status: number) {
    let text = ''
    switch (status) {
        case 1:
            text = 'rollDetail.waiting'
            break;
        case 2:
            if (rollDetailData.join_status == 1) {
                text = 'rollDetail.joined';
            } else {
                text = 'rollDetail.joinNow'
            }
            break;
        case 3:
            text = 'rollDetail.ended';
            break;
    }
    return text
}

onUnmounted(() => {
    Object.assign(rollDetailData, {})
    clearInterval(intervalId)
    intervalId = -100
})

</script>

<style scoped>
.roll-detail-layout {
    height: 100%;
    width: 100%;
    overflow-y: auto;
    position: absolute;
    top: 0;
    left: 0;
    align-items: center;
    display: flex;
    flex-direction: column;
}

.back-layout {
    height: 2.125rem;
    display: flex;
    width: 100%;
    margin-bottom: var(--font-size-20);
    padding: 0 1rem;
    box-sizing: border-box;
    margin-top: 0.3rem;
    justify-content: space-between;
}

.back-text {
    border-radius: 1.66rem;
    height: 1.66rem;
    width: 3rem;
    cursor: pointer;
    touch-action: none;
    display: flex;
    align-items: center;
    justify-content: center;
    border: solid 1px #FFFFFF26;
    background-color: #1F232CFF;
}

.top-right {
    display: flex;
    height: 1.958rem;
    gap: var(--font-size-20);
}

.line-btn {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 2rem;
    background-color: #333A47FF;
    width: 2.1rem;
}

.info-layout {
    position: relative;
    background-color: #171A21FF;
    box-shadow: inset 0 0 0 1px #333A47FF;
    box-sizing: border-box;
    margin: 0 1rem;
    width: calc(100% - 2rem);
    padding: 1.25rem;
    white-space: nowrap;
    margin: 0 1rem;
    border-radius: .66rem;
    display: flex;
    flex-direction: column;
}

.btn-status {
    background-color: #999;
    color: #060403;
}

.btn-status-join {
    background-color: #FFBF00FF;
    color: #1A1206FF;
    cursor: pointer;
    user-select: none;
}

.btn-status-joined {
    background: #333A47FF;
    color: #9AA1ADFF;
}

.btn-status-wait {
    background: #999;
    color: var(--color-d6);
}

.roll-avatar {
    width: 3.33rem;
    height: 3.33rem;
    border-radius: 2rem;
    margin-right: 0.67rem
}

.roll-info {
    flex-grow: 1;
    font-weight: bold;
    margin-right: 11rem;
    height: 100%;
    gap: 8px;
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: center;
}



.roll-open-time-windows {
    position: absolute;
    right: 1rem;
    top: 1rem;
}

.roll-open-time {
    display: flex;
    font-family: din;
    align-items: center;
}


.time-line {
    width: 0.5rem;
    height: 0.1rem;
    margin: 0 0.2rem;
    background-color: #999;
}

.type-box {
    height: 1rem;
    border-radius: 1rem;
    display: flex;
    gap: .16rem;
    width: fit-content;
    padding-left: .33rem;
    padding-right: .5rem;
    align-items: center;
    justify-content: center;
    color: #FFBF00FF;
    background-color: #FFBF0033;
}

.type-box-2 {
    background-color: #F8514933;
    color: #F85149FF;
}


.type-icon {
    height: .6rem;
}

.boxGridFather {
    width: 100%;
    flex-shrink: 0;
    min-height: calc(100vh - var(--window-headerNav-height) - 2.71rem - 20rem);
}

.boxGrid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    margin: 1rem;
    gap: .6rem;
    row-gap: .6rem;
    align-items: start;
}

.coin-icon {
    background: url(/image/zs.svg) no-repeat;
    background-size: cover;
    width: 0.8rem;
    margin-right: 0.1rem;
    height: 0.8rem;
}

.join-avatar {
    width: 3.73rem;
    height: 3.73rem;
    object-fit: cover;
    margin-bottom: 0.1rem;
    border-radius: 50%;
}

.join-nickname {
    width: 100%;
    text-align: center;
}


.value-rule-layout {
    display: flex;
    flex-direction: row;
}

.value-layout {
    display: flex;
    flex-direction: column;
}

.value-layout-item {
    display: flex;
    align-items: center;
}

.value-layout-item-icon {
    width: 1.25rem;
    height: 1.25rem;
    margin-right: 0.24rem;
}

.value-layout-item-text {
    font-weight: bold;
    font-size: var(--font-size-16);
    color: var(--color-d6);
}

.value-layout-item-tip {
    font-size: 0.5rem;
    color: #999;
}

.value-layout-item-2 {
    display: flex;
    align-items: center;
    margin-top: 0.83rem;
}

.rule-info-title {
    color: #999;
    font-size: var(--font-size-18);
    font-weight: bold;
}

.rule-info-text {
    flex-grow: 1;
    word-wrap: break-word;
    word-break: break-all;
    white-space: normal;
    color: #9AA1ADFF;
    margin-top: 0.2rem;
}

.rule-info-btn {
    display: flex;
    justify-content: end;
    align-items: center;
}

.rule-info-btn-i {
    display: flex;
    font-weight: bold;
    align-items: center;
    justify-content: center;
    height: 2rem;
    padding: 0 1.5rem;
    border-radius: 1rem;
    font-size: var(--font-size-16);
}



@media screen and (max-width: 1700px) {
    .boxGrid {
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    }
}

@media screen and (max-width:1450px) {
    .boxGrid {
        grid-template-columns: 1fr 1fr 1fr 1fr;
    }
}

@media screen and (max-width:1200px) {
    .boxGrid {
        grid-template-columns: 1fr 1fr 1fr;
    }
}

@media screen and (max-width:995px) {

    .boxGrid {
        grid-template-columns: 1fr 1fr;
        padding: 0;
        margin: 1rem;
        background-color: transparent;
    }
}

@media screen and (min-width:1701px) {
    .boxGrid {
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    }
}



.boxGrid .gridItem {
    display: flex;
    flex-direction: column;
    position: relative;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 0 .33rem;
    box-sizing: border-box;
    min-width: 0;
    aspect-ratio: 183 / 146;
    border-radius: .33rem;
}



.logos {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 2rem;
    height: 2rem;
    z-index: 0;
    opacity: .2;
    transform: translateX(-50%) translateY(-50%);
}

.boxGrid .gridItem .gun {
    flex: 1;
    height: 0;
    z-index: 1;
    object-fit: contain;
    transition: all 0.4s ease;
}

.boxGrid .gridItem:hover .gun {
    transform: scale(1.2);
}


.boxGrid .gridItem .user .imgBg {
    width: 100%;
    height: auto;
    left: 0;
    top: 0;
    object-fit: cover;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;
}

.boxGrid .gridItem .user .item {
    position: absolute;
    display: flex;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100%;
    align-items: center;
    left: 0;
    top: 0;
}


.card:hover .gun {
    transform: scale(1.2);
}

.boxGrid .gridItem .user {
    position: absolute;
    width: 100%;
    top: 0;
    align-items: center;
    left: 0;
    display: flex;
    box-sizing: border-box;
}



.boxGrid .gridItem .user .avatarsImg {
    width: .83rem;
    height: .83rem;
    border-radius: 50%;
    object-fit: cover;
    padding: 0.3rem;
}

.boxGrid .gridItem .user .userName {
    color: #EDEFF3FF;
    margin: 0.5rem 0;
    flex: 1;
    overflow: hidden;
    text-align: left;
    padding: 0 .33rem;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.boxGrid .gridItem .text {
    bottom: .33rem;
    display: flex;
    width: 100%;
    left: 0;
    padding: 0 .33rem;
    gap: .1rem;
    overflow: hidden;
    flex-direction: column;
    text-align: left;
    font-size: 0.8rem;
}

.drop-text {
    position: absolute;
    display: flex;
    flex-direction: column;
    bottom: 0;
    width: 100%;
    align-items: center;
    justify-content: center;
}

.drop-text .name {
    width: 100%;
    padding: 0 .33rem;
    margin-top: .15rem;
    box-sizing: border-box;
    text-align: left;
}

.boxGrid .gridItem .text .name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: calc(100% - .66rem);
    text-align: left;
    font-size: 0.58rem;
}

.price {
    font-family: 'din';
    color: var(--theme-color);
    display: flex;
    font-weight: bold;
    font-size: .6rem;
    align-items: center;
}

.bottom-box {
    height: .167rem;
    width: 48%;
    margin-top: .3rem;
    border-top-right-radius: .2rem;
    border-top-left-radius: .2rem;
}

.rate {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 2;
    cursor: pointer;
    padding: .33rem;
    width: .7rem;
    height: .7rem;
}

.rate-info {
    pointer-events: none;
    position: absolute;
    top: -1.29rem;
    right: 0;
    backdrop-filter: blur(4px);
    background-color: #FFFFFF4D;
    border: solid 1px #FFFFFF26;
    border-radius: 1.29rem;
    height: 1.29rem;
    display: flex;
    opacity: 0;
    align-items: center;
    padding: 0 .33rem;
    transition: all .3s ease;
}


.rate:hover+.rate-info {
    opacity: 1;
}



.boxGrid-users-layout {
    display: flex;
    border-radius: 4px;
    width: calc(100% - 2rem);
    flex-wrap: wrap;
    margin: 1rem;
    gap: .6rem;
    row-gap: .6rem;
    min-height: calc(100vh - var(--window-headerNav-height) - 2.71rem - 20rem);
}

@media screen and (max-width:995px) {


    .boxGrid-users-layout {
        background-color: transparent;
        margin: 0;
    }

    .back {
        height: 3rem;
        margin: 1rem;
        font-size: 1.08rem;
    }

    .coin-icon {
        width: 1.4rem;
        height: 1.4rem;
    }


    .roll-open-time {
        font-size: 1rem;
    }

    .type-icon {
        height: 1.08rem;
    }

    .roll-avatar {
        width: 3.66rem;
        height: 3.66rem;
        border-radius: 2rem;
        margin-right: 0.67rem
    }

    .value-rule-layout {
        display: flex;
        flex-direction: column;
        margin-top: 0.6rem;
    }

    .value-layout {
        display: flex;
        flex-direction: row;
        margin-bottom: 1rem;
    }

    .value-layout-item {
        flex-grow: 1;
        justify-content: center;
    }

    .value-layout-item-2 {
        flex-grow: 1;
        margin-top: 0;
        justify-content: center;
    }

    .value-layout-item-2-border {
        border-left: 1px solid #99999955;
        border-right: 1px solid #99999955;
    }

    .value-layout-item-icon {
        width: 1.8rem;
        height: 1.8rem;
        margin-right: 0.4rem;
    }

    .value-layout-item-text {
        font-size: 1rem;
    }

    .value-layout-item-tip {
        font-size: 0.7rem;
    }

    .rule-info-title {
        color: #999;
        font-size: 1rem;
        font-weight: bold;
    }

    .rule-info-text {
        flex-grow: 0;
        height: auto;
        font-size: 0.9rem;
        color: var(--color-d6);
        margin-top: 0.2rem;
    }

    .rule-info-btn {
        display: flex;
        margin-top: 0.6rem;
        justify-content: space-between;
    }


    .boxGrid .gridItem .text {
        font-size: 1.08rem;
    }

    .boxGrid .gridItem .text .name {
        font-size: 0.9rem;
    }

    .join-avatar {
        margin-bottom: 0.2rem;
    }

    .join-nickname {
        font-size: 0.9rem;
        margin-top: 0.2rem;
    }

}
</style>