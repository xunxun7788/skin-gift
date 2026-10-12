<template>
    <div class="right">
        <div class="right-content">
            <div class="top-layout font-16 font-9AA1AD bold">
                <SuperDropButton v-on:check="changeSort" :data="sortData" v-on:change="changeSort" />
                <SuperDropButton :data="{
                    'text': 'balance.ascending',
                    'sub': [
                        { 't': 'balance.ascending', 'i': false },
                        { 't': 'balance.descending', 'i': true }
                    ]
                }" v-on:change="changeSortBy" />
            </div>
            <div class="content">
                <div class="_windows" style="display: flex;flex-grow: 1;flex-direction: column;">
                    <div class="table-box font-16">
                        <div class="table-top-cell">
                            {{ $t('balance.transactionType') }}
                        </div>
                        <div style="flex-grow: 2;" class="table-top-cell">
                            {{ $t('balance.changeAmount') }}
                        </div>
                        <div style="flex-grow: 2;" class="table-top-cell">
                            {{ $t('balance.balanceAfter') }}
                        </div>
                        <div class="table-top-cell">
                            {{ $t('common.time') }}
                        </div>
                    </div>
                    <div class="table-box-content font-16">
                        <div v-for="(item, index) in balanceLogList" :key="index" class="table-cell">
                            <div class="table-top-cell">
                                {{ item.from_text }}
                            </div>
                            <div style="width: 0;flex-grow: 2;" class="table-top-cell">
                                <div
                                    style="width: 0;flex-grow: 1;display: flex;justify-content: start;align-items: center;">
                                    <span>{{
                                        item.change_amount_text }}</span>
                                </div>
                            </div>
                            <div style="flex-grow: 2;" class="table-top-cell">
                                <div
                                    style="width: 0;flex-grow: 1;display: flex;justify-content: start;align-items: center;">
                                    <span>{{ priceUnit() }}{{
                                        item.amount_text }}</span>
                                </div>
                            </div>
                            <div class="table-top-cell">
                                {{ item.create_time }}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="_mobile"
                    style="overflow-y: auto;padding-top: 0.5rem;display: flex;gap: 0.5rem;flex-direction: column;padding: 0.5rem 0;">
                    <div v-for="item in balanceLogList"
                        style="background-color: #333;border-radius: 4px;display: flex;flex-direction: column;padding: 0.8rem;">
                        <div
                            style="display: flex;color: #999;justify-content: space-between;font-size: 1rem;align-items: center;">
                            <div style="font-weight: bold;">{{ item.from_text }}</div>
                            <div style="font-size: 0.8rem;">{{ item.create_time }}</div>
                        </div>
                        <div style="margin-top: 0.6rem;display: flex;color: #999;">
                            <div
                                style="flex-grow: 1;display: flex;font-size: 0.9rem;flex-direction: column;gap: 0.5rem;">
                                {{ $t('balance.changeAmount') }}
                                <div style="display: flex;">
                                    <div style="flex-grow: 1;width: 0;display: flex;align-items: center;gap: 0.2rem;">
                                        <img style="width: 1rem;height: 1rem;" src="/image/zs.svg">
                                        {{ item.change_amount_text }}
                                    </div>
                                </div>
                            </div>
                            <div style="width: 1px;margin-right: 1rem;margin-left: 1rem;background-color: #4F4F4F;">
                            </div>
                            <div
                                style="flex-grow: 1;display: flex;font-size: 0.9rem;flex-direction: column;gap: 0.5rem;">
                                {{ $t('balance.balanceAfter') }}
                                <div style="display: flex;">
                                    <div style="flex-grow: 1;width: 0;display: flex;align-items: center;gap: 0.2rem;">
                                        <img style="width: 1rem;height: 1rem;" src="/image/zs.svg">
                                        {{ item.amount_text }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <el-pagination class="page-number" @current-change="changePage" background layout="prev, pager,next"
                :page-size="20" :total="balanceLogTotal" />
        </div>
        <StateLayout :load-state="balanceLoadState" :empty-text="balanceEmptyText" />
    </div>
</template>

<script lang="ts" setup>

import { onMounted, reactive, ref } from 'vue';

import SuperDropButton from '../components/common/SuperDropButton.vue';
import useMine from '../hooks/useMine';
import { priceUnit } from '../utils/index.ts';

const { apiTypeConfig, balanceLoadState, balanceEmptyText, typeConfigData, apiBalanceLog, balanceLogList, balanceLogTotal } = useMine()

let currentSortValue = {}

const sortBy = ref(false)

const sortData = reactive({
    'text': 'common.all',
    'sub': <any>[

    ]
})

let page = 1

onMounted(() => {
    getData()
})

async function changeSort() {
    if (sortData.sub.length > 0) {
        return true
    }
    //先获取 类型基础数据再弹出
    const result = await apiTypeConfig()
    if (result) {
        const temp = []
        for (const key in typeConfigData) {
            const value = typeConfigData[key]
            temp.push(
                { 't': value, 'i': key }
            )
        }
        sortData.sub.length = 0
        sortData.sub.push(...temp)
        return true
    }
}

function changeSortBy(value: any) {
    sortBy.value = value.i
    getData()
}

function onSelect(key: string) {
    currentSortName.value = key
    currentSortValue = sortValurArr.get(key)
    getData()
}

function changePage(index: number) {
    page = index
    getData()
}

function getData() {
    apiBalanceLog(page, currentSortValue, sortBy.value ? "asc" : "desc")
}

</script>

<style scoped>
.right {
    position: relative;
    flex-grow: 1;
    width: calc(100% - 2rem);
    margin: 0 1rem;
    margin-top: 1rem;
    margin-bottom: .5rem;
    border-radius: .66rem;
    box-shadow: inset 0 0 0 1px #333A47FF;
    background-color: #171A21FF;
}

.right-content {
    top: 0;
    position: absolute;
    left: 0;
    bottom: 0;
    right: 0;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    padding: 1rem;
    padding-top: 0.2rem;
}

.top-layout {
    display: flex;
    align-items: center;
    margin-top: 1rem;
    gap: .5rem;
}


.sort-btn {
    display: flex;
    cursor: pointer;
    user-select: none;
    padding: 0 0.625rem;
    gap: .5rem;
    align-items: center;
    height: 1.5rem;
    border-radius: 1rem;
    box-shadow: inset 0 0 0 1px #333A47FF;
    position: relative;
}


.content {
    flex-grow: 1;
    height: 0;
    display: flex;
    flex-direction: column;
    width: 100%;
}

.table-box {
    background-color: #1F232CFF;
    border-radius: .33rem;
    padding: 0 1rem;
    box-sizing: border-box;
    margin-top: 1rem;
    height: 2rem;
    color: #6B7280FF;
    font-weight: bold;
    display: flex;
    align-items: center;
}

.table-box-content {
    overflow: hidden;
    overflow-y: auto;
    flex-grow: 1;
    height: 0;
    color: #9AA1ADFF;
    padding: 0 1rem;
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
    height: 1.8rem;
    display: flex;
}

.page-number {
    display: flex;
    margin-top: 1rem;
    justify-content: center;
    --el-color-primary: var(--theme-color);
    --el-color-white: #060403;
}

@media screen and (max-width:995px) {
    .top-layout {
        height: 3rem;
        margin-top: 0;
    }

    .sort-btn {
        height: 2rem;
        font-size: 1rem;
    }

}
</style>