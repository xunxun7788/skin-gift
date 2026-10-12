<template>
    <div style="position: relative;">
        <div>
            <NavSwiper />
            <swiper class="swiper" :autoplay="{
                delay: 2500,
                disableOnInteraction: false
            }" :modules="modules" :slides-per-view="1" :pagination="{
                clickable: true,
            }">
                <swiper-slide v-for="(item, index) in bannerList" :key="index">
                    <img @click="jumpTo(item)" class="swiper-img" :src="$cdnUrl + item.image" alt="">
                </swiper-slide>
            </swiper>
            <div class="homeContent pagesView">
                <div v-show="Object.keys(homeBoxData).length > 0" class="positionSticky" id="positionSticky">
                    <div v-for="(value, key, index) in homeBoxData" :key="key" @click="changePositionIndex(index)"
                        :class="{ 'positionItem': true, 'active': positionStickyIndex == index }">
                        <a href="javascript:void(0)">{{ key }}</a>
                    </div>
                </div>
                <div v-for="(value, key, index) in homeBoxData" class="typeBox" :id="(index + 1) + ''" :key="key">
                    <div class="title">
                        <span>{{ key }}</span>
                    </div>
                    <div class="box-layout">
                        <div class="box-layout-cell" v-for="value in 6"></div>
                    </div>
                    <div class="boxContent">
                        <div class="blindBox" @mouseenter="handlerMouseover" v-for="(item, index) in value"
                            @click="OpenBlind(item.id)" :key="index">
                            <img class="skinBg" lazy="loaded" :src="$cdnUrl + item.box_image">
                            <img v-if="item.cover" class="skin" :src="$cdnUrl + item.cover">
                            <div class="skinName">{{ item.box_name }}</div>
                            <div class="btn">
                                <div class="price"><span>{{ item.price }}</span></div>
                                <div class="open"><span>{{ $t('box.open') }}</span><img
                                        src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAiCAYAAAAkjjtxAAAAAXNSR0IArs4c6QAAA2JJREFUWEfF2MtvTGEcxvHvb6ZDIpZ2WLhuSzutdqaYmbZoty5BBP8EInXXCP4GRBBNbNtiZ8FcShELC6q0bnHXC0KbzivnOJWqc35z5syUdzXJed8zn/PkOZe8AmAMQg9V1m/PMc57Wc1zr+Oml3nq+lG+S5Iv6hwfB2VyjsmwBzitrBlFaJF60m5zzE0qCbPKc71hnAjXpJY3PlyeU36D7aSz7MVwSjnhCEJrYLQwRpjrpaD/ANvoNPsQTqpoaJEYGdek06xAqFUiGkO4JnW8DZL0X2AbnWE/cEI54TDQ+j/QrmDfaEOLxMn+y6Q9wU6n2zC0q0nn2SAN5FzRGVYCNWo98lyVOO/81kMFO50+gHBcRQvrpZ4eV3SWKgzRcqELgp16HASOFej0Oolxe6bRvsAO+hBwVEUbmiXOncDocbplDe+1evgGO50+jOFIgU43SQO9rugc1eSpVutRAF0U2On0EYTDCnqIPM0zhS4a7NTDqoZVEa8xRIgmqeOua9K3iBJSvl2sN2KELonyYfr6QGAHbd2E1s3oNT4TorkE9A8idE9HBwY79WhHaFPRQpPUc8816TQ1iP2sdh/CX+iSwD7RnxCay4UuGezUw/rusL4/vMYnoEli3HdNOmN/LK3wk3RZwDY6y0kM+xT0RyZolNU8CISG74TpLgvYPGQWI1zGsFEBPyJPShp4PX2OMYTooZE8i5SUh+wnh/IHvg6ZXiKM06FiDY8xJEvADhOhU6J8KwlsblDBbDqATZ5XZ2GFlMR45ZpsjhSGxUqyw8yhSyr5as0JDPaFhT4gWS5sYLC5QpgFdrKbld70ESIldbx0SVbI0VhMspPnKDphB3sZ2KJgnxAiGRhrGGEunZM1mPo/RYF9YvsJkZgJbFGVsLELuYRhq5JsPxUkpZYXrjXIkgKWKDfoCGN0aRsuvhJ2kr0IbFOwT6kg4YnNkERYWgrWV8IO9gKwXcVOkHTbyrK3wcqELQh2anAeww4F+4wJEp7YNAlCLFPWj/KDTr/7bt77Er86WxhrvcHiDLp2tsxYz4SdGpwDdirJDGBIeGJzrMWwvFzJej6HHexZYJeKFZJSz4DHS6EwNk+XNDDq64NlyqQ/dy+tGsznDMJu5USDCIkSsF/I0xkEW/CmK/bq/8X8n/9pk+K51baCAAAAAElFTkSuQmCC">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <StateLayout :load-state="homeLoadState" :empty-text="homeEmptyText" />
    </div>
    <Footer></Footer>
    <FloatLayout />
    <audio controls ref="audioRef" style="display: none;">
        <source src="../assets/audio/mouse.mp3" type="audio/mpeg">
    </audio>
</template>

<script lang="ts" setup name="Home">
const { t } = useI18n()
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import FloatLayout from '../components/FloatLayout.vue';
import NavSwiper from '../components/NavSwiper.vue';
import StateLayout from '../components/StateLayout.vue';
import useHome from '../hooks/useHome';
import { useUserStore } from '../store/user';
import { showLoginDialog } from '../utils';

const useUser = useUserStore()

const router = useRouter()

const route = useRoute()

const audioRef = ref(null)

let { homeBoxData, homeLoadState, homeEmptyText, bannerList, getHomeBox, getBannerData } = useHome()

const modules = [Pagination, Autoplay];

let positionStickyIndex = ref(0)

function changePositionIndex(index: number) {
    positionStickyIndex.value = index
    //滚动到对应的 锚点
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
        // 平滑滚动到元素位置 需要偏移一点位置计算
        window.scrollTo({
            behavior: 'smooth',
            top: element.offsetTop - (8.5 * Number.parseInt(document.documentElement.style.fontSize))
        });
    }
}

onMounted(() => {
    checkShareCode()
    getHomeBox()
    getBannerData()
})

function handlerMouseover() {
    if (audioRef.value) {
        audioRef.value.play()
    }
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
.swiper {
    margin-top: 0.8rem;
    flex: 1;
}

.swiper-img {
    width: 100px;
    max-width: 100%;
    cursor: pointer;
}

.swiper-pagination-bullet {
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAsCAYAAAAn4+taAAAAAXNSR0IArs4c6QAAA5tJREFUaEPdmm2IVFUYgJ935txrCxKYGGwgJGhbSm1gIOneWfePHz8z6EMhKKgflRiUQaBoFAR+QFL2I8Eg8CvQfvrxZ925qyEUZLGWFSgEu1DUggjmvWfmjXuZuRxdd+fuou7MPf9m7vu+533m/TjnnjPCNMfNIZ4sl9iisB54ZJrqrcRHBU7W6uyb08/PrYTd5zId4XiYD1A+AsrT0ZuBbA1hu9fHJ3l1c4PEIe8Ce/Iavkty73kBe/PYygVy8zyPl2pcBPymURGuopxRuJFnolYyAl0Ia1R51JGN6mV656zk1xz6rUQgrnI6maQpqcoxbz6vyDKi1tr5JXQEP/6Hr0V4MdNSzngV1ray0jIidpgNqhx3DI0aS48McL2V8Zk810HmWsNlt5GI8Lzp48RU9qYE0fN01epccsMtsNEEHJmJk3l1bMjLCofdNC6XWCorJ0/jKUHikJ3AjswBoWpWsVoEzevUTORUEXuOsygVR/9DL0j9ueOYFOTGEItMiUvAAw3NmsJyP0iL/p6PKKRX4Aen1f9n6yzt6ufKnSafFCQO05x8Lguv8rmpsPmeEzgT2CqfqfC289W3XsCG3CBxlbUIpxyFvw30SMD4/QTRkHmWtPAXOF1snVfh9O1+TIhI0gLtv/wE9DSFVXnDr3DgfkI054qqvC7Cl87cl81DPHV7658AElfZirDLUfze9LFChPpsgKhSssNcAJ5xovK+V2G3688tIFql2wq/AXMbQqrwrB+khmZtRCErBL4Dmv5eN8pjUmEsq2HXuyjkULJOOA+/MgGvzRqBW/ghBxVezdIdDvsBmyaAxCF9QOjoXjMllsgq/moHED3Hw7bO78CDjj+BFzCcfE5Dpd9Qtt1pz+51iN/xA/a1A0RW+CFbBD51fLpoxlguL1BLQaKQNwX2OwIjxvK0DGDbCUQHMdbwI7DM+cHf8gO+EL3AfBulIZvnOD3gBZxtJ4imL3HIamDQ8W3c+CyROEzf+LZlhMoxv8JL7QiRpViVo7ds9eHjBCTZTz3REIpMncXSz5/tDKJDLLQl/nBe9H5JQJKFrtmfT3lBeqjQ9iMOOQmsaziqhQIpTGoVo9gL034LsyAWaouSwBRi0+hsyjp/G5+mWFFerNIUK8KrbhqVohw+NKLS+cdBzr6/8w/oEpjCHJk21pbOP8ROC78o1woJTCEuerLCL8LVWwJTmMvQRuF3/vV0lmJF+MNAE6Zd/8LxP0zx4RSoBrm3AAAAAElFTkSuQmCC) no-repeat center / cover;
    width: 1.04rem;
    height: 0.92rem;
    display: inline-block;
    border-radius: 0;
}

.swiper-pagination-bullet-active {
    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAuCAYAAABqK0pRAAAAAXNSR0IArs4c6QAAAnBJREFUaEPdmjlv1EAYhp9ZHyESDVCFCgquIEhBF603HYGSIFHAP4CCgkNCAgECCYmjoIB/AAUSUELosl5FoqAIiHAVUJEOGqQQX4NsrSNgs2uPtev1jtv55v3eZ2e+9RwWaPIITThQBllb4IBR46yEo8D2Pv8Q3wW8CCPuj83wTkVbCcRvcQnJDcBQSVIgNkRwxapzK2/f3CC+yzngbl7hPsWdtxzu5dHKBbK2yN5ayBJg5xHtY4wXGUyNTfMxSzMXiN9kHsHhLLGBtEteWQ1ms7QzQYIWc1LyNEtokO1CcNys86xXjp4gcpHxMGJZSnYM0miWthB8M2pMimlWu8X2BPFdrgFXsxKV1H7dchI/Gz5dQVYX2GnWWAY2lWQ0K83vIGJyfIavGwV2BfHdZE4ey1Ivuf255TCXG8RvMovgZckm86WTHLEazP8f3DEi8j128IO3wJ58yqVHfTK3clDsx/s7cweI3+QCgtul21NJKLloNbjTFUQ2mQgEn4HNKrpDiP1lSnaLBitp7n9GxHN5JODkEIwpp5Tw2HY41QHiu9QBV1lxuB0cy6EVW0hGRD7BCCZ4A0wN15dy9iVzhUPiBGEC4rmcFvBAWaYCHSScsR0eCvmabYHHF2BLBXwVsfDTtNklfDfZ8V0uolChPjdjkHg9ta9CpopY+RCDRGnRF1GoSB+pFYg2U0uPYtfm71ebF6JWS5QYRotFY/ou0GIZn0wxXTZWyRTTYaubjIouhw/tURn946C08LU4oIthtDkybb9bRv8QOyl8Xa4VYhgtLnrWC1+Hq7cYRpvL0Hbhj/719PoU0+GDgRSmqp9w/AFqOfUHvE4SkgAAAABJRU5ErkJggg==) no-repeat center / cover;
}

.pagesView {
    margin: 0 auto;
    padding: 0 1rem;
}

@media screen and (min-width: 995px) {
    .pagesView {
        max-width: 1500px;
        padding: 0 1rem;
    }
}

.homeContent {
    padding-top: 1rem;
    padding-bottom: 2.33rem;
    min-height: calc(100vh - 4.66rem - 2rem - var(--window-topNav-height) - var(--window-headerNav-height) - var(--window-footer-height));
}

.homeContent .positionSticky {
    height: 4.17rem;
    background: #191B23;
    border-radius: 0.33rem;
    margin-bottom: 2.6rem;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-wrap: nowrap;
    overflow-x: auto;
    z-index: 3;
    top: var(--window-headerNav-height);
    left: 0;
    position: sticky;
}

.homeContent .positionSticky .positionItem {
    font-size: 1.08rem;
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

@media screen and (max-width: 995px) {
    .homeContent .positionSticky .positionItem {
        font-size: 1.08rem;
        margin: 0 0.5rem;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        white-space: nowrap;
        position: relative;
    }
}


.homeContent .positionSticky .active ::after {
    content: "";
    display: block;
    width: 80%;
    height: 0.25rem;
    background: var(--theme-color);
    bottom: 0;
    left: 10%;
    position: absolute;
}

.homeContent .positionSticky .positionItem a {
    color: #5F5F5F;
}

.homeContent .positionSticky .active a {
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

.homeContent .title span {
    font-size: 1rem;
    padding-bottom: 0.75rem;
    font-weight: bold;
}

.homeContent .boxContent {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    row-gap: 2rem;
    column-gap: 1.25rem;
    margin-bottom: 4rem;
}


.homeContent .boxContent .blindBox {
    flex-basis: calc(20% - 3.6px);
    max-width: 164px;
    position: relative;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
}

@media screen and (min-width: 600px) {
    .homeContent .boxContent .blindBox {
        max-width: 306px;
    }
}



@media screen and (min-width: 995px) {
    .homeContent .boxContent .blindBox:hover .btn .price {
        opacity: 0;
    }

    .homeContent .boxContent .blindBox:hover .btn .open {
        opacity: 1;
    }

    .homeContent .boxContent .blindBox:hover .skin {
        transform: translateX(-50%) translateY(-0.5rem) rotate(-10deg);
    }
}

.homeContent .boxContent .blindBox .skinBg {
    width: 100%;
}

.homeContent .boxContent .blindBox .skin {
    width: 70%;
    position: absolute;
    top: 8%;
    left: 50%;
    transform: translateX(-50%);
    transition: transform 0.4s linear;
}

.homeContent .boxContent .blindBox .skinName {
    font-size: 0.75rem;
    height: 1.5rem;
    text-align: center;
}

@media screen and (max-width:995px) {
    .homeContent .boxContent .blindBox .skinName {
        font-size: .5rem;
        font-weight: bold;
    }
}

.homeContent .boxContent .blindBox .btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: 1.04rem auto 0 auto;
    min-width: 5.33rem;
    height: 1.46rem;
    position: relative;
    font-size: 0.75rem;
}

@media screen and (max-width:995px) {
    .homeContent .boxContent .blindBox .btn {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin: 1.04rem auto 0 auto;
        min-width: 5.33rem;
        position: relative;
        font-size: 1.08rem;
        width: 7.54rem;
        height: 2.67rem;
    }
}

.homeContent .boxContent .blindBox .btn .price,
.homeContent .boxContent .blindBox .btn .open {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    border-radius: 1rem;
    padding: 0.2rem 0.5rem;
    box-sizing: border-box;
}



.homeContent .boxContent .blindBox .btn .price {
    border: 0.1rem solid var(--theme-color);
    color: var(--theme-color);
}

@media screen and (max-width:995px) {
    .homeContent .boxContent .blindBox .btn .price {
        border: 0.15rem solid var(--theme-color);
        color: var(--theme-color);
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        border-radius: 1.33rem;
        padding: 0.2rem 0.5rem;
        box-sizing: border-box;
    }
}

.homeContent .boxContent .blindBox .btn .price img {
    width: 0.833rem;
    margin-right: 0.29rem;
}

.homeContent .boxContent .blindBox .btn .open {
    border: 0.1rem solid #FBC300;
    color: #FBC300;
    opacity: 0;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
}

.homeContent .boxContent .blindBox .btn .open img {
    width: 0.833rem;
    margin-left: 0.1rem;
}
</style>