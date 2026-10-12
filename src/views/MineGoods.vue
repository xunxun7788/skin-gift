<template>
    <div class="bag-log-layout">
        <div class="right-content">
            <div class="content font-16">
                <div class="_windows" style="display: flex;flex-grow: 1;flex-direction: column;">
                    <div class="top-table">
                        <div style="flex-grow: 5;" class="table-top-cell">
                            {{ $t('goods.goodsName') }}
                        </div>
                        <div class="table-top-cell">
                            {{ $t('goods.source') }}
                        </div>
                        <div class="table-top-cell">
                            {{ $t('goods.status') }}
                        </div>
                        <div style="flex-grow: 2;" class="table-top-cell">
                            {{ $t('common.time') }}
                        </div>
                    </div>
                    <div style="overflow: hidden;overflow-y: auto;flex-grow: 1;height: 0;padding: 0 1rem;">
                        <div v-for="(item, index) in goodsLogData" :key="index" class="table-cell font-16">
                            <div style="flex-grow: 5;gap: 0.3rem;display: flex;" class="table-top-cell">
                                <img style="height: 2rem;" :src="getImageUrl(item.goods_image)"></img>
                                <span style="flex-grow: 1;width: 0;overflow: hidden;text-overflow: ellipsis;"
                                    class="font-EDEFF3">{{
                                        item.goods_name
                                    }}</span>
                            </div>
                            <div class="table-top-cell">
                                {{ item.from_text }}
                            </div>
                            <div class="table-top-cell">
                                {{ item.status_text }}
                            </div>
                            <div style="flex-grow: 2;" class="table-top-cell">
                                {{ item.create_time }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="_mobile"
                    style="overflow-y: auto;display: flex;gap: 12px;width: 100%;;flex-direction: column;">
                    <div v-for="item in goodsLogData"
                        style="background-color: #1F232CFF;border-radius: 8px;display: flex;gap: 4px;padding: 16px;align-items: center;">
                        <img style="width: 80px;height: 60px;" :src="getImageUrl(item.goods_image)">
                        <div
                            style="flex-grow: 1;color: #EDEFF3FF;gap: 6px;width: 0;;display: flex;flex-direction: column;font-size: 14px;">
                            <span style="width: 100%;font-weight: bold;" class="text-single-line">{{ item.goods_name
                                }}</span>
                            <div style="display: flex;justify-content: space-between;">
                                <div style="display: flex;color: #9AA1ADFF;">
                                    <span> {{ item.from_text }}</span>
                                    <div style="width: 1px;background-color: #4F4F4F;margin: 0 12px;"></div>
                                    <span>{{ item.status_text }}</span>
                                </div>
                                <span class="font-6B7280 font-12">
                                    {{ item.create_time }}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <el-pagination class="page-number" @current-change="changePage" background layout="prev, pager,next"
                :page-size="20" :total="goodsLogTotal" />
        </div>
        <StateLayout :load-state="goodsLoadState" :empty-text="goodsEmptyText" />
    </div>
</template>

<script lang="ts" setup>
const { t } = useI18n()
import { onMounted, ref } from 'vue';
import useMine from '../hooks/useMine';
import { getImageUrl } from '../utils';

const { apiMineGoodsLog, goodsLoadState, goodsEmptyText, goodsLogData, goodsLogTotal } = useMine()

const sortBy = ref(false)

let page = 1


onMounted(() => {
    getData()
})

function changeSortBy() {
    sortBy.value = !sortBy.value
    getData()
}

function changePage(index: number) {
    page = index
    getData()
}

function getData() {
    apiMineGoodsLog(page, sortBy.value ? "asc" : "desc")
}


</script>

<style scoped>
.bag-log-layout {
    width: 100%;
    height: 100%;
}

.right-content {
    top: 0;
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    overflow-y: auto;
    display: flex;
    padding: 0 1rem;
    flex-direction: column;
}

.content {
    flex-grow: 1;
    height: 0;
    display: flex;
    flex-direction: column;
    width: 100%;
}

.top-table {
    height: 1.8rem;
    padding: 0 1rem;
    display: flex;
    background-color: #1F232CFF;
    margin-top: .5rem;
    color: #6B7280FF;
    border-radius: .33rem;
}

.table-top-cell {
    flex-grow: 1;
    display: flex;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 0;
    align-items: center;
    display: flex;
    justify-content: start;
}

.table-cell {
    flex-grow: 1;
    height: 3.33rem;
    color: #9AA1ADFF;
    border-bottom: 1px solid #333;
    display: flex;
}

.page-number {
    display: flex;
    margin-top: 1rem;
    justify-content: center;
    --el-color-primary: var(--theme-color);
    --el-color-white: #060403;
}
</style>