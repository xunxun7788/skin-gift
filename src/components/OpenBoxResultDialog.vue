<template>
    <transition name="mask" @after-enter="finishEnter" @before-leave="beforeLeave" @after-leave="afterLeave">
        <div v-show="isShow" :class="{ 'mask': true, 'mask-bg': mask }">
            <transition name="layout">
                <div v-show="isShow" class="layout">
                    <div @click="close_" class="icon-close">
                        <close-icon class="icon-close-x" />
                    </div>
                    <div class="title-layout">
                        <div class="title title-a">{{ $t('home.winner') }}</div>
                        <div class="title">{{ $t('home.winner') }}</div>
                    </div>
                    <div class="content">
                        <div v-for="(item, index) in resultData" :key="index" class="box"
                            :style="{ background: getGoodsBgColor(item.color) }">
                            <LogosIcon class="logos" :color="getGoodsBottomColor(item.color)" />
                            <img class="gun" :src="getImageUrl(item.goods_image)">
                            <div v-if="getExteriorName(item.exterior)" class="exterior">
                                <span>{{ getExteriorName(item.exterior) }}</span>
                            </div>
                            <div class="text">
                                <div class="name">{{ item.goods_name }}</div>
                                <div class="price">
                                    {{ priceUnit() }} {{ item.show_price }}
                                </div>
                            </div>
                            <div class="bottom-box" :style="{ backgroundColor: getGoodsBottomColor(item.color) }"></div>
                            <img @click="selectArr[index] = !selectArr[index]"
                                style="position: absolute;top:4px;left: 4px;cursor: pointer;z-index: 1;"
                                :src="`/image/cb_${selectArr[index] ? 'on' : 'off'}.svg`">
                        </div>
                    </div>

                    <div class="action">
                        <div @click="resoleGoodsSubmit" class="action-btn1">
                            <span>{{ getResoleTitle() }}</span>
                            <span class="show-coin">{{ priceUnit() }} {{
                                showCoin }}</span>
                        </div>
                        <div v-if="showPrice != null" @click="openAgain" class="action-btn">
                            <span>{{ $t('box.openAgain') }}</span>
                            <span class="show-coin">{{ priceUnit() }} {{ showPrice }}</span>
                        </div>

                    </div>
                </div>
            </transition>
        </div>
    </transition>
    <audio controls ref="audioRef">
        <source src="../assets/audio/box_open.mp3" type="audio/mpeg">
    </audio>

</template>

<script lang="ts" setup>
const { t } = useI18n()
import Decimal from 'decimal.js';
import { computed, nextTick, onBeforeMount, onMounted, reactive, ref } from 'vue';
import useConfig from '../hooks/useConfig.ts';
import useHome from '../hooks/useHome';
import { getExteriorName, getGoodsBgColor, getGoodsBottomColor, getImageUrl, priceUnit } from '../utils';
import LogosIcon from './icons/LogosIcon.vue';
import CloseIcon from './icons/main/CloseIcon.vue';
const { sound } = useConfig()
const { resoleGoods } = useHome()

const x = defineProps(['close', 'resultData', 'boxData', 'showPrice', 'playAgain', 'upUserData', 'resultBagIds'])

const isShow = ref(false)

const mask = ref(false)

const selectArr: boolean[] = reactive([])

let isPlayAgain = false

const audioRef = ref(null)

onBeforeMount(() => {
    //默认是选中的状态
    for (let index = 0; index < x.resultData.length; index++) {
        selectArr.push(true)
    }
})

onMounted(() => {
    isShow.value = true
    nextTick(() => {
        if (sound.value) {
            audioRef.value.play()
        }
    })
})

function finishEnter() {
    mask.value = true
}

function beforeLeave() {
    mask.value = false
}

function afterLeave() {
    x.close()
    if (x.showPrice == null) {
        x.playAgain()
    } else {
        if (isPlayAgain) {
            x.playAgain()
        }
    }
}

function close_() {
    isShow.value = false
}

function openAgain() {
    isPlayAgain = true
    close_()
}

function getResoleTitle() {
    let count = 0
    for (let index = 0; index < selectArr.length; index++) {
        if (selectArr[index]) {
            count++
        }
    }
    if (count == x.resultData.length) {
        return t('box.decomposeAll')
    } else {
        return t('box.decompose')
    }
}

async function resoleGoodsSubmit() {
    let ids = ""
    for (let index = 0; index < selectArr.length; index++) {
        if (selectArr[index]) {
            ids += x.resultBagIds[index] + ","
        }
    }
    if (ids.length > 0) {
        ids = ids.substring(0, ids.length - 1)
    } else {
        return
    }
    const result = await resoleGoods(ids)
    if (result != null) {
        if (x.upUserData) {
            x.upUserData()
        }
        close_()
    }
}


let showCoin = computed(() => {
    let t = Decimal(0)
    for (let index = 0; index < selectArr.length; index++) {
        if (selectArr[index]) {
            const a = Number.parseFloat(x.resultData[index].show_price);
            t = t.add(Decimal(a))
        }
    }
    return t
})

</script>

<style scoped>
.mask-enter-from,
.mask-leave-to {
    background-color: #00000000;
}

.mask-enter-to {
    background-color: #000000cc;
}

.mask-enter-active,
.mask-leave-active {
    transition: background-color 0.3s linear;
}

.layout-enter-from,
.layout-leave-to {
    transform: scale(0);
}

.layout-enter-active,
.layout-leave-active {
    transition: all 0.3s ease;
}

.mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 103;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

.mask-bg {
    background-color: #000000cc;
}

.mask .layout {
    position: relative;
    width: 680px;
    aspect-ratio: 68 / 55;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: url('/image/box_r_bg.png') no-repeat;
    background-position: center;
    background-size: cover;
}

.title-layout {
    position: relative;
    height: 52px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.title {
    position: relative;
    font-size: 32px;
    z-index: 1;
    font-weight: bold;
    background: linear-gradient(180deg, #ffffffff 0.44%, #ffe100ff 103.75%);
    -webkit-background-clip: text !important;
    -webkit-text-fill-color: transparent;
}

.title-a {
    position: absolute;
    top: 2px;
    left: 0;
    z-index: 0;
    display: flex;
    align-items: center;
    background: #FF5C00FF;
    width: 100%;
    height: 100%;
    filter: blur(2px);
}

.icon-close {
    position: absolute;
    right: 0;
    top: 0;
    height: 44px;
    display: flex;
    padding: 0 15px;
    align-items: center;
    cursor: pointer;
}

.icon-close-x {
    width: 20px;
    height: 20px;
}

.content {
    flex: 1;
    height: 0;
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-top: 10px;
    justify-content: center;
    align-content: center;
    align-items: center;
}

.box {
    display: flex;
    flex-direction: column;
    width: 183px;
    padding: 0 .33rem;
    align-items: center;
    border-radius: 8px;
    aspect-ratio: 183 / 146;
    position: relative;
}

.bottom-box {
    height: .167rem;
    width: 48%;
    margin-top: .3rem;
    border-top-right-radius: .2rem;
    border-top-left-radius: .2rem;
}

.action {
    display: flex;
    height: 66px;
    width: 100%;
    gap: 40px;
    padding: 0 90px;
    box-sizing: border-box;
    margin-bottom: 40px;
    font-weight: bold;
    justify-content: center;
    align-items: center;
}



.action-btn {
    height: 100%;
    flex: 1;
    font-size: 18px;
    display: flex;
    gap: 4px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
    cursor: pointer;
    color: #1A1206FF;
    background-color: #FFBF00FF;
    border-radius: 40px;
}


.action-btn1 {
    height: 100%;
    flex: 1;
    gap: 4px;
    cursor: pointer;
    display: flex;
    color: #EDEFF3FF;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 40px;
    background-color: #6B7280FF;
}

.show-coin {
    font-family: din;
    font-size: 15px;
    font-weight: bold;
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


.gun {
    flex: 1;
    height: 0;
    z-index: 1;
    object-fit: contain;
    transition: all 0.4s ease;
}

.exterior {
    display: flex;
    width: 100%;
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


.box:hover .gun {
    transform: scale(1.2);
}

.text {
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

.text .name {
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



.text .coin {
    text-align: left;
    font-size: 0.6rem;
    font-weight: bold;
    background: linear-gradient(180deg, white, #ffbf00);
    -webkit-background-clip: text;
    color: transparent;
}

/* @media screen and (max-width: 995px) {

    .box {
        width: 30%;
    }

    .action {
        height: 10%;
        margin-bottom: 4%;
    }

    .content {
        width: 100%;
    }

    .mask .layout {
        width: 80%;
    }
} */

/* @media screen and (max-width:995px) {
    .box {
        width: 30vw;
        margin: 0.2rem;
    }

    .icon-close {
        position: absolute;
        right: 0.5rem;
        top: 30%;
        width: 2rem;
        height: 2rem;
        cursor: pointer;
    }

    .icon-close-x {
        width: 1.5rem;
        height: 1.5rem;
    }

    .text .name {
        font-size: 0.8rem;
    }

    .text .coin {
        font-size: 0.8rem;
    }

    .action {
        height: 2.6rem;
    }

    .action-btn {
        font-size: 1rem;
        width: 9rem;
    }

    .price {
        font-size: 0.9rem;
        font-family: din;
    }

    .action-btn1 {
        width: 9rem;
        font-size: 1rem;
    }

    .show-coin {
        font-size: 0.9rem;
    }

    .action-bag {
        height: 2.5rem;
        padding: 0 1.5rem;
        font-size: 1rem;
    }

} */
</style>