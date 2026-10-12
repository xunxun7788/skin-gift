<template>
    <div class="create-battle">
        <div class="create-top bold font-32">
            <div v-on:click="back" class="back-btn">
                <img class="size-1rem" src="/image/m_back.svg">
            </div>
            <span class="create-top-title">{{ $t('battle.createBattle') }}</span>
        </div>
        <div class="create-body">
            <div class="create-boxs" :class="{ 'create-boxs-has': selectBoxList }">
                <div v-on:click="showAddCastDialog" class="create-add btn">
                    <img class="size-2rem icon-add" src="/image/create_add.svg" alt="">
                    <div class="create-add-cell gap-8 margin-top-16">
                        <span class="font-20 bold case-font">{{ $t('battle.addCase') }}</span>
                        <span class="din font-18 font-9AA1AD case-font-count">{{ totalCount }}/10</span>
                    </div>
                </div>
                <div class="create-box-list">
                    <BattleSelectCastCell v-for="value in selectBoxList" :value="value" :set-cast-value="setCastValue"
                        v-on:del="onDel" />
                </div>
            </div>
            <div class="create-info _mobile">
                <div class="base-row width-full gap-16">
                    <div class="create-line-btn bold font-16 gap-8">
                        <span>
                            {{ $t('battle.Rounds') }}
                        </span>
                        <span class="font-18 din font-EDEFF3">
                            {{ totalCount }}/10
                        </span>
                    </div>
                    <div class="create-line-btn bold font-16 gap-8">
                        <span>
                            {{ $t('battle.Cost') }}
                        </span>
                        <span class="font-18 din font-EDEFF3">
                            {{ priceUnit() }}{{ formatCoin(costValue) }}
                        </span>
                    </div>
                </div>
                <div class="battle-sort-player font-16 gap-8">
                    <span>{{ $t('battle.players') }}</span>
                    <div v-for="value in 3" v-on:click="playerCount = value + 1" class="battle-sort-player-btn font-15"
                        :class="{ 'battle-sort-player-btn-active': value + 1 == playerCount }">
                        {{ value + 1 }}
                    </div>
                </div>
                <div class="base-row width-full gap-16">
                    <div v-on:click="clearValue" class="create-fill-btn flex-130 btn font-20 bold font-EDEFF3"
                        :class="{ 'opacity-100': totalCount > 0, 'opacity-50': totalCount <= 0 }">
                        {{ $t('battle.clear') }}
                    </div>
                    <div v-on:click="submit"
                        class="create-fill-btn flex-165 btn font-20 bold font-6B7280 gap-8 font-1A1206"
                        :class="{ 'opacity-100': totalCount > 0, 'opacity-50': totalCount <= 0 }"
                        style="background-color: #FFBF00FF;">
                        <img src="/image/battle_add.svg" alt="">
                        {{ $t('battle.createBattle') }}
                    </div>
                </div>
            </div>
            <div class="create-info _windows">
                <div class="battle-sort-player font-16 gap-8">
                    <span>{{ $t('battle.players') }}</span>
                    <div v-for="value in 3" v-on:click="playerCount = value + 1" class="battle-sort-player-btn font-15"
                        :class="{ 'battle-sort-player-btn-active': value + 1 == playerCount }">
                        {{ value + 1 }}
                    </div>
                </div>
                <div class="base-row gap-1rem">
                    <div class="create-line-btn bold font-16 gap-8">
                        <span>
                            {{ $t('battle.Rounds') }}
                        </span>
                        <span class="font-18 din font-EDEFF3">
                            {{ totalCount }}/10
                        </span>
                    </div>
                    <div class="create-line-btn bold font-16 gap-8">
                        <span>
                            {{ $t('battle.Cost') }}
                        </span>
                        <span class="font-18 din font-EDEFF3">
                            {{ priceUnit() }}{{ formatCoin(costValue) }}
                        </span>
                    </div>
                    <div v-on:click="clearValue" class="create-fill-btn btn font-20 bold font-EDEFF3"
                        :class="{ 'opacity-100': totalCount > 0, 'opacity-50': totalCount <= 0 }">
                        {{ $t('battle.clear') }}
                    </div>
                    <div v-on:click="submit" class="create-fill-btn btn font-20 bold font-6B7280 gap-8 font-1A1206"
                        :class="{ 'opacity-100': totalCount > 0, 'opacity-50': totalCount <= 0 }"
                        style="background-color: #FFBF00FF;">
                        <img src="/image/battle_add.svg" alt="">
                        {{ $t('battle.createBattle') }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue';
import BattleSelectCastCell from '../components/battle/BattleSelectCastCell.vue';
import useBattle from '../hooks/useBattle.ts';
import router from '../router';
import { formatCoin, priceUnit } from '../utils';
import { showBattleAddCastDialog } from '../utils/dialogs';
const { apiCreateBattle, apiBattleBoxList } = useBattle()

const playerCount = ref(2)

const selectBoxList = reactive<any[]>([])

onMounted(() => {
    getData()
})

async function getData() {
    const j = localStorage.getItem('temp_copy_box_data');
    localStorage.setItem('temp_copy_box_data', '')
    if (j) {
        const json = JSON.parse(j)
        if (json) {
            if (json['battleInfo']['room_num']) {
                playerCount.value = json['battleInfo']['room_num']
            }
            console.log(json)
            const r = await apiBattleBoxList(1, 1000)
            if (r?.data.data) {
                const oarr = json['boxList'] as []
                const arr = r.data.data as []
                for (const key in arr) {
                    const e = arr[key];
                    for (const ok in oarr) {
                        const oe = oarr[ok];
                        if (oe['box_id'] == e['id']) {
                            e['count'] = oe['box_num']
                            selectBoxList.push(e)
                        }
                    }
                }
            }
        }
    }
}

function back() {
    router.push({
        name: 'battle'
    })
}

function onDel(value: any) {
    const index = selectBoxList.findIndex((item: any) => item.id === value.id)
    if (index != -1) {
        selectBoxList.splice(index, 1)
    }
}

function setCastValue(value: any, count: number) {
    if (!(value.count == 1 && count < 0)) {
        if (count > 0) {
            if (totalCount.value >= 10) {
                return;
            }
        }
        value.count += count;
    }
}

async function submit() {
    if (selectBoxList.length <= 0) {
        return
    }
    let box = ""
    box = "{"
    selectBoxList.forEach((e) => {
        box += `"${e.id}":${e.count},`;
    })
    box = box.substring(0, box.length - 1)
    box += '}'
    const r = await apiCreateBattle(box, playerCount.value)
    if (r) {
        back()
    }
}

function showAddCastDialog() {
    showBattleAddCastDialog({
        onSelect: onSelect,
        selectData: selectBoxList
    })
}

function clearValue() {
    selectBoxList.length = 0
}


function onSelect(data: any) {
    selectBoxList.length = 0
    Object.assign(selectBoxList, data)
}

const totalCount = computed<number>(() => {
    var count = 0
    for (const key in selectBoxList) {
        const e = selectBoxList[key];
        if (e.count) {
            count += e.count;
        }
    }
    return count;
})

const costValue = computed(() => {
    var price = 0
    for (const key in selectBoxList) {
        const e = selectBoxList[key];
        if (e.count) {
            price += e.price * e.count;
        }
    }
    return price
})



</script>


<style scoped>
.create-battle {
    height: 100%;
    width: 100%;
    overflow: hidden;
    overflow-y: auto;
    position: absolute;
    top: 0;
    left: 0;
    align-items: center;
    display: flex;
    flex-direction: column;
}

.create-top {
    display: flex;
    width: 82%;
    position: relative;
    margin-top: 1rem;
    align-items: center;
    justify-content: center;
}

.back-btn {
    position: absolute;
    left: 0;
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

.create-body {
    margin-top: 1.33rem;
    border: 1px solid #333A47FF;
    background-color: #171A21FF;
    border-radius: .66rem;
    width: 82%;
    box-sizing: border-box;
    padding: 1rem;
    display: flex;
    flex-direction: column;
}

.create-boxs {
    display: flex;
    gap: 1rem;
    align-items: center;
}

.create-boxs-has {
    gap: 12px !important;
}

.create-box-list {
    display: flex;
    align-items: center;
    flex: 1;
    width: 0;
    gap: 1rem;
    overflow-x: auto;
}

.create-add {
    display: flex;
    flex-direction: column;
    width: 9.3rem;
    height: 14rem;
    justify-content: center;
    align-items: center;
    border-radius: .66rem;
    background-color: #262B35FF;
}

.create-add-cell {
    display: flex;
    align-items: center;
    flex-direction: column;
}

.create-info {
    display: flex;
    margin-top: 1rem;
    align-items: center;
    justify-content: space-between;
}

.battle-sort-player {
    display: flex;
    border-radius: 1rem;
    height: 2rem;
    padding-right: .375rem;
    padding-left: .7rem;
    color: #9AA1ADFF;
    border: 1px solid #333A47FF;
    align-items: center;
}

.battle-sort-player-btn {
    cursor: pointer;
    touch-action: none;
    width: 1.416rem;
    font-family: 'din';
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 1.416rem;
    border-radius: 1rem;
    background-color: #262B35FF;
}

.battle-sort-player-btn-active {
    color: #EDEFF3FF;
    background-color: #FFFFFF4D;
}

.create-line-btn {
    height: 2rem;
    display: flex;
    align-items: center;
    border-radius: 1rem;
    padding: 0 .7rem;
    color: #9AA1ADFF;
    border: 1px solid #333A47FF;
}

.create-fill-btn {
    height: 2rem;
    padding: 0 .67rem;
    display: flex;
    align-items: center;
    border-radius: 1rem;
    justify-content: center;
    background-color: #333A47FF;
}

@media screen and (max-width: 995px) {
    .create-top {
        width: calc(100% - 32px);
        margin: 0 16px;
        margin-top: 12px;
    }

    .back-btn {
        height: 32px;
        width: 44px;
    }

    .create-top-title {
        font-size: 18px;
    }

    .icon-add {
        width: 37px;
        height: 37px;
    }

    .create-body {
        width: calc(100% - 32px);
        padding: 16px;
        margin-top: 16px;
    }

    .create-boxs {
        flex-direction: column;
        gap: 0;
    }

    .create-box-list {
        width: 100%;
        gap: 12px;
    }

    .create-add {
        width: 100%;
        padding: 16px 0;
        flex-direction: row;
        height: fit-content;
        gap: 10px;
    }

    .create-add-cell {
        margin-top: 0;
    }


    .create-info {
        background-color: #171A21FF;
        box-shadow: inset 0 0 0 1px #333A47FF;
        border-radius: .66rem;
        padding: 16px;
        margin-top: 0;
        gap: 10px;
        flex-direction: column;
        align-items: start;
        box-sizing: border-box;
    }

    .case-font {
        font-size: 12px;
    }

    .font-16 {
        font-size: 14px !important;
    }

    .case-font-count {
        font-size: 10px;
    }

    .battle-sort-player {
        border: none;
        padding: 0;
        font-size: 15px !important;
    }

    .create-line-btn {
        height: 34px;
        flex: 1;
    }

    .create-fill-btn {
        height: 40px;
        border-radius: 20px;
        font-size: 15px !important;
    }

    .flex-130 {
        flex: 130;
    }

    .flex-165 {
        flex: 165;
    }

}
</style>