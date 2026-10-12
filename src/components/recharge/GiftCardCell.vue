<template>
    <div class="giftcard-cell-box">
        <div v-on:click="goToPay(value.link)" v-for="value in data.item" class="giftcard-cell btn">
            <div :style="{ 'background': value.color, 'border-radius': '12px' }" class="size-full"></div>
            <img :src="getImageUrl(value.background)" alt="">
            <span class="value din bold font-EDEFF3 font-26">{{ priceUnit() }}{{ formatCoin(value.amount) }}</span>
            <img class="image" :src="getImageUrl(value.image)" alt="">
            <slot></slot>
        </div>
    </div>

</template>

<script setup lang="ts">
import { formatCoin, getImageUrl, priceUnit } from '../../utils';


defineProps(['data'])

function goToPay(link: string) {
    window.open(link, '_blanck')
}

</script>

<style scoped>
.giftcard-cell-box {
    width: 100%;
    display: grid;
    gap: .5rem;
    row-gap: .5rem;
    grid-template-columns: 1fr 1fr 1fr;
    align-items: center;
}

.giftcard-cell {
    position: relative;
    box-shadow: inset 0 0 0 1px #ffffff22;
    border-radius: .5rem;
    display: flex;
    height: 4rem;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

.giftcard-cell img {
    position: absolute;
    bottom: 0;
    right: 0;
    height: 100%;
}

.giftcard-cell .value {
    position: absolute;
    left: .66rem;
    top: 15%;
}

.giftcard-cell .image {
    position: absolute;
    bottom: 10px;
    left: 5%;
    height: 30%;
}

@media screen and (min-width: 1200px) {
    .giftcard-cell-box {
        grid-template-columns: 1fr 1fr 1fr;
    }
}

@media screen and (min-width: 1440px) {


    .giftcard-cell-box {
        grid-template-columns: 1fr 1fr 1fr 1fr;
    }

}
</style>