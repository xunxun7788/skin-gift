<template>
    <div class="top-layout">
        <BaseTab class="baseTab" :tabs="[$t('battle.battle'), $t('battle.battleHistory'), $t('battle.myParticipated')]"
            :changeTab="changeTab" />
        <div class="top-right">
            <div @click="showHelp" class="help">
                <img class="help-icon" src="/image/help.svg" alt="" />
                <span class="_windows">{{ $t('battle.gameIntro') }}</span>
            </div>
            <div @click="showAddBattleDialog" class="top-right-btn _windows">
                <img style="height: 1rem;width: 1rem;" src="/image/add.svg">
                {{ $t('battle.createBattle') }}
            </div>
        </div>
    </div>
    <div v-if="tabIndex == 0" class="center-box">
        <div style="display: flex;padding-right: 1rem;">
            <div @click="showBoxDetail(item.id)" v-for="item in battleBoxListData" class="center-box-item">
                <div :style="`background-image: url(${$cdnUrl + item.image})`" class="center-box-img">
                </div>
                <span>{{ item.name }}</span>
                <span
                    style="font-weight: bold;font-family: din;color: transparent;background: linear-gradient(180deg, white, var(--theme-color));-webkit-background-clip: text;">{{
                        item.price }}</span>
            </div>
        </div>
    </div>
    <div v-if="tabIndex == 0" class="content-item-title _windows">
        <div style="width: 4.6rem;display: flex;align-items: center;justify-content: center;">
            {{ $t('battle.round') }}
        </div>
        <div style="flex-grow: 1;width: 0;display: flex;align-items: center;justify-content: center;">
            {{ $t('battle.battleScene') }}
        </div>
        <div style="width: 5.8rem;display: flex;align-items: center;justify-content: center;">
            {{ $t('common.price') }}
        </div>
        <div style="width: 7.3rem;display: flex;align-items: center;justify-content: center;">
            {{ $t('battle.players') }}
        </div>
        <div style="width: 5.25rem;"></div>
    </div>
    <div v-if="tabIndex > 0" class="content-item-title _windows">
        <div style="width: 7.79rem;display: flex;align-items: center;justify-content: center;">
            {{ $t('common.time') }}
        </div>
        <div style="width: 2.5rem;display: flex;align-items: center;justify-content: center;">
            {{ $t('battle.round') }}
        </div>
        <div style="flex-grow: 1;width: 0;display: flex;align-items: center;justify-content: center;">
            {{ $t('battle.battleScene') }}
        </div>
        <div style="width: 5.8rem;display: flex;align-items: center;justify-content: center;">
            {{ $t('common.price') }}
        </div>
        <div style="width: 7.3rem;display: flex;align-items: center;justify-content: center;">
            {{ $t('battle.players') }}
        </div>
    </div>
    <div class="content _windows">
        <div @click="goToDetail(item.battle_id)" v-for="(item, index) in battleListData" v-if="tabIndex == 0"
            class="content-item" :key="index">
            <div
                style="width: 4.6rem;flex-direction: column;display: flex;align-items: center;justify-content: center;">
                <div style="position: relative;">
                    <img :src="`/image/ba_i${item.status == '1' ? '' : '1'}.svg`">
                    <div
                        style="position: absolute;left: 0;top: 0;left: 0;align-items: center;width: 100%;display: flex;flex-direction: column;font-size: 1.33rem;font-weight: bold;height: 100%;">
                        <span style="height: 90%;display: flex;align-items: center;">{{ item.bout }}</span>
                        <span
                            :style="`height: 10%;font-size: var(--font-size-14);color: ${item.status == 1 ? '#999' : 'var(--theme-color)'};`">{{
                                getStatueText(item.status)
                            }}</span>
                    </div>
                </div>
            </div>
            <div
                style="flex-grow: 1;height: 5rem;align-items: center;width: 0;overflow-x: auto;display: flex;flex-direction: row;">
                <div v-for="(child, index) in item.box_info"
                    style="position: relative;width: 4.16rem;height: 4.16rem;flex-shrink: 0;margin-right: 0.3rem;">
                    <img :src="$cdnUrl + child.image" style="width: 100%;height: 100%;background-size: contain;">
                    <div
                        style="position: absolute;background-color: #FFBF00;padding: 0 0.33rem;border-radius: 2px;top: 0;right: 0;color: #060403;font-weight: bold;font-size: var(--font-size-14);">
                        x{{ child.box_num }}</div>
                </div>
            </div>
            <div style="width: 5.8rem;display: flex;align-items: center;justify-content: center;">
                <img style="width: 1rem;height: 1rem;" src="/image/zs.svg">
                <span
                    style="background: linear-gradient(180deg,white,var(--theme-color));margin-left: 0.2rem;-webkit-background-clip: text;font-family: din;font-size: var(--font-size-20);color: transparent;">{{
                        item.total_amount }}</span>
            </div>
            <div style="width: 7.3rem;display: flex;gap: 0.2rem;align-items: center;">
                <div v-for="(ccc, cccIndex) in item.room_num"
                    style="background-color: grey;width: 1.66rem;height: 1.66rem;border-radius: 1rem;display: flex;align-items: center;justify-content: center;">
                    <img v-if="getBattleUser(item.user_info, cccIndex) != null"
                        :src="$cdnUrl + getBattleUser(item.user_info, cccIndex).avatar"
                        style="width: 100%;height: 100%;border-radius: 50%;">
                    <div @click="joinToBattle($event, item.status, item, item.user_info, cccIndex)"
                        v-if="getBattleUser(item.user_info, cccIndex) == null"
                        style="height: 1.66rem;display: flex;align-items: center;justify-content: center;width: 100%;">
                        <img v-if="getBattleUser(item.user_info, cccIndex) == null" style="width: 1rem;height: 1rem;"
                            src="/image/ba_add.svg">
                    </div>
                </div>
            </div>
            <div @click="joinToBattle($event, item.status, item, item.user_info)"
                :class="{ 'join-btn': true, 'join-line-btn': isShowLineButton(item.status, item.user_info) }">{{
                    getButtonText(item.status, item.user_info) }}</div>
        </div>
        <div @click="goToDetail(item.battle_id)" v-for="(item, index) in battleHistoryData" v-if="tabIndex > 0"
            class="content-item" :key="index">
            <div
                style="width: 7.79rem;display: flex;justify-content: center;font-size: var(--font-size-14);color: #999;">
                {{ item.create_time }}
            </div>
            <div
                style="width: 2.5rem;flex-direction: column;display: flex;align-items: center;justify-content: center;">
                <div style="position: relative;">
                    <img :src="`/image/ba_i${item.status == 2 ? '1' : ''}.svg`">
                    <div
                        style="position: absolute;left: 0;top: 0;left: 0;align-items: center;width: 100%;display: flex;flex-direction: column;font-size: 1.33rem;font-weight: bold;height: 100%;">
                        <span style="height: 90%;display: flex;align-items: center;">{{ item.bout }}</span>
                        <span style="height: 10%;"></span>
                    </div>
                </div>
            </div>
            <div
                style="flex-grow: 1;height: 5rem;padding-left: var(--font-size-20);align-items: center;width: 0;overflow-x: auto;display: flex;flex-direction: row;">
                <div v-for="(child, index) in item.box_info"
                    style="position: relative;width: 4.16rem;height: 4.16rem;flex-shrink: 0;margin-right: 0.3rem;">
                    <img :src="$cdnUrl + child.image" style="width: 100%;height: 100%;background-size: contain;">
                    <div
                        style="position: absolute;background-color: #FFBF00;padding: 0 0.33rem;border-radius: 2px;top: 0;right: 0;color: #060403;font-weight: bold;font-size: var(--font-size-14);">
                        x{{ child.box_num }}</div>
                </div>
            </div>
            <div style="width: 5.8rem;display: flex;align-items: center;justify-content: center;">
                <img style="width: 1rem;height: 1rem;" src="/image/zs.svg">
                <span
                    style="background: linear-gradient(180deg,white,var(--theme-color));margin-left: 0.2rem;-webkit-background-clip: text;font-family: din;font-size: var(--font-size-20);color: transparent;">{{
                        item.total_amount }}</span>
            </div>
            <div style="width: 7.3rem;display: flex;gap: 0.2rem;align-items: center;">
                <div v-for="(ccc, cccIndex) in item.room_num"
                    style="background-color: grey;width: 1.66rem;height: 1.66rem;border-radius: 1rem;display: flex;align-items: center;justify-content: center;position: relative;">
                    <img v-if="(getBattleUser(item.user_info, cccIndex)?.is_winner != 2) && item.status == 3"
                        style="position: absolute;top: -64%;width: 100%;" src="/image/win.svg">
                    <img v-if="getBattleUser(item.user_info, cccIndex) != null"
                        :src="$cdnUrl + getBattleUser(item.user_info, cccIndex).avatar"
                        style="width: 100%;height: 100%;border-radius: 50%;">
                    <img v-if="getBattleUser(item.user_info, cccIndex) == null" style="width: 1rem;height: 1rem;"
                        src="/image/ba_add.svg">
                </div>
            </div>
        </div>
        <div style="display: flex;align-items: center;justify-content: center;">
            <div v-if="isCanLoadMore()" @click="loadMore"
                style="height: 2.5rem;cursor: pointer;;border-radius: 4px;display: flex;align-items: center;color: #060403;background-color: var(--theme-color);font-weight: bold;font-size: var(--font-size-18);padding: 0 1rem;margin-top: 1rem;">
                {{ $t('battle.clickLoad') }}</div>
        </div>
        <StateLayout :load-state="battleLoadState" :empty-text="battlEmptyText" />
    </div>
    <div class="content _mobile">
        <br>
        <div v-if="tabIndex == 0">
            <div @click="goToDetail(item.battle_id)" class="mm-card" v-for="item in battleListData">
                <div class="mm-card-top">
                    <div class="mm-card-top-left">
                        <div style="position: relative;font-size: 1.5rem;font-weight: bold;">
                            <img :src="`/image/ba_i${item.status == 2 ? '1' : ''}.svg`"
                                style="width: 4rem;height: 4rem;">
                            <span
                                style="position: absolute;top: 0;left: 0;right: 0;bottom: 8%;display: flex;align-items: center;justify-content: center;">10</span>
                        </div>
                        <span
                            :style="`font-size: 1.2rem;color: ${item.status == 1 ? '#999' : 'var(--theme-color)'};`">{{
                                getStatueText(item.status)
                            }}</span>

                    </div>
                    <div class="mm-card-top-right">
                        <div v-for="(child, cccIndex) in item.room_num"
                            style="background-color: grey;width: 2.66rem;height: 2.66rem;border-radius: 2rem;display: flex;align-items: center;justify-content: center;position: relative;">
                            <img v-if="getBattleIsWinner(item.user_info, cccIndex)"
                                style="position: absolute;top: -64%;width: 100%;" src="/image/win.svg">
                            <img v-if="getBattleUser(item.user_info, cccIndex) != null"
                                :src="$cdnUrl + getBattleUser(item.user_info, cccIndex).avatar"
                                style="width: 100%;height: 100%;border-radius: 50%;">
                            <div @click="joinToBattle($event, item.status, item, item.user_info, cccIndex)"
                                v-if="getBattleUser(item.user_info, cccIndex) == null"
                                style="width: 100%;height: 100%;display: flex;align-items: center;justify-content: center;border-radius: 50%;">
                                <img style="cursor: pointer;width: 1.8rem;height: 1.8rem;" src="/image/ba_add.svg">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mm-card-boxs">
                    <div style="padding-right: 0.5rem;justify-content: center;display: flex;gap: 0.5rem;">
                        <div style=" position: relative;display: flex;align-items: center;"
                            v-for="child in item.box_info">
                            <img style="width: 9rem;height: 9rem;" :src="$cdnUrl + child.image" alt="">
                            <div
                                style="font-family: din;font-size: 1rem;font-weight: bold;color: #060403;display: flex;align-items: center;position: absolute;right: 0;top: 3%;height: 1.4rem;border-radius: 2px;padding: 0 0.4rem;background-color: var(--theme-color);">
                                x{{ child.box_num }}
                            </div>
                        </div>
                    </div>

                </div>
                <div class="mm-card-bottom">
                    <div
                        style="display: flex;align-items: center;font-size: 1.1rem;color: var(--theme-color);font-family: din;gap: 0.3rem;">
                        <img src="/image/zs.svg" style="height: 1.3rem;">
                        <span>{{ item.total_amount }}</span>
                    </div>
                    <div @click="joinToBattle($event, item.status, item, item.user_info)"
                        :class="{ 'join-btn': true, 'join-line-btn': isShowLineButton(item.status, item.user_info) }">
                        {{ getButtonText(item.status, item.user_info) }}
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            <div v-if="tabIndex > 0">
                <div @click="goToDetail(item.battle_id)" class="mm-card" v-for="item in battleHistoryData">
                    <div class="mm-card-top">
                        <div class="mm-card-top-left">
                            <div style="position: relative;font-size: 1.5rem;font-weight: bold;">
                                <img :src="`/image/ba_i${item.status == 2 ? '1' : ''}.svg`"
                                    style="width: 4rem;height: 4rem;">
                                <span
                                    style="position: absolute;top: 0;left: 0;right: 0;bottom: 8%;display: flex;align-items: center;justify-content: center;">{{
                                        item.bout }}</span>
                            </div>
                            <span
                                :style="`font-size: 1.2rem;color: ${item.status != 1 ? '#999' : 'var(--theme-color)'};`">{{
                                    getStatueText(item.status)
                                }}</span>

                        </div>
                        <div class="mm-card-top-right">
                            <div v-for="(child, cccIndex) in item.room_num"
                                style="background-color: grey;width: 2.66rem;height: 2.66rem;border-radius: 2rem;display: flex;align-items: center;justify-content: center;position: relative;">
                                <img v-if="getBattleIsWinner(item.user_info, cccIndex)"
                                    style="position: absolute;top: -64%;width: 100%;" src="/image/win.svg">
                                <img v-if="getBattleUser(item.user_info, cccIndex) != null"
                                    :src="$cdnUrl + getBattleUser(item.user_info, cccIndex).avatar"
                                    style="width: 100%;height: 100%;border-radius: 50%;">
                                <img @click="joinToBattle($event, item.status, item, item.user_info)"
                                    v-if="getBattleUser(item.user_info, cccIndex) == null"
                                    style="cursor: pointer;width: 1.8rem;height: 1.8rem;" src="/image/ba_add.svg">
                            </div>
                        </div>
                    </div>
                    <div class="mm-card-boxs">
                        <div style="padding-right: 0.5rem;justify-content: center;display: flex;gap: 0.5rem;">
                            <div style=" position: relative;display: flex;align-items: center;"
                                v-for="child in item.box_info">
                                <img style="width: 9rem;height: 9rem;" :src="$cdnUrl + child.image" alt="">
                                <div
                                    style="font-family: din;font-size: 1rem;font-weight: bold;color: #060403;display: flex;align-items: center;position: absolute;right: 0;top: 3%;height: 1.4rem;border-radius: 2px;padding: 0 0.4rem;background-color: var(--theme-color);">
                                    x{{ child.box_num }}
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="mm-card-bottom">
                        <div
                            style="display: flex;align-items: center;font-size: 1.1rem;color: var(--theme-color);font-family: din;gap: 0.3rem;">
                            <img src="/image/zs.svg" style="height: 1.3rem;">
                            <span>{{ item.total_amount }}</span>
                        </div>
                        <div v-if="item.status != 3" @click="joinToBattle($event, item.status, item, item.user_info)"
                            :class="{ 'join-btn': true, 'join-line-btn': isShowLineButton(item.status, item.user_info) }">
                            {{ getButtonText(item.status, item.user_info) }}
                        </div>
                        <div else>
                            <div style="color: #999;font-size: 0.9rem;">{{ item.create_time }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <LoadMoreButton ref="loadMoreRef" v-on:load-data="loadMore" />
        <div style="position: fixed;bottom: calc(var(--window-bottomNav-height) + 1rem);right: 1rem;">
            <div @click="showAddBattleDialog()"
                style="width: 4rem;height: 4rem;background: linear-gradient(180deg,white,var(--theme-color));border-radius: 50%;display: flex;align-items: center;justify-content: center;">
                <img style="width: 75%;height: 75%;" src="/image/add.svg">
            </div>
        </div>
    </div>
    <Footer />
    <FloatLayout />
    <BattleHelpDialog v-if="isShowHelp" :close="closeHelpDialog" />
    <BattleBoxDetailDialog v-if="isShowBoxDialog" :id="boxId" :close="closeBoxDialog" />
    <CreateBattleDialog v-if="isShowAddBattle" :close="hideAddBattleDialog" :up-data="getBattleData" />
</template>

<script lang="ts" setup>
const { t } = useI18n()

import { inject, onMounted, onUnmounted, ref, watch } from 'vue';
import BattleBoxDetailDialog from '../components/BattleBoxDetailDialog.vue';
import BattleHelpDialog from '../components/BattleHelpDialog.vue';
import CreateBattleDialog from '../components/CreateBattleDialog.vue';
import FloatLayout from '../components/FloatLayout.vue';
import Footer from '../components/Footer.vue';
import LoadMoreButton from '../components/LoadMoreButton.vue';
import StateLayout from '../components/StateLayout.vue';
import useBattle from '../hooks/useBattle';
import router from '../router';
import { useUserStore } from '../store/user';
import { showLoginDialog, showOpDialog } from '../utils';

const userStore = useUserStore()

const { apiBattleList, battleLoadState, battlEmptyText, apiBattleHistoryList, battleHistoryData, battleListData, apiJoinToBattle, apiBattleBoxList, battleBoxListData } = useBattle()

let page = 1

let size = 0

let tabIndex = ref(0)

const isShowHelp = ref(false)

const isShowBoxDialog = ref(false)

const isShowAddBattle = ref(false)

const emitter = inject("emitter");

const boxId = ref('')

let timeoutId = 0

const loadMoreRef = ref(null)

onMounted(() => {
    //监听登录状态的改变
    apiBattleBoxList(1, 1000)
    getBattleData()
})

function getBattleUser(data, index) {
    for (const key of data) {
        if (key.position == index) {
            return key
        }
    }
    return null
}

function getStatueText(status: number) {
    if (status == 2) {
        return t('battle.inProgress')
    } else if (status == 1) {
        return t('battle.waiting')
    } else if (status == 3) {
        return t('battle.ended')
    }
}

function getBattleIsWinner(data, index) {
    const result = getBattleUser(data, index)
    if (result) {
        if (result.is_winner == 1 || result.is_winner == 3) {
            return true
        }
    }
    return false
}

function isShowLineButton(status: number, users?: []) {
    let isJoin = false;
    let isShowLine = false
    if (users) {
        for (const key of users) {
            if (key.user_id == userStore.userInfo.id) {
                console.log("我退出登录", userStore.userInfo);
                isJoin = true
                break
            }
        }
    }
    if (status == 2 && !isJoin) {
        isShowLine = true
    }
    return isShowLine
}

function getButtonText(status: number, users?: []) {
    let isJoin = false;
    let text = ''
    if (users) {
        for (const key of users) {
            if (key.user_id == userStore.userInfo.id) {
                isJoin = true
                break
            }
        }
    }
    switch (status) {
        case 1:
            if (isJoin) {
                text = t('battle.joined');
            } else {
                text = t('battle.join');
            }
            break;
        case 2:
            if (isJoin) {
                text = t('battle.joined');
            } else {
                text = t('battle.watch');
            }
            break
    }

    return text
}

async function joinToBattle(event, status, data, users, position?: number) {

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
    if (status == 1 && !isJoin) {
        if (localStorage.getItem('agreeJoinBattleKey') == 'true') {
            const result = await apiJoinToBattle(data.battle_id, position)
            if (result) {
                emitter.emit('upUserData')
                goToDetail(data.battle_id)
            }
        } else {
            //提示是否确认加入
            showOpDialog(async () => {
                const result = await apiJoinToBattle(data.battle_id, position)
                if (result) {
                    emitter.emit('upUserData')
                    goToDetail(data.battle_id)
                }
            }, {
                'price': data.total_amount, 'type': 'joinBattle', 'agreeKey': 'agreeJoinBattleKey', 'title': t('battle.joinBattleConfirm')
            })
        }

    } else {
        goToDetail(data.battle_id)
    }


}

async function getBattleData() {
    clearTimeout(timeoutId)
    // const result = await apiBattleList(page, size)
    // if (result) {
    //     //判断是否还有更多加载
    //     if (result.data.data.result.length < 20) {
    //         //没有更多了
    //         loadMoreRef.value.chageStatus(3)
    //     } else {
    //         //还有更多
    //         loadMoreRef.value.chageStatus(2)
    //     }
    //     //开始任务
    //     if (tabIndex.value == 0) {
    //         startTask()
    //     }
    // }
}

function isCanLoadMore() {
    if (tabIndex.value == 0) {
        return (battleListData.length % 20 == 0) && battleListData.length > 0
    } else {
        return (battleHistoryData.length % 20 == 0) && battleHistoryData.length > 0
    }
}

async function loadMore() {
    page++
    if (tabIndex.value == 0) {
        getBattleData()
    } else {
        const result = await apiBattleHistoryList(page, size, tabIndex.value)
        if (result.data.data.result.length < 20) {
            loadMoreRef.value.chageStatus(3)
        } else {
            loadMoreRef.value.chageStatus(1)
        }
    }
}

function startTask() {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
        size = battleListData.length
        getBattleData()
    }, 3000);
}

async function changeTab(index: number) {
    tabIndex.value = index
    battleHistoryData.length = 0
    battleListData.length = 0
    clearTimeout(timeoutId)
    loadMoreRef.value.chageStatus(0)
    page = 1
    if (index == 0) {
        apiBattleBoxList(1, 1000)
        getBattleData()
    } else {
        const result = await apiBattleHistoryList(page, size, index)
        if (result.data.data.result.length < 20) {
            loadMoreRef.value.chageStatus(3)
        } else {
            loadMoreRef.value.chageStatus(1)
        }
    }
}

function showBoxDetail(id: string) {
    boxId.value = id;
    isShowBoxDialog.value = true
}

function showHelp() {
    isShowHelp.value = true
}

function closeHelpDialog() {
    isShowHelp.value = false
}

function closeBoxDialog() {
    isShowBoxDialog.value = false
}

function showAddBattleDialog() {
    if (!userStore.isLogin) {
        showLoginDialog()
        return
    }
    isShowAddBattle.value = true
}

function hideAddBattleDialog() {
    isShowAddBattle.value = false
}

function goToDetail(id: string) {
    router.push({
        name: 'battleDetail',
        params: {
            id: id
        }
    })
}

watch(() => userStore.isLogin, () => {
    if (!userStore.isLogin) {
        //如果退出登录，立马刷新
        getBattleData()
    }
})

onUnmounted(() => {
    clearTimeout(timeoutId)
})

</script>

<style scoped>
.top-layout {
    position: relative;
}

.baseTab {
    padding-left: 1rem;
    height: 2.5rem;
    border-bottom: 1px solid var(--theme-color);
}

.top-right {
    position: absolute;
    right: 0;
    top: 0;
    display: flex;
    height: 100%;
    align-items: center;
}

.top-right .help {
    display: flex;
    cursor: pointer;
    align-items: center;
    user-select: none;
    font-size: 0.75rem;
    margin-right: 1rem;
}

.help-icon {
    width: 1rem;
    height: 1rem;
    margin-right: 0.3rem
}

.top-right-btn {
    height: 93.6%;
    cursor: pointer;
    display: flex;
    align-items: center;
    border-radius: 4px;
    padding: 0 var(--font-size-15);
    margin-right: 1rem;
    color: #CD6200;
    font-size: var(--font-size-20);
    font-weight: bold;
    background: linear-gradient(180deg, white, var(--theme-color));
}

.center-box {
    display: flex;
    width: auto;
    padding: 0 1rem;
    box-sizing: border-box;
    font-size: 0.75rem;
    overflow-x: auto;
}

.center-box-img {
    width: 9.6rem;
    height: 9.6rem;
    display: flex;
    background-size: 100% 100%;
    align-items: center;
    justify-content: center
}

.center-box-item {
    width: 12rem;
    gap: 0.2rem;
    margin-right: 0.1rem;
    flex-shrink: 0;
    padding: 1rem 0;
    display: flex;
    align-items: center;
    flex-direction: column;
    cursor: pointer;
}

.content {
    display: flex;
    position: relative;
    padding: 0 1rem;
    padding-bottom: 1rem;
    flex-direction: column;
    min-height: calc(100vh - var(--window-headerNav-height) - 2.5rem - var(--window-footer-height));
}

.content-item-title {
    background-color: #333333;
    border: 1px solid transparent;
    border-radius: 4px;
    font-weight: bold;
    display: flex;
    font-size: var(--font-size-16);
    color: var(--theme-color);
    padding-right: 1rem;
    margin: 0 1rem;
    margin-top: 0.42rem;
    height: 2.5rem;
    align-items: center;
}

.content-item {
    background-color: #333333;
    border: 1px solid transparent;
    border-radius: 4px;
    display: flex;
    padding: var(--font-size-15) 0;
    padding-right: 1rem;
    margin-top: 0.42rem;
    align-items: center;
    cursor: pointer;
}

.content-item:hover {
    border: 1px solid var(--theme-color);
}

.join-btn {
    width: 4.25rem;
    height: 1.83rem;
    margin-left: var(--font-size-20);
    cursor: pointer;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #CD6200;
    font-size: var(--font-size-18);
    font-weight: bold;
    background: linear-gradient(180deg, white, var(--theme-color));
}

.join-line-btn {
    color: var(--theme-color);
    border: 1px solid var(--theme-color);
    border-radius: 4px;
    background: transparent;
}

@media screen and (max-width:995px) {
    .center-box {
        font-size: 1rem;
    }

    .baseTab {
        height: 3rem;
    }

    .help-icon {
        width: 1.6rem;
        height: 1.6rem;
    }

    .center-box-item {
        width: 10rem;
    }

    .center-box-img {
        width: 9rem;
        height: 9rem;
    }

    .mm-card {
        background-color: #333333;
        border-radius: 8px;
        padding: 0.75rem;
        cursor: pointer;
        margin-bottom: 1rem;
    }

    .mm-card-top {
        display: flex;
        justify-content: space-between;
    }

    .mm-card-top-left {
        display: flex;
        align-items: center;
        gap: 0.3rem;
    }

    .mm-card-top-right {
        display: flex;
        align-items: center;
        gap: 0.6rem;
    }

    .mm-card-boxs {
        width: auto;
        height: 10rem;
        display: flex;
        box-sizing: border-box;
        overflow-x: auto;
    }

    .mm-card-bottom {
        display: flex;
        height: 2.4rem;
        align-items: center;
        justify-content: space-between;
    }

    .join-btn {
        height: 100%;
        width: 8rem;
        font-size: 1rem;
    }

    .join-line-btn {
        height: 100%;
        width: 8rem;
        font-size: 1rem;
    }


}
</style>