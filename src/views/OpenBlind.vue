<template>
    <div class="open-box-layout">
        <NavSwiper />
        <div class="open-box-body">
            <div class="back">
                <div @click="back" class="back-box">
                    <img class="back-btn" src="/image/m_back.svg">
                </div>
                <div class="title">{{ boxDetailData.item?.box_name }}</div>
                <div class="top-help">
                    <div v-if="boxDetailData.item?.is_limit" class="limit-box">
                        <RingProgress :strokeWidth="18"
                            :percent="boxDetailData.item.use_total_limit_times / boxDetailData.item.total_limit_times * 100"
                            :size="20" color="#FFBF00FF" />
                        <span style="color: #6B7280FF;"
                            v-if="boxDetailData.item.use_total_limit_times >= boxDetailData.item.total_limit_times">{{
                                $t('box.soldOut')
                            }}</span>
                        <span v-else>{{ boxDetailData.item.use_total_limit_times
                            }}/{{ boxDetailData.item.total_limit_times }}</span>
                    </div>
                    <div class="help-box">
                        <div v-on:click="share" class="help-box-btn">
                            <img class="size-1rem" src="/image/share.svg" alt="">
                        </div>
                        <div class="help-line"></div>
                        <div v-on:click="showHelp" class="help-box-btn">
                            <img class="size-1rem" src="/image/help.svg" alt="">
                        </div>
                    </div>
                </div>

            </div>
            <div class="boxShow">
                <div class="box-bg">
                    <img src="/image/box_bg.png" alt="">
                    <SkyBackground class="box-bg-img">
                    </SkyBackground>
                    <div class="top-mask"></div>
                    <div class="bottom-mask"></div>
                </div>
                <BoxGoodsGroup :data="giftGoods"></BoxGoodsGroup>
                <div class="upside">
                    <div class="imgBack">
                        <div class="flash">
                            <div class="flash-scale">
                                <div class="images">
                                    <video ref="videoRef" class="image-b _windows" x5-video-player-type="h5"
                                        webkit-playsinline="true" x-webkit-airplay="true"
                                        x5-video-orientation="portraint" playsInline="true"
                                        x5-video-player-fullscreen="portraint" x5-video-ignore-metadata='true' muted>
                                        <source src="/image/bab.webm" />
                                    </video>
                                    <img v-show="boxDetailData.item?.box_image" class="backgroundImage" loading="lazy"
                                        decoding="async" :src="getImageUrl(boxDetailData.item?.box_image)">
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="boxDetailData.item" class="boxCount">
                        <div v-if="!(boxDetailData.item?.free == 1)" class="boxCount-left">
                            <div @click="changeBoxCount(1)" :class="{ 'item': true, 'active': 1 == boxCount }">x1</div>
                            <div @click="changeBoxCount(2)" :class="{ 'item': true, 'active': 2 == boxCount }">x2</div>
                            <div @click="changeBoxCount(3)" :class="{ 'item': true, 'active': 3 == boxCount }">x3</div>
                            <div @click="changeBoxCount(4)" :class="{ 'item': true, 'active': 4 == boxCount }">x4</div>
                            <div @click="changeBoxCount(5)" :class="{ 'item': true, 'active': 5 == boxCount }">x5</div>
                        </div>
                        <div @click="openBoxSubmit" class="btn btn-free" v-if="boxDetailData.item?.free == 1">
                            {{ priceUnit() }}0 FREE
                        </div>
                        <div v-else @click="openBoxSubmit" class="btn">
                            <span class="font-15">{{ priceUnit() }} {{ showCoin }}</span>
                            <div class="buy-line"></div>
                            <span class="font-16">{{ $t('box.open') }}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="boxLayout">
                <div class="boxTab">
                    <BaseTab :tabs="[$t('box.boxContains'), $t('box.recentDrops')]" :change-tab="changeTab" />
                </div>
                <div v-if="tabIndex == 0" class="boxGridFather">
                    <div v-show="boxDetailData.goods_list && boxDetailData.goods_list.length > 0" class="boxGrid">
                        <div v-for="(item, index) in boxDetailData.goods_list" class="gridItem" :key="index"
                            :style="{ background: getGoodsBgColor(item.color) }">
                            <LogosIcon class="logos" :color="getGoodsBottomColor(item.color)" />
                            <img class="gun" loading="lazy" decoding="async" :src="getImageUrl(item.goods_image)">
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

                <div v-if="tabIndex == 1" v-show="boxDetailDropped.length > 0" class="boxGrid">
                    <div v-for="(item, index) in boxDetailDropped" class="gridItem card" :key="index"
                        :style="{ background: getGoodsBgColor(item.color) }">
                        <LogosIcon class="logos" :color="getGoodsBottomColor(item.color)" />
                        <img class="gun" loading="lazy" decoding="async" style="flex:0;height: 50%;"
                            :src="getImageUrl(item.goods_image)">

                        <div class="drop-text">
                            <div v-if="getExteriorName(item.exterior)" class="exterior">
                                <span>{{ getExteriorName(item.exterior) }}</span>
                            </div>
                            <div class="name font-14 text-single-line">{{ item.goods_name }}</div>
                            <div class="bottom-box" :style="{ backgroundColor: getGoodsBottomColor(item.color) }"></div>
                        </div>
                        <div class="user">
                            <img loading="lazy" decoding="async" class="avatarsImg" :src="getImageUrl(item.avatar)">
                            <div class="userName">{{ item.nickname }}</div>
                        </div>
                    </div>

                </div>
            </div>
            <Footer />
        </div>
    </div>
    <audio ref="audioRef" src="/image/out.mp3"></audio>
</template>

<script lang="ts" setup name="openBlind">

var id = "";

import Decimal from 'decimal.js';
import { computed, inject, onMounted, reactive, ref, watch } from 'vue';
import { onBeforeRouteUpdate, useRouter } from 'vue-router';
import BaseTab from '../components/BaseTab.vue';
import BoxGoodsGroup from '../components/box/BoxGoodsGroup.vue';
import Footer from '../components/Footer.vue';
import NavSwiper from '../components/NavSwiper.vue';
import RingProgress from '../components/RingProgress.vue';
import useConfig from '../hooks/useConfig.ts';
import useHome from '../hooks/useHome';
import { useUserStore } from '../store/user.ts';
import { showBoxHelpDialog } from '../utils/dialogs.ts';
import { copyText, getExteriorName, getGoodsBgColor, getGoodsBottomColor, getImageUrl, priceUnit, showOpenBoxDialog } from '../utils/index';
const useUser = useUserStore()
const { sound } = useConfig()
const { boxDetailData, getBoxDetail, boxDetailDropped, getBoxDetailDropped, openBox } = useHome()

const router = useRouter()

const boxCount = ref(1)

const tabIndex = ref(0)

const emitter = inject("emitter");

const audioRef = ref(null)

const props = defineProps(['id'])

const giftGoods = reactive<any[]>([])


function back() {
    router.back()
}

function changeTab(index: number) {
    tabIndex.value = index;
}


async function openBoxSubmit() {
    if (boxDetailData != null && boxDetailData.goods_list != null) {
        const result = await openBox(props.id, boxDetailData.item?.box_price, boxCount.value)
        if (result != null) {
            boxDetailData.item.use_total_limit_times = boxDetailData.item.use_total_limit_times + boxCount.value
            //刷新用户币的数据
            emitter.emit('upUserData')
            showOpenBoxDialog(boxDetailData.goods_list, result.data, boxDetailData.item, boxCount.value, showCoin, playAgain, upUserData)
        }
    }
}

function share() {
    let url = window.location.href
    if (useUser.isLogin) {
        url += "?code=" + useUser.userInfo.invite_code
    }
    copyText(url)
}

function showHelp() {
    showBoxHelpDialog()
}

function playAgain() {
    openBoxSubmit()
}

onMounted(() => {
    loadData(props.id)
})

function upUserData() {
    emitter.emit('upUserData')
}

function changeBoxCount(count: number) {
    boxCount.value = count
}

watch(tabIndex, (value) => {
    if (value == 1) {
        getBoxDetailDropped(id)
    } else {
        boxDetailDropped.length = 0
    }
})



function loadData(i: string) {
    id = i;
    getData()
    setTimeout(() => {
        if (sound.value) {
            videoRef.value.play()
        }
    }, 300);
}

onBeforeRouteUpdate(async (to, from) => {
    if (to.params.id !== from.params.id) {
        await loadData(to.params.id)
    }
})

async function getData() {
    boxDetailData.length = 0;
    await getBoxDetail(id)
    if (boxDetailData.goods_list) {
        giftGoods.length = 0
        giftGoods.push(...boxDetailData.goods_list)
    }
    if (sound.value) {
        audioRef.value.play();
    }
}

let showCoin = computed(() => {
    if (boxDetailData.item?.box_price == null) {
        return ''
    }
    let price = Decimal(Number.parseFloat(boxDetailData.item?.box_price))
    return price.mul(Decimal(boxCount.value)).toFixed(2)
})



</script>

<style scoped>
@keyframes box-in {
    0% {
        opacity: 0;
        transform: translateY(-240px);
    }


    to {
        opacity: 1;
        transform: translateY(0);
    }

}

.open-box-layout {
    height: 100%;
    width: 100%;
    overflow: hidden;
    overflow-y: auto;
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: column;
}

.open-box-body {
    flex: 1;
    height: 0;
}


.back {
    display: flex;
    height: 3rem;
    position: relative;
    align-items: center;
    padding-left: 1rem;
    font-size: 0.8rem;
    font-weight: bold;
}

.top-help {
    display: flex;
    align-items: center;
    gap: 1rem;
    position: absolute;
    right: 1rem;
}

.help-box {
    display: flex;
    align-items: center;
    height: 1.83rem;
    width: 4rem;
    background-color: #333A47FF;
    border-radius: 1rem;
}

.help-line {
    height: 61%;
    width: 1px;
    background-color: #FFFFFF26;
}

.help-box-btn {
    flex: 1;
    width: 0;
    display: flex;
    height: 100%;
    cursor: pointer;
    touch-action: none;
    align-items: center;
    justify-content: center;
}

.back-box {
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

.back-btn {
    width: 1rem;
    height: 1rem;
}

.limit-box {
    border-radius: 1rem;
    height: 1.83rem;
    display: flex;
    gap: .4rem;
    color: #FFBF00FF;
    font-size: .8rem;
    font-family: 'din';
    align-items: center;
    border: solid 1px #FFFFFF26;
    padding: 0 .5rem;
    background-color: #171A21FF;
}

.svg-icon {
    width: 1em;
    height: 1em;
    vertical-align: -0.15em;
    fill: currentColor;
    overflow: hidden;
}


.boxShow {
    height: 21rem;
    padding-top: 1rem;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    display: flex;
    justify-content: center;
    text-align: center;
    position: relative;
}


.box-bg {
    position: relative;
    height: 100%;
    width: 100%;
    position: absolute;
}



.box-bg .top-mask {
    position: absolute;
    top: 0;
    height: 60%;
    width: 100%;
    background: linear-gradient(0, #0E101400, #0E1014);
}

.box-bg .bottom-mask {
    position: absolute;
    bottom: 0;
    height: 40%;
    width: 100%;
    background: linear-gradient(180deg, #0E101400, #0E1014);
}

.box-bg img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.box-bg .box-bg-img {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    overflow: hidden;
}

.boxShow .upside {
    height: 21rem;
    z-index: 10;
    position: relative;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
    padding-top: 1.5rem;
}


.scroll {
    overflow: hidden;
    user-select: none;
    height: 150px;
    width: 100%;
}

.scroll::-webkit-scrollbar {
    display: none;
}


.gift-box {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    display: flex;
    overflow: hidden;
    align-items: center;
}


.item-logos {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 0;
    width: 95px;
    height: 95px;
}

.title {
    width: 100%;
    pointer-events: none;
    position: absolute;
    display: flex;
    left: 0;
    align-items: center;
    justify-content: center;
    font-size: 1.08rem;
    color: white;
    font-weight: bold;
}

.boxShow .upside .imgBack {
    width: 31.6rem;
    height: 10.52rem;
    display: flex;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    margin-bottom: 1.5rem;
    margin-top: 1.67rem;
    justify-content: center;
    text-align: center;
    position: relative;
}

.boxShow .upside .imgBack .images {
    width: 12.9rem;
    top: -1.5rem;
    position: relative;
    opacity: 0;
    animation: box-in 500ms ease-in forwards;
}

.flash {
    position: relative;
    transform-origin: 50% 100%;
    animation: flash .9s linear 500ms forwards
}

.flash-scale {
    pointer-events: none;
    animation-delay: 1.2s;
    animation: flash-scale 3.33s linear 1.3s infinite
}

@keyframes flash {
    0% {
        transform: rotate(0)
    }

    14.8% {
        transform: rotate(4deg)
    }

    37% {
        transform: rotate(0)
    }

    59.2% {
        transform: rotate(3deg)
    }

    81.4% {
        transform: rotate(-1deg)
    }

    to {
        transform: rotate(0)
    }
}

@keyframes flash-scale {
    0% {
        transform: translateY(0)
    }

    50% {
        transform: translateY(-15px)
    }

    to {
        transform: translateY(0)
    }
}

.boxShow .upside .imgBack .images .backgroundImage {
    width: 12.9rem;
    height: 12.9rem;
}

.image-b {
    width: 24rem;
    height: 24rem;
    position: absolute;
    left: 50%;
    pointer-events: none;
    transform: translateX(-50%);
    z-index: -1;
    top: -1rem;
}

.boxShow .upside .imgBack .images .imageShow {
    width: 90%;
    position: absolute;
    left: 5%;
    top: 50%;
    transform: translateY(-50%);
}


.boxShow .upside .boxCount {
    display: flex;
    width: fit-content;
    align-items: center;
    margin-top: 0.6rem;
    padding: 0 .2rem;
    gap: 2rem;
    justify-content: center;
    background-color: #1F232CFF;
    border-radius: 2rem;
    height: 2.75rem;
}

.boxCount-left {
    display: flex;
    align-items: center;
    gap: .6rem;
}

.boxShow .upside .boxCount .item {
    font-size: 1rem;
    height: 2.3rem;
    width: 2.3rem;
    border-radius: 2rem;
    font-weight: bold;
    cursor: pointer;
    touch-action: none;
    font-family: 'din';
    background-color: #262B35FF;
    display: flex;
    align-items: center;
    justify-content: center;
}

.boxShow .upside .boxCount .active {
    background-color: #FFBF00FF;
    color: #1A1206FF;
}

.boxShow .upside .boxCount .btn {
    display: flex;
    flex-direction: row;
    cursor: pointer;
    height: 2.416rem;
    width: 8.75rem;
    font-weight: bold;
    justify-content: center;
    align-items: center;
    color: #1A1206FF;
    background-color: #FFBF00FF;
    border-radius: 2rem;
}

.btn-free {
    background-color: #3FB950FF !important;
    color: white !important;
}

.buy-line {
    width: 1px;
    height: 46%;
    margin: 0 .6rem;
    background-color: #333A47FF;
}

.boxLayout {
    display: flex;
    flex-direction: column;
    min-height: calc(100vh - 21rem - 2.71rem - 2rem - var(--window-headerSwiper-height) - var(--window-headerNav-height));
}

.boxGridFather {
    z-index: 3;
    min-height: calc(100vh - var(--window-headerNav-height) - 2.71rem - 20rem);
}

.boxGrid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    box-sizing: border-box;
    gap: .6rem;
    margin: 0 4rem;
    padding: 1rem 0;
    border-radius: 8px;
    row-gap: .6rem;
    align-items: start;
}

.boxTab {
    align-items: center;
    z-index: 2;
    margin-top: 1rem;
    justify-content: center;
    display: flex;
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

.card:hover .gun {
    transform: scale(1.2);
}

.boxGrid .gridItem {
    position: relative;
    width: 100%;
    height: 100%;
    transform: translateY(0);
    transition: all 0.4s ease;
}

.boxGrid .gridItem .user {
    position: absolute;
    width: 100%;
    top: 0;
    align-items: center;
    left: 0;
    display: flex;
    box-sizing: border-box;
}


.boxGrid .gridItem .user .imgBg {
    width: 100%;
    height: auto;
    left: 0;
    top: 0;
    object-fit: cover;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;
}



.boxGrid .gridItem .user .avatarsImg {
    width: .83rem;
    height: .83rem;
    border-radius: 50%;
    object-fit: cover;
    padding: 0.3rem;
}

.boxGrid .gridItem .user .userName {
    color: #EDEFF3FF;
    margin: 0.5rem 0;
    flex: 1;
    overflow: hidden;
    text-align: left;
    padding: 0 .33rem;
    text-overflow: ellipsis;
    white-space: nowrap;
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

.boxGrid .gridItem .gun {
    flex: 1;
    height: 0;
    z-index: 1;
    object-fit: contain;
    transition: all 0.4s ease;
}

.exterior {
    display: flex;
    width: 100%;
    padding-left: .33rem;
    box-sizing: border-box;
    justify-content: start;
}

.exterior span {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 0.7rem;
    border-radius: .7rem;
    font-size: .5rem;
    width: 1.33rem;
    font-weight: bold;
    background-color: #FFFFFF4D;
    border: solid 1px #FFFFFF26;
    backdrop-filter: blur(16);
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

.drop-text {
    position: absolute;
    display: flex;
    flex-direction: column;
    bottom: 0;
    width: 100%;
    align-items: center;
    justify-content: center;
}

.drop-text .name {
    width: 100%;
    padding: 0 .33rem;
    margin-top: .15rem;
    box-sizing: border-box;
    text-align: left;
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
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    }
}

@media screen and (max-width:1450px) {
    .boxGrid {
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    }
}

@media screen and (max-width:1200px) {
    .boxGrid {
        grid-template-columns: 1fr 1fr 1fr 1fr;
    }
}

@media screen and (max-width:995px) {

    .back {
        height: 3rem;
        font-size: 1.08rem;
    }


    .boxGrid {
        margin: 0 1rem;
        grid-template-columns: 1fr 1fr;
    }

    .boxGrid .gridItem .text {
        font-size: 1.08rem;
    }

    .boxGrid .gridItem .text .name {
        font-size: 1rem;
    }

    .boxShow .upside .boxCount .item {
        font-size: 1rem;
        height: 2.3rem;
        width: 2.3rem;
    }

    .boxShow .upside .boxCount {
        flex-direction: column;
        height: fit-content;
        background-color: transparent;
    }

    .boxCount-left {
        gap: 8px;
    }

    .boxShow .upside .boxCount .item {
        width: 40px;
        height: 40px;
        font-size: 14px;
    }

    .boxShow .upside .boxCount .btn {
        height: 44px;
        width: 240px;
        margin: 0;
        flex-shrink: 0;
        border-radius: 2rem;
        border: 1.5px solid rgb(255, 198, 0);
        font-weight: bold;
    }


    .boxTab {
        flex-direction: column;
        height: auto;
        border: none;
        padding: 0;
    }



}

@media screen and (min-width:1701px) {
    .boxGrid {
        grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    }
}
</style>