<template>
    <div class="reward-layout">
        <div class="top-layout">
            <div class="base-row width-full flex-content-end">
                <div v-on:click="showHelp" class="help-btn btn">
                    <img class="size-1rem" src="/image/help.svg" alt="">
                    <span>{{ $t('fuli.gameIntro') }}</span>
                </div>
            </div>
            <div class="reward-card-layout">
                <div v-for="(item, index) in fuliInfoData.box" :key="index" @click="changeBox(index, item)"
                    :class="{ 'box-item': true, 'box-active': currentBoxIndex == index }">
                    <img class="reward-image" :src="getImageUrl(item.image)" alt="">
                    <div class="f-level-desc font-14">
                        {{ $t('fuli.rechargeToGet', { amount: item.total_need_recharge_amount }) }}</div>
                    <div @click="openBoxSubmit(item.open_status, item.id)"
                        :class="{ 'btn-open': true, 'btn-open-active': item.open_status == 1 }">
                        {{
                            $t(getStatusButtonText(item.open_status)) }}
                    </div>
                    <img class="icon" :src="getImageUrl(item.icon)" alt="">
                </div>
            </div>
        </div>
        <div class="base-row flex-content-center">
            <BaseTab :tabs="[$t('fuli.boxContains')]" />
        </div>
        <div class="boxGridFather">
            <div class="boxGrid">
                <div v-for="(item, index) in boxDetailData.goods_list" class="gridItem" :key="index"
                    :style="{ background: getGoodsBgColor(item.color) }">
                    <LogosIcon class="logos" :color="getGoodsBottomColor(item.color)" />
                    <img class="gun" :src="getImageUrl(item.goods_image)">
                    <div class="text">
                        <div class="name">{{ item.goods_name }}</div>
                        <div class="price">
                            {{ priceUnit() }} {{ item.show_price }}
                        </div>
                    </div>
                    <div class="bottom-box" :style="{ backgroundColor: getGoodsBottomColor(item.color) }"></div>

                    <div class="rate">
                        <img src="/image/rate.svg" alt="">
                    </div>
                    <div class="rate-info font-14">
                        {{ $t('box.chance') + ' ' + item.rate }}
                    </div>
                </div>
            </div>
        </div>
        <Footer></Footer>
    </div>

</template>

<script lang="ts" setup>

import { onMounted, ref } from 'vue';
import BaseTab from '../components/BaseTab.vue';
import Footer from '../components/Footer.vue';
import useFuli from '../hooks/useFuli';
import { getGoodsBgColor, getGoodsBottomColor, getImageUrl, priceUnit, showOpenBoxDialog } from '../utils';
import { showRewadHelpDialog } from '../utils/dialogs.ts';
const { apiFuliData, openBox, boxDetailData, apiBoxDetail, fuliInfoData } = useFuli()
let currentBoxIndex = ref(0)


onMounted(() => {
    getFuliData()
})

function showHelp() {
    showRewadHelpDialog()
}


async function getFuliData() {
    await apiFuliData()
    if (fuliInfoData.box) {
        apiBoxDetail(fuliInfoData.box[currentBoxIndex.value].id)
    }
}

function changeBox(index: number, item: any) {
    currentBoxIndex.value = index;
    boxDetailData.goods_list.length = 0
    apiBoxDetail(item.id)
}

function getStatusButtonText(status: number) {
    let text = ""
    switch (status) {
        case 0:
        case 1:
            text = 'fuli.open';
            break;
        case 2:
            text = 'fuli.opened';
            break;
    }
    return text;
}

async function openBoxSubmit(open_status, id) {
    if (open_status != 1) {
        return
    }
    if (boxDetailData != null && boxDetailData.goods_list != null) {
        const result = await openBox(id)
        if (result != null) {
            showOpenBoxDialog(boxDetailData.goods_list, result.data, boxDetailData.item, 1, null, getFuliData)
        }
    }
}

</script>

<style scoped>
.reward-layout {
    height: 100%;
    width: 100%;
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    overflow-y: auto;
    align-items: center;
    display: flex;
    flex-direction: column;
}

.top-layout {
    margin: 1rem;
    width: calc(100% - 2rem);
    border-radius: 4px;
    padding: 0.625rem;
    margin-bottom: 0;
    display: flex;
    flex-direction: column;
}


.icon {
    position: absolute;
    top: .5rem;
    left: .5rem;
    height: 2.5rem;
}

.help-btn {
    height: 2rem;
    display: flex;
    gap: .4rem;
    color: #9AA1ADFF;
    align-items: center;
    justify-content: center;
    border-radius: 1rem;
    box-shadow: inset 0 0 0 1px #333A47FF;
    padding-left: .7rem;
    padding-right: 1rem;
}

.reward-card-layout {
    display: flex;
    margin-top: 1rem;
    position: relative;
    gap: .6rem;
    white-space: nowrap;
    overflow-x: auto;
    padding-bottom: .5rem;
}




.f-level-desc {
    margin-top: 0.3rem;
    text-align: center;
    color: #FFBF00FF;
    font-weight: bold;
}



.box-item {
    padding: 1rem 0;
    width: 10rem;
    cursor: pointer;
    user-select: none;
    flex: 0 0 auto;
    border-radius: .88rem;
    background-color: #171A21FF;
    display: flex;
    align-items: center;
    flex-direction: column;
    box-shadow: inset 0 0 0 1px #333A47FF;
    position: relative;
}

.reward-image {
    width: 90%;
    aspect-ratio: 1;
}

.box-active {
    box-shadow: inset 0 0 0 1px var(--theme-color);
}





.btn-open {
    width: 80%;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 1rem;
    color: #1A1206FF;
    opacity: .5;
    font-weight: bold;
    border-radius: 1rem;
    background-color: #FFBF00FF;
}

.btn-open-active {
    cursor: pointer;
    opacity: 1;
    user-select: none;
}


.boxGridFather {
    display: flex;
    flex-shrink: 0;
    flex-direction: column;
    min-height: calc(100vh - var(--window-headerNav-height) - 2.71rem - 20rem);
}

.boxGrid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    box-sizing: border-box;
    margin: 1rem;
    gap: .6rem;
    border-radius: 8px;
    row-gap: .6rem;
    align-items: start;
}



.boxGrid .gridItem {
    display: flex;
    flex-direction: column;
    position: relative;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 0 .33rem;
    box-sizing: border-box;
    min-width: 0;
    aspect-ratio: 183 / 146;
    border-radius: .33rem;
}

.logos {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 2rem;
    height: 2rem;
    z-index: 0;
    opacity: .2;
    transform: translateX(-50%) translateY(-50%);
}

.boxGrid .gridItem .itemBg {
    width: 100%;
    height: auto;
    vertical-align: bottom;
}

.boxGrid .gridItem .card {
    position: relative;
    width: 100%;
    transform: translateY(0);
    transition: all 0.4s ease;
}

.boxGrid .gridItem .user {
    position: absolute;
    width: calc(100% - 0.8rem);
    display: flex;
    top: 0.4rem;
    left: 0.4rem;
    margin-right: 0.4rem;
    flex-direction: row;
    align-items: center;
    box-sizing: border-box;
}

.boxGrid .gridItem .gun {
    flex: 1;
    height: 0;
    z-index: 1;
    object-fit: contain;
    transition: all 0.4s ease;
}

.boxGrid .gridItem .gun:hover {
    transform: scale(1.2);
}

.boxGrid .gridItem .text {
    bottom: .33rem;
    display: flex;
    width: 100%;
    left: 0;
    padding: 0 .33rem;
    gap: .1rem;
    overflow: hidden;
    flex-direction: column;
    text-align: left;
    font-size: 0.8rem;
}



.boxGrid .gridItem .text .name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: calc(100% - .66rem);
    text-align: left;
    font-size: 0.58rem;
}

.price {
    font-family: 'din';
    color: var(--theme-color);
    display: flex;
    font-weight: bold;
    font-size: .6rem;
    align-items: center;
}

.bottom-box {
    height: .167rem;
    width: 48%;
    margin-top: .3rem;
    border-top-right-radius: .2rem;
    border-top-left-radius: .2rem;
}

.rate {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 2;
    cursor: pointer;
    padding: .33rem;
    width: .7rem;
    height: .7rem;
}

.rate-info {
    pointer-events: none;
    position: absolute;
    top: -1.29rem;
    right: 0;
    backdrop-filter: blur(4px);
    background-color: #FFFFFF4D;
    border: solid 1px #FFFFFF26;
    border-radius: 1.29rem;
    height: 1.29rem;
    display: flex;
    opacity: 0;
    align-items: center;
    padding: 0 .33rem;
    transition: all .3s ease;
}


.rate:hover+.rate-info {
    opacity: 1;
}


@media screen and (max-width: 1700px) {
    .boxGrid {
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    }
}

@media screen and (max-width:1450px) {
    .boxGrid {
        grid-template-columns: 1fr 1fr 1fr 1fr;
    }
}

@media screen and (max-width:1200px) {
    .boxGrid {
        grid-template-columns: 1fr 1fr 1fr;
    }
}

@media screen and (max-width:995px) {


    .boxGrid {
        grid-template-columns: 1fr 1fr;
        margin: 1rem;
        padding: 0;
        background-color: transparent;
    }



    .f-level-value {
        font-size: 1rem;
    }


    .f-level-desc {
        font-size: 0.8rem;
    }



    .btn-open {
        width: 8rem;
        height: 2.5rem;
        font-size: 1rem;
    }




    .boxGrid .gridItem .text {
        font-size: 0.9rem;
    }

}

@media screen and (min-width:1701px) {
    .boxGrid {
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    }
}
</style>