<template>
    <transition name="mask" @after-enter="finishEnter" @before-leave="beforeLeave">
        <div v-show="isShow" :class="{ 'mask': true, 'mask-bg': mask }">
            <transition name="layout" @after-enter="layoutAfterEnter">
                <div v-show="isShow" class="layout">
                    <div class="title">{{ $t('box.opening') }}</div>
                    <div class="icon-top">
                        <div class="iconl"></div>
                        <div class="iconc"></div>
                        <div class="iconr"></div>
                    </div>
                    <div class="scroll-layout" :style="{ top: `${(x.count - 1) * 5 / 2}px` }">
                        <div v-for="item in count" :key="item" class="move-box"
                            :style="{ top: `-${(item - 1) * 5}px` }">
                            <InfiniteList class="scroll" :data="data" :overscanCount="15"
                                :scrollOffset="scrollOffset[item - 1].value" scrollDirection="horizontal"
                                :width="'100%'" :itemSize="itemWidth" v-slot="{ item_, index }">
                                <div class="item-box"
                                    :style="{ background: getGoodsBgColor(getItemData(item, index, item - 1).color) }">
                                    <div class="item-logos" :style="{
                                        background: `radial-gradient(circle, ${getGoodsBottomColor(getItemData(item, index, item - 1).color, '33')} 0%, ${getGoodsBottomColor(getItemData(item, index, item - 1).color, '00')} 65%)`
                                    }">
                                        <LogosIcon style="width: 100%;height: 60%;"
                                            :color="getGoodsBottomColor(getItemData(item, index, item - 1).color, '55')" />
                                    </div>
                                    <div class="bottom-box"
                                        :style="{ backgroundColor: getGoodsBottomColor(getItemData(item, index, item - 1).color) }">
                                    </div>
                                    <img class="item-img"
                                        :src="getImageUrl(getItemData(item, index, item - 1).goods_image)">
                                </div>
                            </InfiniteList>
                        </div>
                    </div>
                    <div class="icon-bottom">
                        <div class="iconc iconcb"></div>
                    </div>
                    <div class="line">
                    </div>
                </div>
            </transition>

            <div class="scroll-mask">
            </div>
        </div>

    </transition>
    <audio controls ref="audioRef">
        <source src="../assets/audio/box_anim_s.mp3" type="audio/mpeg">
    </audio>

</template>


<script lang="ts" setup name="OpenBoxLayout">
import gsap from 'gsap';
import CustomEase from 'gsap/CustomEase';
import { onBeforeMount, onMounted, onUnmounted, ref } from 'vue';
import InfiniteList from 'vue3-infinite-list';

gsap.registerPlugin(CustomEase);

import useConfig from '../hooks/useConfig.ts';
import { getGoodsBgColor, getGoodsBottomColor, getImageUrl, showOpenBoxResultDialog, shuffleArrayFisherYates } from '../utils';
import LogosIcon from './icons/LogosIcon.vue';
const { sound } = useConfig()
const x = defineProps(['close', 'dataList', 'count', 'resultData', 'boxData', 'showPrice', 'playAgain', 'upUserData'])

const itemWidth = ref(195)

const resultIndex = 50

const data = Array.from({ length: 200 }, (_, i) => `Item ${i + 1}`)

let cacheDataList: any[] = [
    [], [], [], [], []
]

let isShow = ref(false)

const mask = ref(false)

let finishAnimaCount = 0

const audioRef = ref(null)

const tweenRef = ref<any>(null)

let scrollOffset = [
    ref(0), ref(0), ref(0), ref(0), ref(0)
]

//记录每个结果的结束位置，防止用户改变窗口大小后的结果重新随机位置
let scrollOffsetEnds = [
    0, 0, 0, 0, 0
]

let timeId = [
    0, 0, 0, 0, 0
]

let stimeId = 0

let resultList: object[] = []

onBeforeMount(() => {
    if (window.innerWidth <= 995) {
        itemWidth.value = itemWidth.value * 0.6
    }
})

onMounted(() => {
    //找出所有的结果的对象
    x.resultData.data.goods_id.forEach(e1 => {
        x.dataList.forEach(e2 => {
            if (e1 == e2.id) {
                resultList.push(e2)
            }
        });
    });
    isShow.value = true
})

onUnmounted(() => {
    window.removeEventListener('resize', handleResize)
})

function handleResize() {
    startAnimaGroup()
}

function layoutAfterEnter() {
    startAnimaGroup()
    //监听窗口大小变化，如果变化 需要重新开始动画
    window.addEventListener('resize', handleResize)
}

function finishEnter() {
    mask.value = true
}

function beforeLeave() {
    mask.value = false
}

function reset() {
    if (tweenRef.value) {
        tweenRef.value?.kill()
    }
    finishAnimaCount = 0
    for (let index = 0; index < scrollOffset.length; index++) {
        const element = scrollOffset[index];
        element.value = 0
    }
    for (let index = 0; index < timeId.length; index++) {
        const element = timeId[index];
        clearTimeout(element)
    }
    clearTimeout(stimeId)
}

function startAnimaGroup() {
    reset()
    for (let index = 0; index < x.count; index++) {
        timeId[index] = setTimeout(() => {
            startAnima(index)
        }, 200 * (index + 1));
    }
}

function startAnima(index: number) {
    if (sound.value) {
        audioRef.value.play()
    }
    const ease = CustomEase.create("custom", "M0,0 C0.064,0.038 0.076,0.056 0.097,0.076 0.122,0.101 0.132,0.11 0.157,0.157 0.261,0.358 0.324,0.662 0.36,0.722 0.409,0.804 0.374,1 1,1 ");
    let randX = 0
    if (scrollOffsetEnds[index] == 0) {
        //结果随机位置  最小20
        const randL = 8 + Math.random() * (60)
        const randR = itemWidth.value - 8 - Math.random() * (60)
        randX = Math.random() > 0.5 ? randR : randL
        scrollOffsetEnds[index] = randX
    } else {
        randX = scrollOffsetEnds[index]
    }
    const endX = resultIndex * itemWidth.value - window.innerWidth / 2 + randX
    const isFinishAnima = finishAnimaCount >= x.count
    tweenRef.value = gsap.to(scrollOffset[index], {
        duration: isFinishAnima ? 0.1 : 6, value: endX, ease: isFinishAnima ? 'none' : ease, onComplete() {
            finishAnimaCount++
            if (finishAnimaCount >= x.count) {
                showResultDialog()
            }
        }
    })
}

function showResultDialog() {
    stimeId = setTimeout(() => {
        x.close()
        showOpenBoxResultDialog(resultList, x.resultData.data.user_bag, x.boxData, x.showPrice, x.playAgain, x.upUserData)
    }, 1000);
}

let tempList: any[] = []

function getItemData(boxIndex: number, index: number, moveIndex: number) {
    boxIndex = boxIndex - 1;
    if (cacheDataList[boxIndex].length <= index) {
        if (tempList.length == 0) {
            tempList = shuffleArrayFisherYates(Array.from(x.dataList))
        }
        const model = tempList.shift()
        cacheDataList[boxIndex][index] = model
    }
    if (index == resultIndex) {
        return resultList[moveIndex]
    }
    return cacheDataList[boxIndex][index]
}

</script>

<style scoped>
.mask-enter-from,
.mask-leave-to {
    background-color: #00000000;
}

.mask-enter-to {
    background-color: #00000088;
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
    background-color: #00000088;
}

.mask .layout {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    justify-content: center;
}

.scroll-mask {
    position: fixed;
    width: 100%;
    height: 100%;
    background-color: transparent;
    touch-action: none;
    z-index: 1;
}

.layout .title {
    font-size: 28px;
    font-weight: bold;
    background: linear-gradient(180deg, white, #ffbf00);
    -webkit-background-clip: text;
    color: transparent;
    position: absolute;
    top: -20px;
    left: 50%;
    margin-bottom: 20px;
    transform: translateX(-50%) translateY(-100%);
}

.icon-bottom {
    display: flex;
    position: relative;
    align-items: center;
    margin-top: 2px;
    justify-content: center;
    width: 100%;
    height: 30px;
}

.icon-top {
    display: flex;
    position: relative;
    align-items: center;
    margin-bottom: 2px;
    justify-content: center;
    width: 100%;
    height: 30px;
}



.iconc {
    background: url('/image/b_pointer.svg') no-repeat;
    background-position: center;
    background-size: 100% 100%;
    height: 30px;
    width: 25px;
}

.iconcb {
    transform: scaleY(-1);
}

.scroll-layout {
    position: relative;
    display: flex;
    width: 100%;
    flex-direction: column;
}

.mask .layout .move-box {
    width: 100%;
    height: 150px;
    position: relative;
}

.line {
    background-color: white;
    width: 2px;
    height: calc(100% - 64px);
    position: absolute;
    border-radius: 12px;
    box-shadow: 0px 0 6px #ffbf00cc, 0px 0 4px #ffbf00, 0px 0 2px #ffbf00;
}

.mask .layout .move-box .scroll {
    overflow: hidden;
    user-select: none;
    background-color: #0E1014FF;
    height: 150px;
}

.mask .layout .move-box .scroll::-webkit-scrollbar {
    display: none;
    /* Chrome, Safari, Opera*/
}

.mask .layout .move-box .scroll {
    -ms-overflow-style: none;
    /* IE and Edge */
    scrollbar-width: none;
    /* Firefox */
}

.item-box {
    margin-right: 5px;
    height: 140px;
    margin-top: 5px;
    width: 190px;
    background-color: #171A21FF;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
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

.bottom-box {
    position: absolute;
    bottom: 5px;
    height: .167rem;
    width: 48%;
    margin-top: .3rem;
    border-top-right-radius: .2rem;
    border-top-left-radius: .2rem;
}


.item-box .item-img {
    height: 80%;
    z-index: 1;
}

@media screen and (max-width:995px) {
    .item-box {
        width: 114px;
        height: 84px;
    }

    .mask .layout .move-box {
        width: 100%;
        height: 90px;
        position: relative;
        background-color: #000000;
    }

    .mask .layout .move-box .scroll {
        height: 90px;
    }
}
</style>