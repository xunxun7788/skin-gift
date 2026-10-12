<template>
    <div id="box-layout" class="box-layout">
        <NavSwiper />
        <BoxBanner />
        <div v-show="Object.keys(homeBoxData).length > 0" class="positionSticky" id="positionSticky">
            <div v-for="(_, key, index) in homeBoxData" :key="key" @click="changePositionIndex(index)"
                :class="{ 'positionItem': true, 'active': positionStickyIndex == index }">
                <a href="javascript:void(0)">{{ key }}</a>
            </div>
        </div>
        <div style="flex: 1;">
            <div class="homeContent">
                <div v-for="(value, key, index) in homeBoxData" class="typeBox" :id="(index + 1) + ''" :key="key">
                    <div v-if="!(value.image)" class="title">
                        <span>{{ key }}</span>
                    </div>
                    <div v-else class="title-img">
                        <img :src="getImageUrl(value.image)" alt="">
                    </div>
                    <div class="boxContent">
                        <div class="blindBox" @mouseenter="handlerMouseover"
                            :style="{ opacity: (item.use_total_limit_times >= item.total_limit_times && item.is_limit) ? .5 : 1 }"
                            v-for="(item, index) in value.list" @click="OpenBlind(item.id)" :key="index">
                            <div class="skin-layout">
                                <img class="skinBg" lazy="loaded" :src="$cdnUrl + item.box_image">
                                <div v-if="item.is_limit" class="ring">
                                    <RingProgress :strokeWidth="18"
                                        :percent="item.use_total_limit_times / item.total_limit_times * 100" :size="20"
                                        color="#FFBF00FF" />
                                    <span v-if="item.use_total_limit_times >= item.total_limit_times">{{
                                        $t('box.soldOut')
                                    }}</span>
                                    <span v-else-if="useUser.isLogin">{{
                                        item.use_total_limit_times
                                        }}</span>
                                </div>

                                <div v-if="item.is_new" class="new">
                                    NEW
                                </div>
                            </div>
                            <div class="skinName">{{ item.box_name }}</div>
                            <div class="price" :class="{ 'price-free': item.free }">
                                <span v-if="!item.free">{{ priceUnit() }} {{ item.price }}</span>
                                <span v-else>
                                    {{ priceUnit() }}0 FREE
                                </span>
                            </div>
                            <div v-on:click="showFreeHelp" class="free-tip btn" v-if="item.free_tip == 2">
                                <img src="/image/help.svg" alt="">
                            </div>
                            <div class="free-tip-help">
                                {{ $t('home.freeTips') }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
    </div>
</template>

<script setup lang="ts">
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import BoxBanner from '../components/box/BoxBanner.vue';
import Footer from '../components/Footer.vue';
import NavSwiper from '../components/NavSwiper.vue';
import RingProgress from '../components/RingProgress.vue';
import useHome from '../hooks/useHome';
import { useUserStore } from '../store/user';
import { getImageUrl, priceUnit, showLoginDialog } from '../utils';
import { showPopupDialog } from '../utils/dialogs.ts';


const useUser = useUserStore()

const router = useRouter()

const route = useRoute()


let { homeBoxData, homeLoadState, homeEmptyText, bannerList, getHomeBox, getBannerData } = useHome()

const modules = [Pagination, Autoplay];

let positionStickyIndex = ref(0)

defineOptions({
    name: "Box"
})

function changePositionIndex(index: number) {
    positionStickyIndex.value = index
    scrollToAnchor((index + 1) + '')
}

function jumpTo(item: any) {
    if (item.action) {
        switch (item.action) {
            case 'inner':
                router.push({
                    name: item.action_url
                })
                break;
            case 'outer':
                window.open(item.action_url)
                break;
        }
    }
}

function showFreeHelp(event: MouseEvent) {
    event.stopPropagation()

}

function OpenBlind(id: string) {
    router.push({
        name: 'boxDetail',
        params: {
            id: id
        }
    })
}

function scrollToAnchor(anchor: string) {
    const element = document.getElementById(anchor);
    if (element) {
        const scrollWrap = document.getElementById('box-layout') as HTMLElement;
        scrollWrap.scrollTo({
            behavior: 'smooth',
            top: element.offsetTop - (8.5 * Number.parseInt(document.documentElement.style.fontSize))
        });
    }
}

onMounted(() => {
    checkShareCode()
    getHomeBox()
    getBannerData()
    // getPopupData()
})

function getPopupData() {
    showPopupDialog()
}

function handlerMouseover() {

}

function checkShareCode() {
    if (!useUser.isLogin) {
        if (route.query.code) {
            //显示登录页面并且直接显示到注册
            showLoginDialog('register', route.query.code.toString())
        }
    }
}

</script>

<style scoped>
.box-layout {
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


.homeContent {
    height: 100%;
}


.positionSticky {
    height: 2.5rem;
    background: #1F232CFF;
    flex-shrink: 0;
    margin: 0 2rem;
    border-radius: 0.33rem;
    margin-bottom: 1rem;
    margin-top: .7rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: nowrap;
    overflow-x: auto;
    z-index: 3;
    top: .5rem;
    left: 0;
    position: sticky;
}

.positionSticky .positionItem {
    font-size: .83rem;
    margin: 0 1rem;
    height: 100%;
    display: flex;
    font-weight: bold;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
    position: relative;
    cursor: pointer;
    user-select: none;
}


.positionSticky .active ::after {
    content: "";
    display: block;
    width: 80%;
    height: 0.16rem;
    background: var(--theme-color);
    bottom: 0;
    left: 10%;
    border-top-left-radius: .2rem;
    border-top-right-radius: .2rem;
    position: absolute;
}


@media screen and (max-width: 995px) {

    .positionSticky {
        margin: 0;
        top: 5px;
        height: 44px;
        margin-bottom: 10px;
        padding: 0 6px;
    }

    .positionSticky .active ::after {
        height: 4px;
    }

    .positionSticky .positionItem {
        margin: 0 0.5rem;
        font-size: 16px;
    }
}


.positionSticky .positionItem a {
    color: #6B7280FF;
}

.positionSticky .active a {
    color: white;
}


a {
    color: #FFFFFF;
    text-decoration: none;
}

.homeContent .typeBox:target::before {
    content: "";
    display: block;
    height: 8rem;
    margin-top: -8rem;
    visibility: hidden;
}


.homeContent .title {
    text-align: center;
    margin-bottom: 2.7rem;
    background: url(/image/box-title.png) no-repeat center / 35.42rem 1.8rem;
    height: 1.8rem;
}

.title-img {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 8rem;
    margin-bottom: .3rem;
}

.title-img img {
    height: 100%;
}

.homeContent .title span {
    font-size: 1rem;
    padding-bottom: 0.75rem;
    font-weight: bold;
}

.homeContent .boxContent {
    display: flex;
    flex-wrap: wrap;
    margin: 0 2rem;
    column-gap: .5rem;
    row-gap: 2rem;
    margin-bottom: 3rem;
    justify-content: center;
}

.homeContent .boxContent>div {
    flex-basis: calc((100% - 4 * .5rem) / 5);
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.homeContent .boxContent .blindBox {
    position: relative;
    width: 100%;
    max-width: 164px;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
}

@media screen and (min-width: 995px) {
    .homeContent .boxContent .blindBox {
        max-width: 306px;
    }
}

.homeContent .boxContent .blindBox .skinBg {
    width: 100%;
    aspect-ratio: 1;
    display: block;
    object-fit: cover;
}

.homeContent .boxContent .blindBox .skin-layout {
    transition: all .3s ease;
}

.homeContent .boxContent .blindBox .skin-layout:hover {
    transform: scale(1.1);

}


.homeContent .boxContent .blindBox .skinName {
    font-size: 0.67rem;
    font-weight: bold;
    line-height: 1;
    overflow: hidden;
    height: .75rem;
    margin-top: .5rem;
    text-overflow: ellipsis;
    color: #EDEFF3FF;
    text-align: center;
    flex-shrink: 0;
}

@media screen and (max-width:995px) {

    .homeContent .boxContent .blindBox {
        max-width: 164px;
        flex-basis: calc(50% - 2px);
    }

    .homeContent .boxContent .blindBox .skinName {
        font-size: .5rem;
        height: 1.7rem;
        line-height: 1.3;
        font-weight: bold;
    }

    .homeContent .title {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .homeContent .title span {
        font-size: 20px;
        padding-bottom: 1%;
    }
}

.price-free {
    background-color: #3FB950FF !important;
    color: white !important;
}

.free-tip {
    position: absolute;
    top: 0;
    right: 0;
}

.free-tip-help {
    position: absolute;
    top: -10px;
    transform: translateY(-100%);
    box-shadow: inset 0 0 0 1px #FFFFFF26;
    background-color: #1F232CFF;
    border-radius: .4rem;
    padding: .5rem;
    opacity: 0;
}

.free-tip:hover+.free-tip-help {
    opacity: 1;
}

.homeContent .boxContent .blindBox .price {
    display: flex;
    flex-direction: row;
    background-color: #FFBF00FF;
    color: #1A1206FF;
    font-family: 'din';
    font-weight: bold;
    margin-top: .5rem;
    justify-content: center;
    align-items: center;
    height: 1.66rem;
    padding: 0 .6rem;
    border-radius: 1rem;
    box-sizing: border-box;
}

.homeContent .boxContent .blindBox .price img {
    width: 0.833rem;
    margin-right: 0.29rem;
}

.ring {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    gap: .2rem;
    font-size: .75rem;
    font-family: 'din';
    font-weight: bold;
}

.new {
    position: absolute;
    right: 0;
    top: 0;
    background-color: #F85149FF;
    border-radius: 1rem;
    height: 1rem;
    font-size: .67rem;
    display: flex;
    align-items: center;
    padding: 0 .5rem;
}
</style>