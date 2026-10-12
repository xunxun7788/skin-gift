<template>
    <div v-show="lastBoxList.length > 0" class="nav-swiper">
        <transition-group tag="ul" class="right" name="item">
            <li v-for="(item, _) in lastBoxList" :key="item">
                <div v-on:click="OpenBlind(item.box_id)" class="item">
                    <div @mouseenter="onEnter" @mouseleave="onLeave" class="cardItem">
                        <div class="swiperContent">
                            <div class="skins">
                                <div class="card cardTop" :style="{ background: getGoodsBgColor(item.box_color) }">
                                    <logos-icon class="logos" :color="getGoodsBottomColor(item.box_color)" />
                                    <img loading="lazy" decoding="async" class="gun"
                                        :src="getImageUrl(item.goods_image)">
                                    <div class="text font-12 text-single-line">
                                        {{ item.goods_name }}
                                    </div>
                                    <div class="bottom"
                                        :style="{ backgroundColor: getGoodsBottomColor(item.box_color) }">
                                    </div>
                                </div>
                            </div>
                            <div class="user">
                                <img class="box-image" loading="lazy" decoding="async"
                                    :src="getImageUrl(item.box_image)" alt="">
                                <div class="card">
                                    <div class="carBottom">
                                        <img class="avatarsImg" :src="$cdnUrl + item.avatar">
                                        <div class="userName font-12">{{ item.nickname }}</div>
                                    </div>
                                    <div class="btn go font-12">
                                        <span class="text-single-line">
                                            {{ item.box_name }}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </li>
        </transition-group>
    </div>

</template>

<script lang="ts" setup name="NavSwiper">
import { onMounted, onUnmounted, reactive } from 'vue';
import useHome from '../hooks/useHome';
import router from '../router/index.ts';
import { getGoodsBgColor, getGoodsBottomColor, getImageUrl, shuffleArrayFisherYates } from '../utils';
import LogosIcon from './icons/LogosIcon.vue';

let timeOutId = 0;
let timeOutGoodsId = 0
const { getHomeHistory } = useHome()

const lastBoxList = reactive<any[]>([]);

let tempList = <any>[]

let baseList = <any>[]

function startTimer() {
    clearTimeout(timeOutId)
    const t = Math.random() * 56 + 4
    timeOutId = setTimeout(() => {
        getData()
    }, t * 1000);
}

onMounted(() => {
    getData()
})

async function getData() {
    const result = await getHomeHistory()
    if (result) {
        const code = result.data.code
        if (code == 1 && result.data.data) {
            //开始 随机插入数据
            baseList = result.data.data
            tempList = shuffleArrayFisherYates(baseList)
            //默认加载
            Object.assign(lastBoxList, baseList)
        }
    }
    startGoodsTimer()
    startTimer()
}

const onEnter = () => {
    clearTimeout(timeOutId)
    clearTimeout(timeOutGoodsId)
}
const onLeave = () => {
    startGoodsTimer()
    startTimer()
}


function OpenBlind(id: string) {
    router.push({
        name: 'boxDetail',
        params: {
            id: id
        }
    })
}

function startGoodsTimer() {
    clearTimeout(timeOutGoodsId)
    const t = Math.random() * 4 + 2
    timeOutGoodsId = setTimeout(() => {
        if (tempList.length == 0) {
            tempList = shuffleArrayFisherYates(baseList)
        }
        const n = Math.ceil(Math.random() * 2 + 1)
        const d = tempList.splice(0, n)
        lastBoxList.splice(lastBoxList.length - 1 - d.length, d.length)
        setTimeout(() => {
            lastBoxList.splice(0, 0, ...d)
        }, 100);
        startGoodsTimer()
    }, t * 1000);
}

onUnmounted(() => {
    clearTimeout(timeOutId)
    clearTimeout(timeOutGoodsId)
})

</script>

<style scoped>
.nav-swiper {
    height: var(--window-headerSwiper-height);
    width: 100%;
    overflow: hidden;
    display: flex;
    flex-shrink: 0;
    z-index: 4;
    margin-top: .87rem;
    margin-bottom: 0.17rem;
    box-sizing: border-box;
    text-transform: none;
}

.nav-swiper::before {
    z-index: 7;
    content: "";
    pointer-events: none;
    background: linear-gradient(90deg, #0E101400 -4.17%, #0E1014 97.59%);
    width: 5rem;
    height: 5.67rem;
    position: absolute;
    top: 0;
    right: -2px;
}

.cardItem {
    position: relative;
    overflow: hidden;
    cursor: pointer;
    width: 100%;
    height: 100%;

}



.cardItem:hover .logos {
    transform: translateY(-50%) translateX(-50%) scale(.9);
    opacity: 0;
}

.logos {
    position: absolute;
    transform: translateY(-50%) translateX(-50%);
    transform-origin: center center;
    top: 50%;
    left: 50%;
    opacity: .2;
    width: 3.5rem;
    height: 2.4rem;
    transition: all .3s ease;
}



.cardItem .swiperContent {
    transition: transform 0.5s ease;
    overflow: hidden;
}

.cardItem .swiperContent .skins {
    position: relative;
    text-align: center;
}

.cardItem .swiperContent .user {
    position: absolute;
    top: 0;
    left: 0;
}


.nav-swiper .right .card {
    width: 5.83rem;
    height: 4.67rem;
    border-radius: .5rem;
    text-align: center;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;
    box-sizing: border-box;
}

.cardItem:hover .swiperContent .skins .card .gun {
    transform: translate(-50%, -65%) scale(.9);
    opacity: 0;
}

.nav-swiper .right .card .gun {
    height: 3rem;
    position: absolute;
    top: 50%;
    left: 50%;
    object-fit: contain;
    transform: translate(-50%, -50%);
    transition: all .3s ease;
}

.cardItem:hover .swiperContent .skins .card .text {
    transform: translateY(30%);
    opacity: 0;
}

.nav-swiper .right .card .text {
    position: absolute;
    bottom: 0.46rem;
    width: calc(100% - .66rem);
    box-sizing: border-box;
    transition: all .3s ease;
}




.cardItem:hover .bottom {
    transform: translateX(-50%) translateY(100%);
    opacity: 0;
}

.bottom {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    border-top-left-radius: .2rem;
    border-top-right-radius: .2rem;
    width: 57%;
    height: .167rem;
    transition: all .3s ease;
}


.nav-swiper .right .cardTop {
    padding: 0 0.33rem;
}


.cardItem:hover .carBottom {
    transform: translateY(0) scale(1);
    opacity: 1;
}

.carBottom {
    display: flex;
    align-items: center;
    transform: translateY(-20%) scale(.8);
    opacity: 0;
    gap: .167rem;
    padding: .33rem;
    transition: all .3s ease;
}

.nav-swiper .right .card .avatarsImg {
    height: 1.25rem;
    width: 1.25rem;
    object-fit: cover;
    border-radius: 50%;
}

.nav-swiper .right .card .userName {
    color: #EDEFF3FF;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    -webkit-text-overflow: ellipsis;
}


.right {
    display: flex;
    flex-grow: 1;
}

.nav-swiper .right .item {
    width: 5.83rem;
    height: 100%;
    aspect-ratio: 83 / 126;
    margin: 0 0.1rem;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 100% 100%;
}

.go {
    position: absolute;
    height: 1.25rem;
    margin: .33rem;
    bottom: 0;
    left: 0;
    box-sizing: border-box;
    padding: 0 .33rem;
    opacity: 0;
    background: rgba(255, 255, 255, 0.15);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    display: flex;
    align-items: center;
    justify-content: center;
    transform: translateY(-20%);
    width: calc(100% - .66rem);
    border: solid 1px #FFFFFF4D;
    border-radius: 1rem;
    transition: all .3s ease;
}

.cardItem:hover .box-image {
    transform: translateX(20%);
    opacity: 1;
}

.box-image {
    position: absolute;
    right: 0;
    bottom: 0;
    opacity: 0;
    transform: translateX(30%);
    object-fit: cover;
    height: 3.68rem;
    transition: all .3s ease;
}

.cardItem:hover .go {
    opacity: 1;
    transform: translateY(0);
}

.item-enter-from,
.item-leave-to {
    width: 0;
    opacity: 0;
}

.item-enter-to {
    width: 5.83rem;
    margin-right: 0.1rem;
}


.item-enter-active,
.item-leave-active {
    transition: all 0.5s ease;
}



ul {
    list-style: none;
}


@media screen and (max-width:995px) {
    .nav-swiper .right .card .avatarsImg {
        height: 25px;
        width: 25px;
    }
}
</style>