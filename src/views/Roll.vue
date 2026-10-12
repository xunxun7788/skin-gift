<template>
    <div class="roll">
        <div class="roll-parent">
            <div class="tab-box">
                <SuperTab :tab-arr="tabArr" v-on:change="changeTab">
                    <div class="top-right">
                        <div @click="showRollHelpDialog" class="help">
                            <img class="size-1rem" src="/image/help.svg" />
                        </div>
                    </div>
                </SuperTab>
            </div>
            <div class="roll-body">
                <div class="width-82 base-row gap-1rem">
                    <SuperDropButton v-if="baseTabIndex != 1" :data="sortOneData" v-on:change="onChangeStatusSort" />
                    <SuperDropButton :data="sortTwoData" v-on:change="onChangeTypeSort" />
                </div>
                <div class="content">
                    <div class="content-list">
                        <div v-for="(item, index) in rollListData" :key="index" @click="goToDetail(item.id)"
                            class="card">
                            <div class="card-top">
                                <img class="avatar" :src="getImageUrl(item.image)">
                                <div class="nickname">
                                    <span class="font-18 bold font-EDEFF3">{{ item.roll_name }}</span>
                                    <div class="type-box font-14" :class="{ 'type-box-2': item.roll_type == 2 }">
                                        <img class="type-icon"
                                            :src="`/image/${item.roll_type == 1 ? 'official' : 'streamer'}.svg`">
                                        <span>{{ $t(item.roll_type == 1 ? 'roll.Official' : 'roll.Streamer') }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="card-value font-15">
                                <div class="value-1">
                                    <span class="bold din font-EDEFF3">{{ item.total_value }}</span>
                                    <span class="font-12 font-9AA1AD">
                                        {{ $t('roll.totalValue') }}
                                    </span>
                                </div>
                                <div style="width: 1px;height: inherit;background-color: #99999944;"></div>
                                <div class="value-1">
                                    <span class="bold din font-EDEFF3">{{ item.goods_num }}</span>
                                    <span class="font-12 font-9AA1AD">
                                        {{ $t('roll.goodsCount') }}
                                    </span>
                                </div>
                                <div style="width: 1px;height: inherit;background-color: #99999944;"></div>
                                <div class="value-1">
                                    <span class="bold din font-EDEFF3">{{ item.users_num }}</span>
                                    <span class="font-12 font-9AA1AD">
                                        {{ $t('roll.participantCount') }}
                                    </span>
                                </div>
                            </div>
                            <div class="goods_layout">
                                <div v-for="(goods, index) in item.goods" :key="index" v-show="index <= 2"
                                    class="goods_item" :style="{ background: getGoodsBgColor(item.color) }">
                                    <logos-icon class="logos" :color="getGoodsBottomColor(item.color)" />
                                    <img class="gun" :src="getImageUrl(goods.image)">
                                    <div class="bottom" :style="{ backgroundColor: getGoodsBottomColor(item.color) }">
                                    </div>
                                </div>
                            </div>
                            <RollTimeDown v-if="item.end_status != 3" :time="item.lottery_time"
                                class="margin-top-1rem" />
                            <div v-else class="end-box">
                                <div class="end-btn btn">
                                    {{ $t('roll.ended') }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <StateLayout :load-state="rollListLoadState" />
                </div>
                <el-pagination class="page-number" @current-change="changePage" background layout="prev, pager,next"
                    :page-size="20" :total="rollTotal" />
            </div>
        </div>

    </div>
</template>

<script lang="ts" setup name="Roll">
import { onMounted, reactive, ref, watch } from "vue";
import { useRouter } from 'vue-router';
import SuperDropButton from "../components/common/SuperDropButton.vue";
import SuperTab from "../components/common/SuperTab.vue";
import RollTimeDown from "../components/roll/RollTimeDown.vue";
import StateLayout from "../components/StateLayout.vue";
import useRoll from "../hooks/useRoll";
import { showRollHelpDialog } from "../utils/dialogs.ts";
import { getGoodsBgColor, getGoodsBottomColor, getImageUrl } from "../utils/index.ts";
const router = useRouter()
const { rollListData, rollListLoadState, rollTotal, apiRollList } = useRoll()

let tabIndex = ref(0)

let baseTabIndex = 0

let page = 1

const tabArr = reactive([
    {
        't': 'battle.active',
        'i': 0,
        'count': 0
    },
    {
        't': 'roll.ended',
        'i': 1,
    }, {
        't': 'battle.MyEntries',
        'i': 2,
    }
])

var sortOneData = {
    'text': 'common.All',
    'sub':
        [
            {
                't': 'common.All',
                'v': 4
            },
            {
                't': 'common.Ongoing',
                'v': 2
            },
            {
                't': 'common.Upcoming',
                'v': 1
            }
        ]
}

let type = ''

let status = '4'

var sortTwoData = {
    'text': 'common.All',
    'sub':
        [
            {
                't': 'common.All',
                'v': ''
            },
            {
                't': 'common.Official',
                'v': 1
            },
            {
                't': 'common.Streamer',
                'v': 2
            }
        ]
}

watch(rollTotal, () => {
    tabArr[0].count = rollTotal.value
})

function changeTab(index: number) {
    baseTabIndex = index
    tabIndex.value = 0
    getRollListData()
}

function onChangeStatusSort(value: any) {
    status = value.v;
    getRollListData()
}

function onChangeTypeSort(value: any) {
    type = value.v;
    getRollListData()
}

onMounted(() => {
    getRollListData()
})

function getRollListData() {
    const s = baseTabIndex == 1 ? '3' : status
    apiRollList(baseTabIndex, (baseTabIndex == 0 || baseTabIndex == 1) ? 'roll/list' : 'roll/joinedList', s, type, page, 20)
}

function changePage(index: number) {
    page = index
    getRollListData()
}

function goToDetail(id: string) {
    router.push({
        name: 'rollDetail',
        params: {
            id: id
        }
    })
}
</script>

<style scoped>
.roll {
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

.roll-parent {
    position: relative;
    width: calc(100% - 2rem);
    height: 100%;
    box-sizing: border-box;
    overflow-y: auto;
    padding-bottom: 1rem;
    display: flex;
    flex-direction: column;
}

.tab-box {
    margin-top: .5rem;
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
    user-select: none;
    width: 1.3rem;
    height: 1.3rem;
    margin-right: 1rem;
}

.center-tab {
    display: flex;
}



.center-tab .text {
    height: 1.9583rem;
    background-color: transparent;
    border-radius: 4px;
    border: 1px solid white;
    display: flex;
    align-items: center;
    padding: 0 0.4rem;
    font-size: 0.75rem;
    cursor: pointer;
    font-weight: bold;
    user-select: none;
    margin: 0 1rem 0 0;
}

.center-tab .active {
    color: var(--theme-color);
    border: 1px solid var(--theme-color);
    background-color: var(--theme-color-30);
}

.roll-body {
    display: flex;
    flex-direction: column;
    flex: 1;
    height: 0;
    margin-top: .5rem;
    gap: .5rem;
    padding: .5rem;
    overflow-y: auto;
    box-sizing: border-box;
    background-color: #171A21FF;
    border-radius: .66rem;
    box-shadow: inset 0 0 0 1px #333A47FF;
}

.content {
    position: relative;
    flex: 1;
    width: 100%;
    height: 0;
}

.content-list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
    gap: 0.83rem;
    overflow-y: auto;
    position: relative;
}


.card {
    font-size: 0.75rem;
    min-width: 0;
    padding: 0.625rem;
    position: relative;
    border-radius: .5rem;
    overflow: hidden;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    user-select: none;
    box-shadow: inset 0 0 0 1px #262B35FF;
    background-color: #1F232CFF;
}



/* 左右无限运动动画 */
@keyframes moveLeftRight {
    0% {
        transform: translateX(0);
    }

    50% {
        transform: translateX(-20%);
    }

    100% {
        transform: translateX(0);
    }
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


.nickname {
    width: 100%;
    display: flex;
    flex-direction: column;
    white-space: nowrap;
    overflow: hidden;
    gap: .2rem;
    text-overflow: ellipsis;
}


.card-top {
    display: flex;
    gap: .5rem;
    align-items: center;
}

.avatar {
    width: 2.5rem;
    height: 2.5rem;
    background-color: #060403FF;
    border-radius: 2rem;
    object-fit: cover;
}


.card-value {
    display: flex;
    margin: 1rem 0;
    justify-content: space-evenly;
    color: #999;
}

.value-1 {
    display: flex;
    position: relative;
    gap: 4px;
    flex-direction: column;
    align-items: center;
}

.value-icon {
    width: 1rem;
    height: 1rem;
    margin: 0.3rem;
}

.goods_layout {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: .4rem;
}

.goods_item {
    position: relative;
    aspect-ratio: 129 / 103;
    border-radius: .25rem;
}

.goods_item .bg {
    width: 100%;
    height: auto;
    vertical-align: bottom;
}

.goods_item .logos {
    position: absolute;
    transform: translateY(-50%) translateX(-50%);
    transform-origin: center center;
    top: 50%;
    left: 50%;
    opacity: .2;
    width: 3.5rem;
    height: 2.4rem;
}

.goods_item .gun {
    position: absolute;
    left: 50%;
    top: 50%;
    height: 90%;
    width: 80%;
    object-fit: contain;
    transform: translateX(-50%) translateY(-50%);
}

.goods_item .bottom {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    border-top-left-radius: .2rem;
    border-top-right-radius: .2rem;
    width: 57%;
    height: .167rem;
}

.page-number {
    display: flex;
    justify-content: center;
    padding-left: 1.5rem;
    margin: 0;
    --el-color-primary: var(--theme-color);
    --el-color-white: #060403;
}


.end-box {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
}

.end-btn {
    height: 2rem;
    color: #6B7280FF;
    width: 100%;
    display: flex;
    margin-top: 1rem;
    align-items: center;
    justify-content: center;
    box-shadow: inset 0 0 0 1px #333A47FF;
    border-radius: 1rem;
    font-weight: bold;
}

@media screen and (max-width:995px) {

    .roll-parent {
        width: 100%;
        background-color: #0E1014FF;
    }


    .content-list {
        grid-template-columns: 1fr;
    }

    .roll-body {
        margin-top: 16px;
        margin-bottom: 70px;
        background-color: transparent;
        box-shadow: none;
        overflow-y: hidden;
    }

    .top-layout {
        height: 3rem;
    }

    .roll {
        padding: 0;
        padding-bottom: 1rem;
    }

    .top-right .help {
        height: 1.6rem;
        width: 1.6rem;
    }

    .center-tab .text {
        font-size: 1.08rem;
        height: 2.5rem;
        padding: 0 0.8rem;
    }

    .nickname {
        font-size: 1.08rem;
    }

    .avatar {
        width: 3rem;
        height: 3rem;
        background-color: grey;
        border-radius: 2rem;
        object-fit: cover;
    }

    .type-icon {
        height: 1.08rem;
    }

    .date {
        font-size: 1rem;
    }

    .value-1 {
        font-size: 0.8rem;
    }

    .value-icon {
        width: 1.3rem;
        height: 1.3rem;
        margin: 0.3rem;
    }

    .tab-box {
        margin: 0;
        margin-top: 0;
    }

    .top-right .help {
        width: 24px;
        height: 24px;
    }

    .type-box {
        height: 29px;
        padding-left: 8px;
        padding-right: 12px;
        border-radius: 20px;
        font-size: 14px !important;
    }

    .type-icon {
        width: 18px;
        height: 18px;
    }


}
</style>
