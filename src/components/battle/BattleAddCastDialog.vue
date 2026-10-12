<template>

    <div class="battle-add-layout">
        <BaseDialog ref="baseDialogRef">
        </BaseDialog>
        <transition name="layout" @after-leave="props.dismiss">
            <div v-show="isShow" class="battle-add-body">
                <div class="battle-add-top">
                    <span class="font-32 bold color-EDEFF3">{{ $t('battle.addCase') }}</span>
                    <div @click="close_" class="battle-add-close btn">
                        <img class="size-1rem" src="/image/close.svg" alt="">
                    </div>
                </div>
                <div class="battle-add-boxs">
                    <BattleCastCell v-for="value in battleBoxListData" :value="value" :set-cast-value="setCastValue"
                        :is-show-line="true" />
                </div>
                <div class="battle-add-bottom">
                    <div class="base-row gap-1rem round-box">
                        <div class="battle-add-bottom-line-btn gap-8 font-16 font-9AA1AD">
                            <span>{{ $t('battle.Rounds') }}</span>
                            <span class="font-18 bold font-EDEFF3 din">{{ totalCount }}/10</span>
                        </div>
                        <div class="battle-add-bottom-line-btn gap-8 font-16 font-9AA1AD">
                            <span>{{ $t('battle.Cost') }}</span>
                            <span class="font-18 bold font-EDEFF3 din">{{ priceUnit() }}{{ formatCoin(costValue)
                            }}</span>
                        </div>
                    </div>
                    <div class="base-row gap-1rem fill-btn-box">
                        <div v-on:click="clearValue" class="battle-add-bottom-fill-btn btn font-20 color-333A47"
                            :class="{ 'opacity-100': totalCount > 0, 'opacity-50': totalCount <= 0 }">
                            {{ $t('battle.clear') }}
                        </div>
                        <div v-on:click="createBattle"
                            class="battle-add-bottom-fill-btn btn font-20 font-1A1206 color-FFBF00"
                            :class="{ 'opacity-100': totalCount > 0, 'opacity-50': totalCount <= 0 }">
                            {{ $t('battle.createBattle') }}
                        </div>
                    </div>
                </div>
            </div>
        </transition>
    </div>

</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import useBattle from '../../hooks/useBattle.ts';
import { formatCoin, priceUnit } from '../../utils/index.ts';
import BaseDialog from '../BaseDialog.vue';
import BattleCastCell from './BattleCastCell.vue';

const { apiBattleBoxList, battleBoxListData } = useBattle()


const props = defineProps(['dismiss', 'selectData', 'onSelect'])

let isShow = ref(false)

const baseDialogRef = ref<any>(null)

onMounted(() => {
    isShow.value = true
    getData()
})

async function getData() {
    const r = await apiBattleBoxList(1, 1000)
    if (r && props.selectData) {
        assignById(battleBoxListData, props.selectData)
    }
}

function assignById(target: any[], source: any[]) {
    for (const sItem of source) {
        const tItem = target.find(t => t.id === sItem.id)
        if (tItem) {
            Object.assign(tItem, sItem)
        }
    }
}

function setCastValue(value: any, count: number) {
    if (count >= 0) {
        if (totalCount.value >= 10) {
            return;
        }
    }
    if (count == 0) {
        count = 1;
    } else {
        count = value.count + count;
    }
    Object.assign(value, {
        'count': count
    })
}


const totalCount = computed<number>(() => {
    var count = 0
    for (const key in battleBoxListData) {
        const e = battleBoxListData[key];
        if (e.count) {
            count += e.count;
        }
    }
    return count;
})



const costValue = computed(() => {
    var price = 0
    for (const key in battleBoxListData) {
        const e = battleBoxListData[key];
        if (e.count) {
            price += e.price * e.count;
        }
    }
    return price
})


function clearValue() {
    for (const key in battleBoxListData) {
        const e = battleBoxListData[key];
        e.count = 0
    }
}

function createBattle() {
    var count = 0
    var temp = []
    for (const key in battleBoxListData) {
        const e = battleBoxListData[key];
        if (e.count) {
            count = 1
            temp.push(e)
        }
    }
    if (count > 0) {
        props.onSelect?.(temp)
        close_()
    }
}

function close_() {
    if (baseDialogRef.value) {
        baseDialogRef.value.close()
    }
    isShow.value = false
}

</script>

<style scoped>
.battle-add-layout {
    position: fixed;
    display: flex;
    align-items: center;
    justify-content: center;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
}

.battle-add-body {
    position: relative;
    width: 982px;
    overflow-y: auto;
    overflow-x: hidden;
    background-color: #171A21FF;
    border-radius: .66rem;
    border: 1px solid #333A47FF;
}

.battle-add-top {
    display: flex;
    padding: .5rem;
    padding-left: 1rem;
    align-items: center;
    justify-content: space-between;
}

.battle-add-close {
    padding: .5rem;
    margin-right: .5rem;
}

.battle-add-boxs {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    box-sizing: border-box;
    padding: 0 1rem;
    padding-top: .5rem;
    padding-bottom: 1rem;
    overflow-y: auto;
    gap: .5rem;
    height: 500px;
    align-items: flex-start;
}

.battle-add-bottom {
    height: 100px;
    display: flex;
    padding: 0 1rem;
    align-items: center;
    justify-content: space-between;
}


.battle-add-bottom-line-btn {
    height: 2rem;
    padding: 0 .7rem;
    border-radius: 1rem;
    justify-content: center;
    border: 1px solid #333A47FF;
    display: flex;
    align-items: center;
}

.battle-add-bottom-fill-btn {
    height: 2rem;
    padding: 0 .7rem;
    display: flex;
    border-radius: 1rem;
    font-weight: bold;
    align-items: center;
    justify-content: center;
    transition: all .3s ease;
}


.layout-enter-active {
    animation: anima-layout-in 0.3s ease;
}

.layout-leave-active {
    animation: anima-layout-out 0.3s ease;
}

@keyframes anima-layout-in {
    0% {
        opacity: 0;
        transform: scale(.5);
    }

    60% {
        transform: scale(1.1);
    }

    100% {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes anima-layout-out {
    0% {
        opacity: 1;
    }

    100% {
        opacity: 0;
        transform: scale(.5)
    }
}

@media screen and (max-width: 995px) {
    .battle-add-layout {
        align-items: end;
    }

    .battle-add-body {
        padding-bottom: 20px;
    }

    .font-32 {
        font-size: 18px !important;
    }

    .battle-add-bottom {
        flex-direction: column;
    }

    .round-box {
        width: 100%;
    }

    .battle-add-bottom-line-btn {
        flex: 1;
        height: 34px;
        border-radius: 17px;
        justify-content: start;
    }

    .fill-btn-box {
        width: 100%;
        margin-top: 12px;
    }

    .battle-add-bottom-fill-btn {
        flex: 1;
        height: 40px;
        border-radius: 20px;
        font-size: 16px !important;
    }

    .battle-add-boxs {
        padding: 0 12px;
        gap: 12px;
        margin-bottom: 15px;
    }

    .battle-add-top {
        padding: 0 12px;
    }

    .battle-add-close {
        padding: 12px;
        margin-right: 0;
    }

    .battle-add-close img {
        width: 20px;
        height: 20px;
    }

}
</style>