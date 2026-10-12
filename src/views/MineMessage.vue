<template>
    <div class="right">
        <div class="right-content">
            <div class="top-layout">
                <div class="top-left">
                    <img @click="selectAll" style="width: var(--font-size-18);height: var(--font-size-18);"
                        :src="`/image/r_cb${isSelectAll ? '1' : ''}.svg`">
                    <span style="margin-left: 4px;">{{ $t('common.selectAll') }}</span>
                    <span style="margin-left: 1.67rem;">{{ $t('message.siteMessageTotal') }}</span>
                    <span style="font-family: din;font-size: var(--font-size-20);">{{ msgTotal }}</span>
                </div>
                <div @click="delMessage" class="del-btn">
                    {{ $t('common.delete') }}</div>
            </div>
            <div class="content">
                <div v-for="(item, index) in msgDataList" :key="index" class="item">
                    <div @click="clickItem(index, item)" class="item-card">
                        <img @click="addOrRemoveBagId($event, item.id)" class="item-icon"
                            :src="`/image/r_cb${selectMsgIds.some(sub => sub === item.id) ? '1' : ''}.svg`">
                        <div v-show="item.is_read == 0"
                            style="margin-left:0.4rem;width: 0.3rem;height: 0.3rem;border-radius: 50%;background-color: #ffbf00bb;">
                        </div>
                        <span :style="`color: ${item.is_read == 0 ? 'var(--color-d6)' : '#999'};`" class="item-text">{{
                            item.text }}</span>
                        <span class="item-time">{{ item.show_time
                        }}</span>
                        <img :style="{ 'height': '0.8rem', 'transform': item.show == true ? 'rotate(90deg)' : 'rotate(0deg)' }"
                            src="/image/right.svg">
                    </div>
                    <div :ref="setRefs" class="rich-content">

                    </div>
                </div>
            </div>
            <el-pagination class="page-number" @current-change="changePage" background layout="prev, pager,next"
                :page-size="20" :total="msgTotal" />
        </div>
        <StateLayout :load-state="msgLoadState" :empty-text="msgEmptyText" />
    </div>
</template>

<script lang="ts" setup>
const { t } = useI18n()
import { computed, onMounted, reactive, ref } from 'vue';

import useMine from '../hooks/useMine';
import { showOpDialog, showToast } from '../utils';
import router from '../router';

const { msgDataList, apiMessageRed, msgLoadState, msgEmptyText, apiMineMessageList, apiDelMessage, msgTotal } = useMine()

const selectMsgIds = reactive([])

const divRefs = ref([]);

const setRefs = (el) => {
    if (el) {
        divRefs.value.push(el);
    }
};

let page = 1

onMounted(() => {
    getData()
})

function changePage(index: number) {
    page = index
    getData()
}

function clickItem(index: number, data) {
    const action = data['action'].toString()
    if (data.is_read == 0) {
        data.is_read = 1
        apiMessageRed(data.id)
    }
    if (action == "battle") {
        router.push({
            name: 'battleDetail',
            params: {
                id: data['action_url']
            }
        })
    } else if (action == 'url') {
        window.open(data.action_url, '_blank')
    } else if (action == 'richText') {
        if (divRefs.value[index].innerHTML.length > 0) {
            //隐藏
            divRefs.value[index].innerHTML = ''
            data.show = false
        } else {
            divRefs.value[index].innerHTML = data['action_url']
            data.show = true
        }
    } else if (action == 'details') {
        router.push({
            name: 'rollDetail',
            params: {
                id: data['action_url']
            }
        })
    }

}

function getData() {
    apiMineMessageList(page)
}

function addOrRemoveBagId(event, id: string) {
    event.stopPropagation()
    if (selectMsgIds.includes(id)) {
        const index = selectMsgIds.indexOf(id)
        selectMsgIds.splice(index, 1)
    } else {
        selectMsgIds.push(id)
    }
}

function selectAll() {
    if (isSelectAll.value) {
        for (let item of msgDataList) {
            const index = selectMsgIds.indexOf(item.id)
            if (index >= 0) {
                selectMsgIds.splice(index, 1)
            }
        }
    } else {
        for (let item of msgDataList) {
            if (!selectMsgIds.includes(item.id)) {
                selectMsgIds.push(item.id)
            }
        }
    }
}

function delMessage() {
    if (selectMsgIds.length <= 0) {
        showToast({
            'msg': t('message.pleaseSelectAtLeastOne')
        })
        return
    }
    showOpDialog(function () {
        doDelMessage()
    }, {
        text: t('message.confirmDeleteMessage')
    })
}

async function doDelMessage() {
    let ids = ""
    selectMsgIds.forEach(element => {
        ids += element
        ids += ','
    });
    ids = ids.substring(0, ids.length - 1)
    const result = await apiDelMessage(ids)
    if (result) {
        getData()
    }
}

let isSelectAll = computed(() => {
    //计算出当前页 是否全部包含在选择列表里
    if (selectMsgIds.length == 0) {
        return false;
    }
    const isIncluded = msgDataList.every(item => selectMsgIds.some(subItem => subItem === item.id));
    return isIncluded
})

</script>

<style scoped>
.right {
    position: relative;
    flex-grow: 1;
    border-radius: 4px;
    background-color: #121212;
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
    height: 1.96rem;
    font-size: var(--font-size-18);
    align-items: center;
    justify-content: space-between;
    margin-top: 0.3rem;
    border-bottom: 1px solid var(--theme-color-30);
}

.top-left {
    font-weight: bold;
    font-size: var(--font-size-18);
    color: var(--color-d6);
    display: flex;
    font-weight: normal;
    margin-right: 1.2rem;
    align-items: center;
    height: 100%;
}

.del-btn {
    cursor: pointer;
    user-select: none;
    border: 1px solid var(--theme-color);
    border-radius: 4px;
    height: 1.5rem;
    justify-content: center;
    width: 2.583rem;
    ;
    color: var(--theme-color);
    display: flex;
    align-items: center;
}

.content {
    flex-grow: 1;
    height: 0;
    overflow: hidden;
    overflow-y: auto;
    width: 100%;
}

.item {
    border-bottom: 1px solid #333;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.item-card {
    display: flex;
    width: 100%;
    align-items: center;
    height: 2.33rem;
}

.item-icon {
    width: var(--font-size-18);
    height: var(--font-size-18);
}

.item-text {
    flex-grow: 1;
    width: 0;
    margin-left: 0.4rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #999;
    font-weight: bold;
}

.item-time {
    margin: 0 0.2rem;
    color: #999;
    font-size: var(--font-size-14);
}

.page-number {
    display: flex;
    justify-content: center;
    margin-top: 1rem;
    --el-color-primary: var(--theme-color);
    --el-color-white: #060403;
}

.rich-content {
    max-height: 10rem;
    background-color: #00000033;
    width: 100%;
    overflow: hidden;
    overflow-y: auto;
}

@media screen and (max-width:995px) {
    .top-layout {
        height: 3rem;
        margin-top: 0;
    }

    .top-left {
        font-size: 1rem;
    }

    .del-btn {
        font-size: 1rem;
        height: 2rem;
        width: 4rem;
    }

    .item-text {
        font-size: 1rem;
        font-weight: normal;
    }

    .item-icon {
        width: 1rem;
        height: 1rem;
    }

    .item-card {
        height: 3.3rem;
    }

    .item-time {
        margin: 0 0.2rem;
        color: #999;
        font-size: 0.8rem
    }

}
</style>