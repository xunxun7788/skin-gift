<template>
    <div :class="{ 'battle-add-box-cell': true, 'battle-add-box-cell-active': (isShowLine ?? false) && value.count }">
        <div class="battle-add-box-cell-img">
            <img class="size-full" :src="cdnUrl + value.image" alt="">
            <div class="battle-add-box-cell-price font-18 din bold">
                {{ priceUnit() }}{{ formatCoin(value.price) }}
            </div>
        </div>
        <span class="font-16 bold color-EDEFF3 margin-top-16">{{ value.name }}</span>
        <div v-if="!value.count" v-on:click="setCastValue(value, 0)" class="btn battle-add-box-cell-btn margin-top-16">
            <span class="font-16 bold font-1A1206">{{ $t('battle.addCase') }}</span>
        </div>
        <div v-if="value.count" class="battle-add-box-cell-count margin-top-16">
            <img class="size-1rem btn" v-on:click="setCastValue(value, - 1)" src="/image/c_l.svg" alt="">
            <span class="flex-1 font-16 bold font-EDEFF3 center">{{ value.count }}</span>
            <img v-on:click="setCastValue(value, 1)" class="size-1rem btn" src="/image/c_r.svg" alt="">
        </div>
        <div v-if="value.count" v-on:click="doDel" class="battle-add-box-cell-del btn">
            <img class="size-1rem" src="/image/del.svg" alt="">
        </div>
    </div>
</template>

<script setup lang="ts">
import { cdnUrl, formatCoin, priceUnit } from '../../utils';

const p = defineProps(['value', 'setCastValue', 'onDel', 'isShowLine'])

function doDel() {
    if (p.onDel) {
        p.onDel?.(p.value)
    } else {
        p.value.count = 0
    }
}

</script>


<style scoped>
.battle-add-box-cell {
    position: relative;
    width: 9.3rem;
    height: 14rem;
    flex-shrink: 0;
    background-color: #0E1014FF;
    border-radius: .66rem;
    display: flex;
    padding: .66rem 0;
    align-items: center;
    box-sizing: border-box;
    flex-direction: column;
}

.battle-add-box-cell-active {
    box-shadow: inset 0 0 0 1px #FFBF00FF;
}

.battle-add-box-cell-img {
    position: relative;
    display: flex;
    width: 100%;
    aspect-ratio: 1;
    flex: 1;
    height: 0;
    align-items: center;
    justify-content: center;
}

.battle-add-box-cell-img img {
    width: 89%;
    object-fit: contain;
    aspect-ratio: 1;
}

.battle-add-box-cell-price {
    height: 1.66rem;
    position: absolute;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #FFBF00FF;
    backdrop-filter: blur(10px);
    border-radius: 1rem;
    padding: 0 .625rem;
    border: 1px solid #FFBF0026;
    background-color: #FFBF0026;
}


.battle-add-box-cell-btn {
    height: 1.66rem;
    margin-left: .66rem;
    margin-right: .66rem;
    width: calc(100% - 1.32rem);
    background-color: #FFBF00FF;
    border-radius: 1rem;
    display: flex;
    align-items: center;
    justify-content: center;
}

.battle-add-box-cell-count {
    height: 1.66rem;
    width: calc(100% - 1.32rem);
    border-radius: 1rem;
    margin-left: .66rem;
    padding: 0 .33rem;
    display: flex;
    align-items: center;
    margin-right: .66rem;
    background-color: #1F232CFF;
}

.battle-add-box-cell-del {
    position: absolute;
    top: 0;
    right: 0;
    display: flex;
    align-items: center;
    padding: .25rem;
    justify-content: center;
}
</style>