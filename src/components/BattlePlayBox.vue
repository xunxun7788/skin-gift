<template>
    <div v-if="goodsDataList.length > 0 && isShow" class="layout">
        <div class="move-box">
            <InfiniteList class="scroll" :height="250" :data="data" :overscanCount="10" :scrollOffset="scrollOffset"
                :width="'100%'" :itemSize="itemWidth" v-slot="{ item_, index }">
                <div class="item-box">
                    <div :style="{ background: getGoodsBgColor(getItemData(index).color) }" class="item-box-cell">
                        <img class="item-img" :src="getImageUrl(getItemData(index).image)">
                    </div>
                </div>
            </InfiniteList>
        </div>
        <div style="position: absolute;top: 0;left: 0;width: 100%;height: 100%;"></div>
    </div>
    <audio v-show="false" controls ref="audioRef">
        <source src="../assets/audio/box_anim_s.mp3" type="audio/mpeg">
    </audio>
</template>

<script lang="ts" setup>
import gsap from 'gsap';
import CustomEase from 'gsap/CustomEase';
import { inject, onMounted, ref } from 'vue';
import InfiniteList from 'vue3-infinite-list';
import useConfig from '../hooks/useConfig';
import { getGoodsBgColor, getImageUrl, shuffleArrayFisherYates } from '../utils';
const { sound } = useConfig()

gsap.registerPlugin(CustomEase)

const x = defineProps(['user_id', 'isShow'])

const itemWidth = 130

const audioRef = ref(null)

const data = Array.from({ length: 200 }, (_, i) => i)

let scrollOffset = ref(0)

let cacheDataList = []

let tempList = []

const resultIndex = 50

let resultData;

const emitter = inject("emitter");

let goodsDataList = []

onMounted(() => {
    emitter.on('startBattleBoxAnima', (data) => {
        if (data.user_id == x.user_id) {
            goodsDataList = data.goods_info
            cacheDataList = []
            tempList = []
            scrollOffset.value = 0
            resultData = data.result_goods
            const callBack = data.callBack
            startMoveAnima(callBack)
        }
    });
})

function startMoveAnima(callBack) {
    setTimeout(() => {
        startAnima(callBack)
    }, 10);
}

function getItemData(index: number) {
    if (cacheDataList.length <= index) {
        if (tempList.length == 0) {
            //打乱顺序后赋值
            tempList = shuffleArrayFisherYates(Array.from(goodsDataList))
        }
        const model = tempList.shift()
        cacheDataList[index] = model
    }
    if (index == resultIndex) {
        //要显示结果的那一个,找到结果的
        return resultData
    }
    return cacheDataList[index]
}

function startAnima(callBack) {
    if (sound.value) {
        audioRef.value.play()
    }
    const ease = CustomEase.create("custom", "M0,0 C0.064,0.038 0.076,0.056 0.097,0.076 0.122,0.101 0.132,0.11 0.157,0.157 0.261,0.358 0.324,0.662 0.36,0.722 0.409,0.804 0.374,1 1,1 ");
    const endX = resultIndex * itemWidth - 130 / 2
    gsap.to(scrollOffset, {
        duration: 4, value: endX, ease: ease, onComplete() {
            audioRef.value.pause()
            audioRef.value.currentTime = 0
            //显示结果
            callBack()
        }
    })
}


</script>

<style scoped>
.layout {
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0;
    top: 0;
}

.move-box {
    width: 100%;
    height: 100%;
    position: relative;
    overflow-y: auto;
}

.scroll {
    height: 250px;
}

.item-box {
    height: 130px;
    width: 100%;
    display: flex;
    padding: 0.05rem 0;
    box-sizing: border-box;
    align-items: center;
    justify-content: center;
}

.item-box-cell {
    width: 60%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.item-img {
    width: 80%;
    height: 100%;
    object-fit: contain;
}
</style>