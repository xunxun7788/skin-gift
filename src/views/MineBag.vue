<template>
    <div class="right">
        <SuperTab class="tab-layout" :tab-arr="tabArr" v-on:change="changeTab"></SuperTab>
        <div class="bag-body">
            <div class="top-layout">
                <div v-show="tabIndex == 0" class="top-left">
                    <div class="selectall-box">
                        <div @click="selectAll" class="selectAll btn">
                            <img class="selectAll-icon" :src="`/image/cb_${isSelectAll ? 'on' : 'off'}.svg`">
                            <span>{{ $t('bag.selectAll') }}</span>
                        </div>
                        <div class="top-value bold _mobile">
                            <span>{{ $t('bag.total') }}</span>
                            <span class="font-EDEFF3 din">
                                {{ priceUnit() }} {{ formatCoin(total_amount) }}
                            </span>
                        </div>
                    </div>

                    <div class="select-right">
                        <div class="top-value bold _windows">
                            <span>{{ $t('bag.total') }}</span>
                            <span class="font-EDEFF3 din">
                                {{ priceUnit() }} {{ formatCoin(total_amount) }}
                            </span>
                        </div>
                        <div class="center-actions font-16 bold">
                            <div @click="submitOpGoods" class="center-actions-btn btn"
                                :class="{ 'opacity-50': selectBagGoodsIds.length == 0 }">
                                {{
                                    $t('bag.resolve') }}</div>
                            <div @click="submitOpGetGoods" class="center-actions-btn btn"
                                :class="{ 'opacity-50': selectBagGoodsIds.length == 0 }">{{ $t('bag.extract') }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="content">
                <div v-show="tabIndex == 0" class="boxGrid">
                    <div v-for="(item, index) in bagDataList" class="gridItem" :key="index"
                        :style="{ background: getGoodsBgColor(item.color) }">
                        <LogosIcon class="logos" :color="getGoodsBottomColor(item.color)" />
                        <img class="gun" :src="getImageUrl(item.image)">
                        <div class="text">
                            <div class="name">{{ item.name }}</div>
                            <div class="price">
                                {{ priceUnit() }} {{ formatCoin(item.goods_price) }}
                            </div>
                        </div>
                        <div class="bottom-box" :style="{ backgroundColor: getGoodsBottomColor(item.color) }"></div>
                        <img @click="addOrRemoveBagId(item.id)" class="goods-select btn"
                            :src="`/image/cb_${selectBagGoodsIds.some(sub => sub === item.id) ? 'on' : 'off'}.svg`">
                    </div>
                </div>
                <div v-show="tabIndex == 1 || tabIndex == 2">
                    <div class="take-boxList">
                        <div class="take-title font-16 _windows">
                            <div style="flex-grow: 1;">{{ $t('bag.goodsName') }}</div>
                            <div style="width: 4.16rem;">
                                {{ $t('bag.price') }}
                            </div>
                            <div class="take-title-time">{{ $t('bag.time') }}</div>
                        </div>
                        <div v-for="item in bagDataList" class="take-title take-item _windows font-16">
                            <div style="flex-grow: 1;width: 0;display: flex;align-items: center;">
                                <img class="goods-img" :src="getImageUrl(item.image)">
                                <span class="text-single-line">{{ item.name }}</span>
                            </div>
                            <div style="width: 4.16rem;" class="font-FFBF00 bold din">
                                {{ priceUnit() }}{{ formatCoin(item.recovery_price) }}
                            </div>
                            <div class="take-title-time font-9AA1ADF">{{ item.create_time }}</div>
                        </div>
                        <BagTakeCell v-for="value in bagDataList" :data="value" class="_mobile"></BagTakeCell>
                    </div>
                </div>
                <MineGoods v-if="tabIndex == 3"></MineGoods>
                <StateLayout v-if="tabIndex != 3" :load-state="bagLoadState" :empty-text="bagEmptyText" />
            </div>
            <el-pagination v-if="tabIndex != 3" class="page-number" @current-change="changePage" background
                layout="prev, pager,next" :page-size="20" :total="bagGoodsTotal" />

        </div>

    </div>
</template>

<script lang="ts" setup>
import { computed, inject, onMounted, reactive, ref } from 'vue';
import BagTakeCell from '../components/bag/BagTakeCell.vue';
import SuperTab from '../components/common/SuperTab.vue';
import useMine from '../hooks/useMine';
import { formatCoin, getGoodsBgColor, getGoodsBottomColor, getImageUrl, priceUnit, showToast } from '../utils';
import { showSuperOpDialog } from '../utils/dialogs.ts';
import MineGoods from './MineGoods.vue';

const { apiBagDataList, apiBagTakeLog, bagEmptyText, bagLoadState, apiGetGoods, apiResolveGoods, bagDataList, bagGoodsTotal, total_amount } = useMine()

let selectBagGoodsIds = reactive([])

const tabArr = reactive([
    {
        't': 'bag.myGoods',
        'i': 0,
    },
    {
        't': 'bag.extracting',
        'i': 1,
    },
    {
        't': 'bag.extracted',
        'i': 2,
    },
    {
        't': 'goods.goodsRecord',
        'i': 3,
    }
])

const emitter = inject("emitter");


let page = 1

const tabIndex = ref(0)

onMounted(() => {
    getData()
})

function changeTab(index: number) {
    tabIndex.value = index
    bagDataList.length = 0
    getData()
}

function selectAll() {
    if (isSelectAll.value) {
        for (let item of bagDataList) {
            const index = selectBagGoodsIds.indexOf(item.id)
            if (index >= 0) {
                selectBagGoodsIds.splice(index, 1)
            }
        }
    } else {
        for (let item of bagDataList) {
            if (!selectBagGoodsIds.includes(item.id)) {
                selectBagGoodsIds.push(item.id)
            }
        }
    }

}

function addOrRemoveBagId(id: string) {
    if (selectBagGoodsIds.includes(id)) {
        const index = selectBagGoodsIds.indexOf(id)
        selectBagGoodsIds.splice(index, 1)
    } else {
        selectBagGoodsIds.push(id)
    }
}

let isSelectAll = computed(() => {
    //计算出当前页 是否全部包含在选择列表里
    const isIncluded = bagDataList.every(item => selectBagGoodsIds.some(subItem => subItem === item.id));
    if (selectBagGoodsIds.length == 0) {
        return false
    }
    return isIncluded
})

function submitOpGoods() {
    if (selectBagGoodsIds.length <= 0) {
        showToast({
            'msg': 'bag.pleaseSelectGoods'
        })
        return
    }
    showSuperOpDialog({
        text: 'bag.confirmResolveGoods',
        onConfirm: async () => {
            let ids = ""
            selectBagGoodsIds.forEach(element => {
                ids += element
                ids += ','
            });
            ids = ids.substring(0, ids.length - 1)
            const result = await apiResolveGoods(ids)
            if (result) {
                emitter.emit('upUserData')
                selectBagGoodsIds.length = 0
                getData()
            }
        }
    })
}

function submitOpGetGoods() {
    if (selectBagGoodsIds.length <= 0) {
        showToast({
            'msg': 'bag.pleaseSelectGoods'
        })
        return
    }
    showSuperOpDialog({
        text: 'bag.confirmExtractGoods',
        onConfirm: async () => {
            let ids = ""
            selectBagGoodsIds.forEach(element => {
                ids += element
                ids += ','
            });
            ids = ids.substring(0, ids.length - 1)
            const result = await apiGetGoods(ids)
            if (result) {
                selectBagGoodsIds.length = 0
                getData()
            }
        }
    })
}

function changePage(index: number) {
    page = index
    getData()
}

function getData() {
    if (tabIndex.value == 0) {
        apiBagDataList(page)
    } else if (tabIndex.value == 1) {
        apiBagTakeLog(0, page)
    } else if (tabIndex.value == 2) {
        apiBagTakeLog(3, page)
    }
}

</script>

<style scoped>
.right {
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

.bag-body {
    display: flex;
    flex-direction: column;
    width: calc(100% - 2rem);
    padding: .5rem 0;
    margin: .5rem 1rem;
    box-sizing: border-box;
    background-color: #171A21FF;
    border-radius: .66rem;
    box-shadow: inset 0 0 0 1px #333A47FF;
    flex: 1;
}

.tab-layout {
    position: relative;
    margin: 0 1rem;
    top: 0;
    margin-top: .5rem;
    width: calc(100% - 2rem);
}

.top-layout {
    display: flex;
    width: 100%;
    color: #9AA1ADFF;
    padding: 0 1rem;
    box-sizing: border-box;
    flex-direction: column;
}

.select-right {
    gap: .5rem;
    display: flex;
    flex-direction: column;
    justify-content: end;
}

.top-value {
    align-items: center;
    display: flex;
    justify-content: end;
}


.top-left {
    white-space: nowrap;
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
}


.center-actions {
    display: flex;
    align-items: center;
    gap: .66rem;
    width: 100%;
}

.selectAll {
    display: flex;
    align-items: center;
    gap: .33rem;
}

.selectall-box {
    display: flex;
    align-items: center;
}

.selectAll-icon {
    width: 0.8rem;
    height: 0.8rem;
}

.center-actions-btn {
    height: 1.33rem;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    padding: 0 .66rem;
    justify-content: center;
    background-color: #FFBF00FF;
    color: #1A1206FF;
}

.content {
    flex-grow: 1;
    height: 0;
    margin-top: .5rem;
    overflow: hidden;
    position: relative;
    overflow-y: auto;
    width: 100%;
}


.boxGrid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    box-sizing: border-box;
    gap: 1rem;
    width: 100%;
    padding: 1rem;
    row-gap: 1rem;
}

.take-title {
    display: flex;
    background-color: #1F232CFF;
    border-radius: .33rem;
    height: 2rem;
    margin: 0.5rem 1rem;
    padding: 0 1rem;
    color: #6B7280FF;
    align-items: center;
}

.take-title-time {
    width: 6.25rem;
}

.take-item {
    border-radius: 0;
    height: 3.33rem;
    background-color: transparent;
    border-bottom: 1px solid #333A47FF;
    display: flex;
    align-items: center;
    color: #EDEFF3FF;
}

.goods-img {
    width: 4rem;
    height: 2.8rem;
    margin-right: 0.3rem;
}

.take-boxList {
    display: flex;
    flex-direction: column;
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
    padding: 8% 0;
    box-sizing: border-box;
    object-fit: contain;
    transition: all 0.4s ease;
}

.boxGrid .gridItem:hover .gun {
    transform: scale(1.2);
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

.goods-select {
    position: absolute;
    top: .5rem;
    right: .5rem;
    z-index: 1;
}

.page-number {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
    --el-color-primary: var(--theme-color);
    --el-color-white: #060403;
}

.goods-tips {
    display: flex;
    justify-content: center;
    flex-direction: column;
    position: absolute;
    top: 0;
    gap: 0.1rem;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #00000066;
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
    }



    .selectall-box {
        width: 100%;
        justify-content: space-between;
        margin-bottom: 10px;
    }

    .bag-body {
        background-color: transparent;
        box-shadow: none;
        margin: 0;
        padding: 12px 0;
        width: 100%;
        padding-bottom: 70px;
    }


    .center-actions-btn {
        height: 32px;
        font-size: 16px;
    }

    .center-actions {
        font-size: 0.9rem;
    }

    .selectAll {
        flex-direction: row-reverse;
        gap: 10px;
        font-size: 16px;
    }


    .selectAll-icon {
        width: 18px;
        height: 18px;
    }

    .top-left {
        flex-direction: column;
        align-items: start;
        justify-content: space-between;
        height: auto;
    }

    .top-value {
        font-size: 16px;
    }

    .boxGrid .gridItem .text {
        font-size: 1rem;
    }

    .boxGrid .gridItem .text .name {
        font-size: 0.9rem;
    }

    .take-title {
        height: 3rem;
        font-size: 0.9rem;
    }

    .take-title-time {
        width: 10rem;
    }

    .take-item {
        height: 4rem;
    }

    .goods-img {
        width: 5rem;
        height: 3.2rem;
        margin-right: 0.3rem;
    }

    .tab-layout {
        padding: 0;
        border-radius: 0;
    }

}

@media screen and (min-width:1701px) {
    .boxGrid {
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    }
}
</style>