<template>
    <div class="battle-layout">
        <div class="battle-body">
            <SuperTab :tab-arr="tabArr" v-on:change="onChangeTab">
                <div class="battle-tab-action _windows">
                    <div v-on:click="showBattleHelpDialog" class="battle-icon-btn">
                        <HelpIcon class="size-1rem" />
                    </div>
                    <div v-on:click="createBattle" class="battle-add-btn">
                        <img class="size-1rem" src="/image/battle_add.svg" alt="">
                        <span>{{ $t('battle.createBattle') }}</span>
                    </div>
                </div>
            </SuperTab>
            <div class="battle-content">
                <BattleSortLayout v-on:change-data="onChangeData" :is-show-by-me="isShowByMe" />
                <div class="battle-list">
                    <div v-for="value in (tabIndex > 0 ? battleHistoryData : battleListData)"
                        class="battle-list-cell _windows" :class="{ 'battle-list-cell-alpha': tabIndex > 0 }">
                        <div class="battle-list-left-time font-14 gap-8">
                            <span :class="{ 'status': true, 'font-FFBF00': value.status == 1 }">{{
                                $t(battleState(value.status)) }}</span>
                            <div class="time-box">
                                <span class="din">{{ value.bout }}</span>
                                <div class="time-tips font-12">
                                    ROUNDS
                                </div>
                            </div>
                        </div>
                        <div class="battle-list-cell-box">
                            <div class="battle-list-cell-box-view">
                                <div v-for="item in value.box_info" class="cell">
                                    <img class="size-full" :src="cdnUrl + item.image" alt="">
                                    <div class="count font-15">
                                        {{ `x${item.box_num}` }}
                                    </div>
                                </div>
                            </div>
                            <div class="battle-list-cell-box-mask"></div>
                        </div>
                        <div class="battle-list-cell-info">
                            <div class="players">
                                <div class="price-btn font-18">
                                    {{ priceUnit() }} {{ formatCoin(value.total_amount) }}
                                </div>
                                <div class="base-row gap-8">
                                    <div v-for="user in 4" class="seat">
                                        <div class="user">
                                            <img v-if="!value.user_info[user - 1]" class="size-1rem"
                                                :src="`/image/${isShowUser(user - 1, value.room_num) ? 'user_add' : 'lock'}.svg`"
                                                alt="">
                                            <img class="size-full radius-circle" v-if="value.user_info[user - 1]"
                                                :src="cdnUrl + value.user_info[user - 1].avatar" alt="">
                                            <img v-if="tabIndex > 0 && isShowWinner(value.user_info[user - 1])"
                                                style="position: absolute;top: -64%;width: 100%;" src="/image/win.svg">
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="action-layout">
                                <div v-on:click="joinToBattle($event, value, value.user_info)"
                                    v-if="value.status == 1 && isShowJoin(value.user_info)"
                                    class="action font-16 bold btn color-FFBF00 font-1A1206">
                                    {{ $t('battle.join') }}
                                </div>
                                <div v-on:click="goToDetail(value.battle_id)" class="action font-16 bold btn">
                                    {{ $t('battle.watch') }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-for="value in (tabIndex > 0 ? battleHistoryData : battleListData)"
                        class="battle-list-cell _mobile">
                        <div class="base-row between width-full">
                            <div class="battle-list-left-time">
                                <div class="time-box">
                                    <span class="din">{{ value.bout }}</span>
                                </div>
                                <span :class="{ 'status': true, 'font-FFBF00': value.status == 1 }">{{
                                    $t(battleState(value.status)) }}</span>
                            </div>
                            <div class="base-row battle-list-cell-info">
                                <div class="players gap-8">
                                    <div v-for="user in 4" class="seat">
                                        <div class="user">
                                            <img v-if="!value.user_info[user - 1]" class="icon-lock"
                                                :src="`/image/${isShowUser(user - 1, value.room_num) ? 'user_add' : 'lock'}.svg`"
                                                alt="">
                                            <img class="size-full radius-circle" v-if="value.user_info[user - 1]"
                                                :src="cdnUrl + value.user_info[user - 1].avatar" alt="">
                                            <img v-if="tabIndex > 0 && isShowWinner(value.user_info[user - 1])"
                                                style="position: absolute;top: -64%;width: 100%;" src="/image/win.svg">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="battle-list-cell-box">
                            <div class="battle-list-cell-box-view">
                                <div v-for="item in value.box_info" class="cell">
                                    <img class="size-full" :src="cdnUrl + item.image" alt="">
                                    <div class="count font-15">
                                        {{ `x${item.box_num}` }}
                                    </div>
                                </div>
                            </div>
                            <div class="battle-list-cell-box-mask"></div>
                        </div>
                        <div class="base-row width-full flex-center">
                            <div class="price-btn font-18">
                                {{ priceUnit() }} {{ formatCoin(value.total_amount) }}
                            </div>
                            <div class="action-layout">
                                <div v-on:click="joinToBattle($event, value, value.user_info)"
                                    v-if="value.status == 1 && isShowJoin(value.user_info)"
                                    class="action font-16 bold btn color-FFBF00 font-1A1206">
                                    {{ $t('battle.join') }}
                                </div>
                                <div v-on:click="goToDetail(value.battle_id)" class="action font-16 bold btn">
                                    {{ $t('battle.watch') }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <LoadMoreButton ref="loadMoreRef" v-on:load-data="loadMore" />
                    <div v-on:click="createBattle" class="float-add _mobile btn">
                        <img src="/image/create_add.svg" alt="">
                    </div>
                </div>
                <StateLayout class="state-layout" :load-state="loadState" empty-icon="no-battle" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { inject, onMounted, onUnmounted, reactive, ref, watch } from 'vue';
import BattleSortLayout from '../components/battle/BattleSortLayout.vue';
import SuperTab from '../components/common/SuperTab.vue';
import HelpIcon from '../components/icons/main/HelpIcon.vue';
import LoadMoreButton from '../components/LoadMoreButton.vue';
import StateLayout from '../components/StateLayout.vue';
import useBattle from '../hooks/useBattle.ts';
import router from '../router/index.ts';
import { useUserStore } from '../store/user.ts';
import { showBattleHelpDialog, showSuperOpDialog } from '../utils/dialogs.ts';
import { cdnUrl, formatCoin, priceUnit } from '../utils/index.ts';
const userStore = useUserStore()

const { apiBattleList, apiBattleHistoryList, battleListData, battleHistoryData, apiJoinToBattle } = useBattle()

const tabIndex = ref(0)

const loadMoreRef = ref<any>(null)

const loadState = ref(0)

let page = 1

let size = 0

const isShowByMe = ref(true)

let sortParam: any = {};

let timeoutId = 0

const emitter = inject<any>("emitter");

const tabArr = reactive([
    {
        't': 'battle.active',
        'i': 0,
        'count': 0
    }, {
        't': 'battle.Completed',
        'i': 1,
    }, {
        't': 'battle.MyEntries',
        'i': 2,
    }
])

function isShowJoin(user: any) {
    for (const key in user) {
        const element = user[key];
        if (element.user_id == userStore.userInfo.id) {
            return false
        }
    }
    return true
}

onMounted(() => {
    getData()
})

function onChangeTab(index: number) {
    tabIndex.value = index
}

watch(tabIndex, () => {
    isShowByMe.value = tabIndex.value == 0
    if (tabIndex.value != 0) {
        loadState.value = 0
    }
    getData()
})

function startTask() {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
        size = battleListData.length
        getData()
    }, 3000);
}

async function getData(isShow = true) {
    if (isShow) {
        page = 1
        loadMoreRef.value?.chageStatus(0)
    }
    clearTimeout(timeoutId)
    let r = <any>{};
    if (tabIndex.value > 0) {
        r = await apiBattleHistoryList({
            page: page,
            size: size,
            type: tabIndex.value == 1 ? 1 : 2,
            room_num: sortParam.room_num,
            order_price: sortParam.order_price,
            order_time: sortParam.order_time,
            my: sortParam.my
        })
    } else {
        r = await apiBattleList({
            page: page,
            size: size,
            room_num: sortParam.room_num,
            order_price: sortParam.order_price,
            order_time: sortParam.order_time,
            my: sortParam.my
        })
    }
    if (r) {
        if (tabIndex.value == 0) {
            tabArr[0].count = r.data.data.count
        }
        if (r.data.data.result.length < 20) {
            if (battleListData.length == 0) {
                if (tabIndex.value == 0) {
                    loadState.value = 2
                }
            } else {
                loadMoreRef.value?.chageStatus(3)
            }
        } else {
            loadMoreRef.value?.chageStatus(1)
        }
    }
    if (tabIndex.value == 0) {
        startTask()
    }
}

function isShowUser(index: number, room_num: number) {
    return index < room_num
}

function isShowWinner(user: any) {
    if (user) {
        if (user.is_winner == 1 || user.is_winner == 3) {
            return true
        }
    }
    return false
}

function battleState(status: number): string {
    if (status == 2) {
        return 'battle.inProgress'
    } else if (status == 1) {
        return 'battle.waiting'
    } else if (status == 3) {
        return 'battle.ended'
    }
    return ''
}

function onChangeData(data: any) {
    sortParam = data
    getData()
}

async function loadMore() {
    page++
    getData(false)
}



function createBattle() {
    router.push({
        name: 'create'
    })
}


async function joinToBattle(event: any, data: any, users: any, position?: number) {
    event.stopPropagation()
    let isJoin = false;
    if (users) {
        for (const key of users) {
            if (key.user_id == userStore.userInfo.id) {
                isJoin = true
                break
            }
        }
    }
    if (data.status == 1 && !isJoin) {
        if (localStorage.getItem('agreeJoinBattleKey') == 'true') {
            const result = await apiJoinToBattle(data.battle_id, position)
            if (result) {
                emitter.emit('upUserData')
                goToDetail(data.battle_id)
            }
        } else {
            showSuperOpDialog({
                price: data.total_amount, type: 'joinBattle', agreeKey: 'agreeJoinBattleKey',
                onConfirm: async () => {
                    const result = await apiJoinToBattle(data.battle_id, position)
                    if (result) {
                        emitter.emit('upUserData')
                        goToDetail(data.battle_id)
                    }
                }
            })
        }

    } else {
        goToDetail(data.battle_id)
    }
}


function goToDetail(id: string) {
    clearTimeout(timeoutId)
    router.push({
        name: 'battleDetail',
        params: {
            id: id
        }
    })
}

onUnmounted(() => {
    clearTimeout(timeoutId)
})

</script>

<style scoped>
.battle-layout {
    height: 100%;
    width: 100%;
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    align-items: center;
    display: flex;
    flex-direction: column;
}

.battle-body {
    position: relative;
    width: calc(100% - 2rem);
    height: 100%;
    box-sizing: border-box;
    overflow-y: auto;
    padding-bottom: 1rem;
    display: flex;
    flex-direction: column;
}


.battle-tab-action {
    flex: 1;
    align-items: center;
    display: flex;
    gap: .4rem;
    justify-content: end;
    width: 0;
}

.battle-icon-btn {
    padding: 0 .3rem;
    height: 60%;
    display: flex;
    cursor: pointer;
    touch-action: none;
    align-items: center;
}

.battle-add-btn {
    height: 2.16rem;
    gap: .33rem;
    display: flex;
    cursor: pointer;
    touch-action: none;
    font-size: .83rem;
    font-weight: bold;
    align-items: center;
    border-radius: 2rem;
    background-color: #FFBF00FF;
    color: #1A1206FF;
    padding: 0 .66rem;
}

.battle-content {
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-top: 1rem;
    box-sizing: border-box;
    background-color: #171A21FF;
    border: 1px solid #333A47FF;
    border-radius: .66rem;
    padding: 1rem;
    gap: .5rem;
}

.battle-list {
    width: 100%;
    overflow-y: auto;
    padding: .5rem 0;
    gap: .83rem;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
}

.battle-list-cell {
    display: flex;
    flex-shrink: 0;
    background-color: #0E1014FF;
    align-items: center;
    height: 7rem;
    gap: 1.33rem;
    display: flex;
    padding: 0 1rem;
    border: 1px solid #262B35FF;
    border-radius: .66rem;
}

.battle-list-cell-alpha {
    opacity: .6;
}

.battle-list-left-time {
    display: flex;
    justify-content: center;
    flex-direction: column;
}

.battle-list-left-time .status {
    color: #9AA1ADFF;
    text-align: center;
}

.battle-list-left-time .time-box {
    position: relative;
    width: 2.5rem;
    height: 2.5rem;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    font-size: 1.33rem;
    font-weight: bold;
    justify-content: center;
    border: 2px solid #6B7280FF;
}

.battle-list-left-time .time-box .time-tips {
    position: absolute;
    bottom: -.25rem;
    border-radius: .4rem;
    padding: 0 .2rem;
    background-color: #333A47FF;
    font-weight: bold;
    color: #9AA1ADFF;
}

.battle-list-cell-box {
    position: relative;
    flex: 1;
    overflow: hidden;
    height: 100%;
}

.battle-list-cell-box-view {
    overflow-x: auto;
    overflow-y: hidden;
    display: flex;
    width: 100%;
    gap: 1rem;
    height: 100%;
    align-items: center;
}

.battle-list-cell-box .battle-list-cell-box-view .cell {
    position: relative;
    width: 4.16rem;
    flex-shrink: 0;
    height: 4.16rem;
}

.battle-list-cell-box .count {
    position: absolute;
    top: 0;
    right: 0;
    font-weight: bold;
    background-color: #FFBF00FF;
    border-radius: .5rem;
    padding: 0 .25rem;
    height: .75rem;
    color: #1A1206FF;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'din';
}

.battle-list-cell-box-mask {
    position: absolute;
    right: 0;
    top: 0;
    width: 3rem;
    background: linear-gradient(90deg, #0E101400, #0E1014FF);
    height: 100%;
}


.battle-list-cell-info {
    display: flex;
    height: 100%;
    gap: 1rem;
    justify-content: center;
    flex-direction: column;
}

.battle-list-cell-info .players {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.battle-list-cell-info .action-layout {
    display: flex;
    align-items: center;
    width: 100%;
    gap: .6rem;
}

.battle-list-cell-info .action-layout .action {
    flex: 1;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #1F232CFF;
    border-radius: 1rem;
}



.battle-list-cell-info .players .price-btn {
    width: 5rem;
    height: 1.67rem;
    background-color: #FFBF0026;
    border-radius: 1rem;
    font-family: 'din';
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FFBF00FF;
}

.battle-list-cell-info .players .seat {
    display: flex;
    align-items: center;
    position: relative;
}

.battle-list-cell-info .players .seat .user {
    width: 1.67rem;
    height: 1.67rem;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #1F232CFF;
}

.state-layout {
    position: relative;
    min-height: 10rem;
}

.float-add {
    position: fixed;
    bottom: 80px;
    width: 44px;
    z-index: 2;
    right: 20px;
    height: 44px;
}

@media screen and (max-width: 995px) {

    .battle-body {
        width: 100%;
        background-color: #0E1014FF;
    }



    .battle-content {
        flex: 1;
        border: none;
        overflow-y: auto;
        border-radius: 0;
        margin-top: 12px;
        background-color: transparent;
        padding: 16px;
    }

    .battle-list {
        flex: 1;
        height: 0;
        padding: 8px 0;
        padding-bottom: 44px;
    }



    .battle-list-cell {
        flex-direction: column;
        padding: 16px;
        gap: 16px;
        height: fit-content;
    }

    .battle-list-left-time {
        flex-direction: row;
        align-items: center;
        gap: 8px;
    }

    .battle-list-left-time .time-box {
        width: 30px;
        height: 30px;
        font-size: 18px;
        font-family: 'din';
    }

    .battle-list-cell-info .players {
        gap: 8px;
    }

    .battle-list-cell-info .players .seat .user {
        width: 30px;
        height: 30px;
    }

    .icon-lock {
        height: 18px;
        width: 18px;
    }

    .battle-list-cell-box {
        width: 100%;
        height: fit-content;
    }

    .price-btn {
        width: 81px;
        font-family: 'din';
        font-weight: bold;
        display: flex;
        color: #FFBF00FF;
    }

    .battle-tab-count {
        font-size: 14px;
    }

    .action-layout {
        flex: 1;
        width: 0;
        display: flex;
        gap: 16px;
        height: 40px;
    }

    .count {
        font-size: 12px;
        font-family: 'din';
    }

    .action {
        flex: 1;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #1F232CFF;
        border-radius: 1rem;
    }
}
</style>