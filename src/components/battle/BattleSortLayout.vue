<template>
    <div class="battle-sort-layout">
        <div class="battle-sort-player-box">
            <div class="battle-sort-player font-16 gap-8">
                <span>{{ $t('battle.players') }}</span>
                <div v-for="value in playerArr" v-on:click="setPlayerCount(value)"
                    class="battle-sort-player-btn font-15"
                    :class="{ 'battle-sort-player-btn-active': value == playerCount }">
                    {{ value }}
                </div>
            </div>
            <div v-if="isShowByMe" class="battle-sort-me-box _mobile">
                <div v-on:click="availableMe = !availableMe" class="battle-sort-me gap-8">
                    <span>{{ $t('common.Available') }}</span>
                    <img class="battle-sort-me-btn" :src="`/image/switch_${availableMe ? 'on' : 'off'}.svg`" alt="">
                </div>
                <HelpIcon v-on:click="showBattleHelpDialog" class="icon-help btn" />
            </div>
        </div>
        <div class="battle-sort-box">
            <div v-on:click="showNewOldSort = !showNewOldSort" class="battle-sort-new-old gap-8 font-16">
                <span>{{ $t(newOldSortStr) }}</span>
                <img :class="{ 'battle-sort-new-old-active': showNewOldSort }" src="/image/sort.svg" alt="">
                <div class="battle-sort-new-old-drop font-14"
                    :class="{ 'battle-sort-new-old-drop-show': showNewOldSort }">
                    <span v-on:click="newOldSort = -1">{{ $t('common.byTime') }}</span>
                    <span v-on:click="newOldSort = 0">{{ $t('common.newSort') }}</span>
                    <span v-on:click="newOldSort = 1">{{ $t('common.oldSort') }}</span>
                </div>
            </div>
            <div v-on:click="showPriceSort = !showPriceSort" class="battle-sort-new-old gap-8 font-16">
                <span>{{ $t(priceSortStr) }}</span>
                <img :class="{ 'battle-sort-new-old-active': showPriceSort }" src="/image/sort.svg" alt="">
                <div class="battle-sort-new-old-drop font-14"
                    :class="{ 'battle-sort-new-old-drop-show': showPriceSort }">
                    <span v-on:click="priceSort = -1">{{ $t('common.byPrice') }}</span>
                    <span v-on:click="priceSort = 0">{{ $t('common.priceHighSort') }}</span>
                    <span v-on:click="priceSort = 1">{{ $t('common.priceLowSort') }}</span>
                </div>
            </div>
        </div>

        <div v-if="isShowByMe" class="battle-sort-me-box _windows">
            <div v-on:click="availableMe = !availableMe" class="battle-sort-me gap-8">
                <span>{{ $t('common.Available') }}</span>
                <img class="battle-sort-me-btn" :src="`/image/switch_${availableMe ? 'on' : 'off'}.svg`" alt="">
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { showBattleHelpDialog } from '../../utils/dialogs';
import HelpIcon from '../icons/main/HelpIcon.vue';

const p = defineProps(['onChangeData', 'isShowByMe'])

const playerArr = ['2', '3', '4']

const playerCount = ref<string | undefined>(undefined)

const newOldSort = ref(-1)

const showNewOldSort = ref(false)

const priceSort = ref(-1)

const showPriceSort = ref(false)

const availableMe = ref(false)

function setPlayerCount(count: string) {
    if (count == playerCount.value) {
        playerCount.value = undefined
    } else {
        playerCount.value = count
    }
    doChangeData()
}

function doChangeData() {
    p.onChangeData?.(
        {
            room_num: playerCount.value,
            order_time: getOrderTime(),
            order_price: getOrderPrice(),
            my: availableMe.value ? '1' : ''
        }
    )
}

function getOrderTime() {
    if (newOldSort.value == -1) {
        return undefined
    }
    return newOldSort.value == 0 ? 'asc' : 'desc'
}

function getOrderPrice() {
    if (priceSort.value == -1) {
        return undefined
    }
    return priceSort.value == 0 ? 'asc' : 'desc'
}

const newOldSortStr = computed(() => {
    if (newOldSort.value == -1) {
        return 'common.byTime';
    }
    return newOldSort.value == 0 ? 'common.newSort' : 'common.oldSort'
})

const priceSortStr = computed(() => {
    if (priceSort.value == -1) {
        return 'common.byPrice';
    }
    return priceSort.value == 0 ? 'common.priceHighSort' : 'common.priceLowSort'
})

watch(newOldSort, () => {
    doChangeData()
})

watch(priceSort, () => {
    doChangeData()
})

watch(availableMe, () => {
    doChangeData()
})

</script>

<style scoped>
.battle-sort-layout {
    display: flex;
    gap: 1rem;
    align-items: center;
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

.battle-sort-player-box {
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: space-between;
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

.battle-sort-box {
    display: flex;
    white-space: nowrap;
    align-items: center;
    gap: 1rem;
}

.battle-sort-new-old {
    height: 2rem;
    position: relative;
    border-radius: 1rem;
    border: 1px solid #333A47FF;
    padding: 0 .7rem;
    color: #9AA1ADFF;
    cursor: pointer;
    touch-action: none;
    font-weight: bold;
    display: flex;
    align-items: center;
}

.battle-sort-new-old img {
    height: .375rem;
    transition: all .3s ease;
}

.battle-sort-new-old-active {
    transform: rotate(180deg);
}

.battle-sort-new-old-drop {
    position: absolute;
    z-index: 2;
    left: 0;
    right: 0;
    padding: .5rem .7rem;
    top: 2.4rem;
    width: fit-content;
    scale: 0;
    display: flex;
    flex-direction: column;
    transform-origin: top center;
    border: 1px solid #333A47FF;
    border-radius: .5rem;
    background-color: #262B35FF;
    transition: all .3s ease;
}

.battle-sort-new-old-drop span {
    padding: .25rem 0;
    width: 100%;
    text-align: left;
}

.battle-sort-new-old-drop-show {
    scale: 1;
}

.battle-sort-me-box {
    flex: 1;
    display: flex;
    white-space: nowrap;
    justify-content: end;
}

.battle-sort-me {
    height: 2rem;
    border-radius: 1rem;
    border: 1px solid #333A47FF;
    padding: .7rem;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    color: #9AA1ADFF;
    cursor: pointer;
    touch-action: none;
    font-weight: bold;
}

.battle-sort-me-btn {
    height: 1rem;
}

@media screen and (max-width: 995px) {

    .battle-sort-layout {
        flex-direction: column;
        justify-content: start;
        gap: 12px;
        align-items: start;
    }

    .battle-sort-player {
        border: none;
        height: 36px;
        padding-left: 0;
        padding-right: 8px;
    }

    .battle-sort-new-old {
        height: 28px;
        flex: 1;
        white-space: nowrap;
        padding: 0 10px;
        justify-content: space-between;
        font-size: 14px !important;
    }

    .battle-sort-new-old img {
        height: 9px;
    }

    .battle-sort-new-old-drop {
        top: 35px;
    }

    .battle-sort-player-btn {
        width: 24px;
        height: 24px;
    }

    .battle-sort-box {
        width: 100%;
        gap: 16px;
    }

    .battle-sort-me {
        height: 36px;
        border: none;
        padding: 0;
        font-size: 14px;
    }

    .battle-sort-me-btn {
        height: 24px;
    }

    .battle-sort-me-box {
        gap: 16px;
        align-items: center;
    }

    .icon-help {
        width: 24px;
        height: 24px;
    }

}
</style>