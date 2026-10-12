<template>
    <div class="battle-detail-layout">
        <div class="back-layout">
            <div @click="back" class="back-text">
                <img class="size-1rem" src="/image/m_back.svg">
            </div>
            <div class="top-right">
                <div @click="joinButtonDo()" v-if="battleDetailData.status == 1" class="join-btn bold font-20 btn"
                    :class="{ 'exit-btn': joinBtnAction > 0 }">{{
                        getJoinButtonText() }}</div>
                <div @click="copyBattle" class="repeat-btn btn bold font-20 gap-8">
                    <span class="font-EDEFF3">{{ $t('battleDetail.copyBattle') }}</span>
                    <span class="din font-9AA1AD">{{ priceUnit() }}{{ formatCoin(battleDetailData.total_amount)
                        }}</span>
                </div>
                <div @click="share" class="line-btn btn">
                    <img src="/image/share.svg" alt="">
                </div>
            </div>
        </div>
        <div class="top-box">
            <div class="box-left font-18 font-EDEFF3">
                <div class="box-left-item">
                    <div class="din bold">
                        <span>{{
                            battleDetailData.current_bout }}</span>
                        <span class="font-6B7280">/{{ battleDetailData.bout }}</span>
                    </div>
                    <span class="font-14 font-999999"> {{ $t('battleDetail.round') }}</span>
                </div>
                <div class="box-left-item">
                    <span class="bold"> {{ priceUnit() }}{{ formatCoin(battleDetailData.total_amount) }}</span>
                    <span class="font-14 font-999999">{{ $t('battleDetail.battlePrice') }}</span>
                </div>
            </div>
            <div id="box-list" class="box-list">
                <div :id="`list${index}`" v-for="(item, index) in battleDetailData.box_info" class="box-list-item">
                    <img style="width: 100%;" :src="getImageUrl(item.image)" alt="">
                    <div v-if="currentBoxIndex == index && battleDetailData.status == 2" class="point">
                    </div>
                </div>
            </div>
        </div>
        <div class="content">
            <div :style="{ 'grid-template-columns': getGridBoxCount(battleUserData.length) }" class="gridBox">
                <div v-for="(item, index) in battleUserData" class="content-item">
                    <div class="content-item-box"
                        :class="{ 'content-item-box-lose': battleDetailData.status == 3 && !isWinner(item?.is_winner), 'content-item-box-win': battleDetailData.status == 3 && isWinner(item?.is_winner) }">
                        <div :style="{ 'padding': `0 ${1.5 * 1 / battleDetailData.room_num}rem` }"
                            class="content-item-user">
                            <div class="item-user-top">
                                <img v-if="item != null" class="size-full radius-circle"
                                    :src="getImageUrl(item.avatar)">
                                <div @click="apiJoinToBattle(id, index)" v-if="item == null"
                                    class="size-full radius-circle btn flex-center">
                                    <img src="/image/ba_add.svg" class="size-1rem">
                                </div>
                            </div>
                            <div
                                style="z-index: 1;flex-grow: 1;width: 0;;margin-left: 0.41rem;font-size: var(--font-size-16);color: var(--color-d6);font-weight: bold;">
                                <div class="text-single-line font-16">
                                    {{ item ?
                                        item.nickname :
                                        $t('battleDetail.waitingPlayer') }}</div>
                                <span class="font-18 din bold font-FFBF00">{{ priceUnit() }}{{ formatCoin(item ?
                                    item.curr_amount :
                                    0)
                                }}</span>
                            </div>
                        </div>
                        <div v-if="isWinner(item?.is_winner)" class="item-winner flash-animation">
                        </div>
                        <div class="content-item-goods">
                            <div v-if="battleDetailData.status == 1"
                                :style="{ 'color': item ? 'var(--theme-color)' : 'var(--color-d6)' }"
                                class="wait-status-text b-nickname">
                                {{ item ? $t('battleDetail.ready') : $t('battleDetail.waiting') }}</div>
                            <div v-if="battleDetailData.status == 3"
                                style="position: absolute;top: 0;bottom: 0;right: 0;left: 0;display: flex;align-items: center;font-size: 1rem;font-weight: bold;color: var(--theme-color);justify-content: center;">
                                <img :src="`/image/${(item?.is_winner == 1 || item?.is_winner == 3) ? 'win' : 'lose'}.svg`"
                                    style="height: 50%;width: 60%;">
                            </div>
                            <BattlePlayBox v-if="(item != null) && (battleDetailData.status == 2)"
                                :is-show="isShowPlayBox" :user_id="item.user_id" />
                        </div>
                    </div>
                    <div class="content-item-body">
                        <div class="content-item-result">
                            <div v-if="item" v-for="(child, index) in item.goods_info" class="content-item-result-goods"
                                :style="{ background: getGoodsBgColor(child.color) }">
                                <LogosIcon class="logos" :color="getGoodsBottomColor(child.color)" />
                                <img class="gun" :src="getImageUrl(child.image)">
                                <div class="drop-text">
                                    <div v-if="getExteriorName(child.exterior)" class="exterior">
                                        <span>{{ getExteriorName(child.exterior) }}</span>
                                    </div>
                                    <div class="name font-14 text-single-line">{{ child.name }}</div>
                                    <div class="base-row width-full">
                                        <div class="price">
                                            {{ priceUnit() }} {{ child.goods_price }}
                                        </div>
                                    </div>
                                    <div class="bottom-box"
                                        :style="{ backgroundColor: getGoodsBottomColor(child.color) }"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if="(battleDetailData.status == 2) && (timeDown > 0)" class="content-time">
                    <div
                        style="position: relative;width: 4.167rem;height: 4.167rem;display: flex;align-items: center;justify-content: center;">
                        <div style="width: 100%;height: 100%;background-color:  #f85149ff;filter: blur(80px);"></div>
                        <span
                            style="font-size: 4rem;color: #F85149FF;transform: translateX(3px) translateY(3px);font-style: italic;position: absolute;left: 0;right: 0;top: 0;bottom: 0;display: flex;align-items: center;justify-content: center;font-family: din;">{{
                                timeDown }}</span>
                        <span
                            style="font-size: 4rem;font-style: italic;position: absolute;left: 0;right: 0;top: 0;bottom: 0;display: flex;align-items: center;justify-content: center;font-family: din;">{{
                                timeDown }}</span>
                    </div>
                </div>
            </div>
        </div>
        <Footer></Footer>
    </div>
</template>

<script lang="ts" setup>
const { t } = useI18n()
import { inject, onMounted, onUnmounted, ref } from 'vue';
import BattlePlayBox from '../components/BattlePlayBox.vue';
import Footer from '../components/Footer.vue';
import LogosIcon from '../components/icons/LogosIcon.vue';
import useBattle from '../hooks/useBattle';
import router from '../router';
import { useUserStore } from '../store/user';
import { useWebSocketStore } from '../store/websocket';
import { copyText, formatCoin, getExteriorName, getGoodsBgColor, getGoodsBottomColor, getImageUrl, priceUnit } from '../utils';
import { showSuperOpDialog } from '../utils/dialogs.ts';

const { userInfo, isLogin } = useUserStore()

const websocketStore = useWebSocketStore();

const { battleDetailData, apiCopyBattle, apiCancelBattle, apiExitBattle, apiJoinToBattle, battleUserData, apiBattleDetail } = useBattle()

const x = defineProps(['id'])
const currentBoxIndex = ref(0)

const timeDown = ref(0)

let intervalId = 0

const htmlWidth = ref(0)

const isShowPlayBox = ref(false)

const emitter = inject("emitter");

const joinBtnAction = ref(-1)

let copyBoxData = null

const handleDeviceWidth = () => {
    htmlWidth.value = window.innerWidth
}

const handleMessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data)
    const cmd = data.cmd;
    if (cmd == 4203) {
        //状态改变 
        battleDetailData.status = data.data.status;
        //如果状态变成2 开始倒计时
        if (data.data.status == 2) {
            startTimeDown()
        } else {
            timeDown.value = 0
            clearInterval(intervalId)
        }
        battleUserData.length = 0
        //改变用户数据
        for (let index = 0; index < battleDetailData.room_num; index++) {
            let temp;
            for (const key of data.data.user_info) {
                if (key.position == index) {
                    temp = key;
                    break;
                }
            }
            battleUserData.push(temp);
        }
    } else if (cmd == 4208) {
        //1:开始动画，动画完成后显示history并且刷新用户的收益
        currentBoxIndex.value = data.data.curr_bount - 1
        battleDetailData.status = 2;
        timeDown.value = 0
        clearInterval(intervalId)
        //清除计时器
        battleDetailData.current_bout = data.data.curr_bount
        //上面的box移动到对应的位置
        moveToPositon(`list${currentBoxIndex.value}`)
        const users = data.data.users;
        for (const key of users) {
            for (let index = 0; index < battleUserData.length; index++) {
                const element = battleUserData[index]
                if (element.user_id == key.user_id) {
                    //开始动画
                    isShowPlayBox.value = true
                    emitter.emit("startBattleBoxAnima", {
                        'user_id': key.user_id,
                        'goods_info': data.data.goods_info,
                        'result_goods': key.history[0],
                        'callBack': () => {
                            element.goods_info = key.history
                            element.curr_amount = key.curr_amount
                        }
                    });
                }
            }
        }
    } else if (cmd == 4209) {
        battleDetailData.status = 3;
        timeDown.value = 0
        clearInterval(intervalId)
        //刷新用户的输赢状态和数据
        const users = data.data.user_info;
        for (const key of users) {
            for (let index = 0; index < battleUserData.length; index++) {
                const element = battleUserData[index]
                if (element.user_id == key.user_id) {
                    element.goods_info = key.goods_info
                    element.curr_amount = key.curr_amount
                    element.is_winner = key.is_winner
                    if (key.winner_goods) {
                        setTimeout(() => {
                            //显示最终收益的饰品和最终的收益
                            element.goods_info = key.winner_goods
                            element.curr_amount = key.winner_income
                        }, 500);
                    }
                }
            }
        }
    }
};

function isWinner(is_winner?: number) {
    if (is_winner) {
        return battleDetailData.status == 3 && (is_winner == 1 || is_winner == 3)
    }
    return ""
}

function startTimeDown(time = 5) {
    timeDown.value = time
    clearInterval(intervalId)
    intervalId = setInterval(() => {
        if (timeDown.value <= 0) {
            clearInterval(intervalId)
        } else {
            timeDown.value--
        }
    }, 1000);
}



async function joinButtonDo() {
    let result;




    switch (joinBtnAction.value) {
        case 0:
            showSuperOpDialog(
                {
                    price: battleDetailData.total_amount, type: 'joinBattle',
                    onConfirm: async () => {
                        const result = await apiJoinToBattle(x.id)
                        if (result) {
                            getData()
                        }
                    }
                }
            )
            break;
        case 1:
            showSuperOpDialog({
                text: t('battleDetail.confirmDissolveBattle'),
                onConfirm: async () => {
                    const result = await apiCancelBattle(x.id)
                    if (result) {
                        emitter.emit('upUserData')
                        back()
                        return
                    }
                }
            })
            break;
        case 2:
            showSuperOpDialog({
                text: t('battleDetail.confirmExitBattle'),
                onConfirm: async () => {
                    result = await apiExitBattle(x.id)
                    emitter.emit('upUserData')
                    if (result) {
                        getData()
                    }
                }
            })
            break;
    }

}

function getJoinButtonText() {
    for (const key of battleUserData) {
        if (key) {
            if (userInfo.id == key.user_id) {
                if (key.position == 0) {
                    joinBtnAction.value = 1
                    return t('battleDetail.dissolveBattle')
                } else {
                    joinBtnAction.value = 2
                    return t('battleDetail.exitBattle')
                }
            }
        }
    }
    joinBtnAction.value = 0
    return t('battleDetail.joinBattle')
}


onMounted(() => {
    window.addEventListener("resize", handleDeviceWidth);
    websocketStore.addMessageListener(handleMessage);
    joinToBattle()
    emitter.on('socketOpen', (data) => {
        //说明触发重连了
        joinToBattle()
    });
    getData()
})

async function getData() {
    const result = await apiBattleDetail(x.id)
    if (result) {
        currentBoxIndex.value = battleDetailData.current_bout - 1
        moveToPositon(`list${currentBoxIndex.value}`)
        //如果
        if (battleDetailData.status == 2 && battleDetailData.count_down) {
            if (battleDetailData.count_down > 0) {
                startTimeDown(battleDetailData.count_down)
            }
        }
    }
}

function moveToPositon(id: string) {
    const item = document.getElementById(id)
    const container = document.getElementById('box-list')
    if (!item) {
        return
    }
    const scrollLeft = item.offsetLeft - (container.offsetWidth - item.offsetWidth) / 2
    container.scrollTo({
        left: scrollLeft,
        behavior: 'smooth'
    })
}

function joinToBattle() {
    websocketStore.sendMessage(JSON.stringify({ 'cmd': 4202, 'data': { 'battle_id': x.id } }))
}

function back() {
    router.push({
        name: 'battle'
    })
}

function share() {
    let url = window.location.href
    if (isLogin) {
        url += "?code=" + userInfo.invite_code
    }
    copyText(url)
}

async function copyBattle() {
    const result = await apiCopyBattle(x.id)
    if (result) {
        copyBoxData = result.data.data
        localStorage.setItem('temp_copy_box_data', JSON.stringify(copyBoxData))
        router.push({
            name: 'create'
        })
    }
}

function getGridBoxCount(size: number) {
    let str = '';
    for (let index = 0; index < size; index++) {
        str += '1fr '
    }
    return str.substring(0, str.length - 1)
}

onUnmounted(() => {
    clearInterval(intervalId)
    window.removeEventListener("resize", handleDeviceWidth);
    websocketStore.removeMessageListener(handleMessage);
});

</script>

<style scoped>
@keyframes flash {

    0% {
        opacity: 1;
    }

    10% {
        opacity: 0.4;
    }

    20% {
        opacity: 1;
    }

    30% {
        opacity: 0.4;
    }

    40% {
        opacity: 1;
    }

    50% {
        opacity: 0.4;
    }

    60% {
        opacity: 1;
    }

    70% {
        opacity: 0.4;
    }

    80% {
        opacity: 1;
    }

    90% {
        opacity: 0.4;
    }

    100% {
        opacity: 0;
    }
}

.flash-animation {
    animation: flash 0.8s 1 forwards;
}

.battle-detail-layout {
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

.join-btn {
    height: 100%;
    color: #1A1206FF;
    padding: 0 1rem;
    display: flex;
    align-items: center;
    border-radius: 2rem;
    background-color: #FFBF00FF;
}

.exit-btn {
    background-color: #FFBF0026;
    color: #FFBF00FF;
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

.repeat-btn {
    height: 100%;
    background-color: #333A47FF;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 1rem;
}

.top-box {
    display: flex;
    height: 5.3rem;
    margin: 0 1rem;
    flex-shrink: 0;
    width: calc(100% - 2rem);
    box-sizing: border-box;
    padding: 0 1rem;
    background-color: #171A21FF;
    border: 1px solid#333A47FF;
    border-radius: .66rem;
}

.item-winner {
    position: absolute;
    top: 0;
    left: 0;
    background-color: #00000044;
    width: 100%;
    height: 100%;
}

.box-left {
    display: flex;
    gap: 0.3rem;
    align-items: center;
}

.box-left-item {
    width: 4.6rem;
    height: 3rem;
    display: flex;
    background-color: #262B35FF;
    border-radius: .3rem;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}


.box-list {
    display: flex;
    flex-grow: 1;
    align-items: center;
    overflow-x: auto;
    gap: var(--font-size-20);
    margin-left: var(--font-size-20);
}

.point {
    position: absolute;
    height: var(--font-size-20);
    width: var(--font-size-20);
    transform: translateX(-50%);
    left: 50%;
    top: -4%;
    background: url(/image/point.svg) no-repeat;
    background-size: 100% 100%;
}

.box-list-item {
    height: 4rem;
    width: 4rem;
    flex-shrink: 0;
    position: relative;
}

.content {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    width: 100%;
    box-sizing: border-box;
    position: relative;
}

.gridBox {
    display: grid;
    gap: 0.66rem;
    width: 100%;
}

.content-time {
    position: absolute;
    top: 1rem;
    left: 1rem;
    right: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 18.2rem;
}

.wait-status-text {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    left: 0;
    display: flex;
    align-items: center;
    font-size: 1rem;
    font-weight: bold;
    color: var(--theme-color);
    justify-content: center;
}

.content-item {
    display: flex;
    gap: 0.084rem;
    border-radius: 0.42em;
    position: relative;
    flex-direction: column;
}

.content-item-box {
    display: flex;
    width: 100%;
    position: relative;
    background-color: #171A21FF;
    border-radius: .66rem;
    box-shadow: inset 0 0 0 1px #333A47FF;
    flex-direction: column;
}

.content-item-box-lose {
    background: linear-gradient(180deg, #3a151066 0%, #b54a3c80 100%);
    box-shadow: inset 0 0 0 1px #8A3A2E80;
}

.content-item-box-win {
    background: linear-gradient(180deg, #3a2d0e66 0%, #b8942a80 100%);
    box-shadow: inset 0 0 0 1px #7e672e80;
}

.content-item-user {
    height: 3rem;
    position: relative;
    display: flex;
    align-items: center;
}

.item-user-top {
    z-index: 1;
    width: 1.66rem;
    height: 1.66rem;
    border-radius: 1rem;
    background-color: #4F4F4F;
    display: flex;
    align-items: center;
    justify-content: center;
}

.content-item-goods {
    height: 250px;
    position: relative;

}

.content-item-body {
    display: flex;
    flex-direction: column;
    min-height: 5.08rem;
    padding: 1%;
}

.content-item-result {
    display: flex;
    flex-wrap: wrap;
    padding: 0 0.5rem;
    justify-content: center;
    max-height: 20rem;
    overflow-y: auto;
}

.content-item-result-goods {
    position: relative;
    display: flex;
    width: 6.87rem;
    border-radius: .5rem;
    margin: 0.1rem 0.1rem;
    height: 5.496rem;
    justify-content: flex-start;
    flex-direction: column;
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

.gun {
    flex: 1;
    height: 0;
    object-fit: contain;
    transition: all 0.4s ease;
}

.content-item-result-goods:hover .gun {
    scale: 1.2;
}

.drop-text {
    display: flex;
    flex-direction: column;
    bottom: 0;
    width: 100%;
    align-items: center;
    justify-content: center;
}


.exterior {
    display: flex;
    width: 100%;
    padding-left: .33rem;
    box-sizing: border-box;
    justify-content: start;
}

.exterior span {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 0.7rem;
    border-radius: .7rem;
    font-size: .5rem;
    width: 1.33rem;
    font-weight: bold;
    background-color: #FFFFFF4D;
    border: solid 1px #FFFFFF26;
    backdrop-filter: blur(16);
}

.drop-text .name {
    width: 100%;
    padding: 0 .33rem;
    margin-top: .15rem;
    box-sizing: border-box;
    text-align: left;
}


.price {
    font-family: 'din';
    color: var(--theme-color);
    display: flex;
    padding-left: .3rem;
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


@media screen and (max-width:995px) {


    .box-left-item {
        font-size: 1rem;
        gap: 0;
    }





    .b-goods-name {
        font-size: 0.8rem;
    }
}
</style>