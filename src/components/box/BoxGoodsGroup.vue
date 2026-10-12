<template>
    <div ref="groupRef" class="goods-group-box">
        <div v-for="item in data" class="item-box">
            <div class="item-logos">
                <LogosIcon style="width: 100%;height: 60%;" :color="getGoodsBottomColor(item.color, '44')" />
            </div>
            <div class="item-img">
                <img loading="lazy" decoding="async" class="size-full" :src="getImageUrl(item.goods_image)">
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { getGoodsBottomColor, getImageUrl } from '../../utils';

const groupRef = ref<any>(null)

const p = defineProps(['data'])

onMounted(() => {
    window.addEventListener("resize", () => {
        doBoxReSize();
    });
    doBoxReSize()
})

function doBoxReSize() {
    console.log(groupRef.value.clientWidth)
}

</script>

<style scoped>
.goods-group-box {
    top: 0;
    left: 0;
    position: absolute;
    width: 100%;
    height: 100%;
    display: flex;
    gap: .2rem;
    align-items: center;
    justify-content: center;
}

.item-box {
    position: relative;
    margin-right: 5px;
    height: 140px;
    flex-shrink: 0;
    margin-top: 5px;
    width: 190px;
    background-color: #171A21FF;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.item-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 8%;
    box-sizing: border-box;
    z-index: 1;
}

.item-img img {
    object-fit: contain;
}
</style>