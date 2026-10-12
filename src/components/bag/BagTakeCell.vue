<template>
    <div class="bag-take-cell font-12">
        <img class="bag-take-img" :src="getImageUrl(data.image)" alt="">
        <div class="bag-take-right gap-4">
            <div class="base-row gap-8 flex-align-center">
                <div class="exterior">
                    <span>{{ getExteriorName(data.exterior) }}</span>
                </div>
                <span class="font-14">{{ data.name }}</span>
            </div>
            <div class="base-row between flex-align-center font-12 font-6B7280">
                <span class="din font-12 bold font-FFBF00">{{ priceUnit() }}{{ formatCoin(data.recovery_price) }}</span>
                <span>{{ data.create_time }}</span>
            </div>
            <div>
                <span class="font-12" :style="{ 'color': data.status_color }">{{ data.status }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { formatCoin, getExteriorName, getImageUrl, priceUnit } from '../../utils';


defineProps(['data'])

</script>

<style scoped>
.bag-take-cell {
    display: flex;
    background-color: #1F232CFF;
    border-radius: 8px;
    margin: 0 16px;
    padding: 16px;
    box-sizing: border-box;
    align-items: center;
    gap: 4px;
}

.bag-take-img {
    width: 80px;
    height: 60px;
}

.bag-take-right {
    display: flex;
    flex: 1;
    flex-direction: column;
}

.exterior {
    display: flex;
    box-sizing: border-box;
    justify-content: start;
}

.exterior span {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 17px;
    border-radius: 10px;
    padding: 0 8px;
    font-weight: bold;
    background-color: #FFFFFF4D;
    border: solid 1px #FFFFFF26;
    backdrop-filter: blur(16);
}
</style>