<template>
    <div class="leftNav _windows">
        <div class="list">
            <img class="logo" src="/logo.svg" alt="">
            <div @click="setCurrentTab('/home')" value="/home" class="listItem">
                <img :src="tab1Icon">
                <span>{{ $t('nav.box') }}</span>
            </div>
            <div @click="setCurrentTab('/roll')" value="/roll" class="listItem">
                <img :src="tab2Icon">
                <span>{{ $t('nav.roll') }}</span>
            </div>
            <div @click="setCurrentTab('/battle')" value="/battle" class="listItem">
                <img :src="tab5Icon">
                <span>{{ $t('nav.battle') }}</span>
            </div>
            <div @click="setCurrentTab('/shop')" value="/shop" class="listItem">
                <img :src="tab3Icon">
                <span>{{ $t('nav.shop') }}</span>
            </div>
            <div @click="setCurrentTab('/fuli')" value="/fuli" class="listItem">
                <img :src="tab4Icon">
                <span>{{ $t('nav.fuli') }}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup name="LeftNav">

import { onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '../store/user';
import { showLoginDialog } from '../utils';

const useUser = useUserStore()

const tab1Icon = '/image/tab_box.svg'
const tab2Icon = '/image/tab_roll.svg'
const tab3Icon = '/image/tab_shop.svg'
const tab4Icon = '/image/tab_gift.svg'
const tab5Icon = '/image/tab_battle.svg'

const arr = [
    {
        'icon': tab1Icon,
        'name': 'nav.box'
    }
]

//获取当前路由

let { path } = useRoute()

let router = useRouter()

router.afterEach(() => {
    window.scrollTo(0, 0)
})

onMounted(() => {
    router.beforeEach((to, _, next) => {
        setCurrentTab(to.path, false)
        next()
    })
    setCurrentTab(path, false)
})

function setCurrentTab(name: string, isNeedPush = true) {
    if (name == '/fuli' && !useUser.isLogin) {
        showLoginDialog()
        return
    }
    var list = document.getElementsByClassName('listItem')
    for (let index = 0; index < list.length; index++) {
        const element = list[index];
        console.log(element.getAttribute("value"), name)
        // if (element.getAttribute("value") == name) {
        //     element.classList.add('active')
        // } else {
        //     element.classList.remove('active')
        // }
    }
    if (isNeedPush) {
        router.push({
            path: name
        })
    }
}

</script>

<style>
.leftNav {
    height: 100dvh;
    overflow-y: auto;
    background-color: #171A21;
    display: flex;
    flex-direction: column;
    align-items: center;
    z-index: 10;
    position: fixed;
}

.logo {
    width: 40%;
}

.leftNav .cell {
    background-color: #FFFFFF4D;
    height: 1rem;
    border-radius: .4rem;
    display: flex;
    align-items: center;
}

.leftNav .list .active {
    background: url(/image/nav-item-bg.png) no-repeat center / cover;
}

.leftNav .list .listItem {
    width: 4.92rem;
    height: 5.08rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    padding: 0.5rem;
    box-sizing: border-box;
    text-align: center;
}

.leftNav .list .listItem img {
    width: 1.67rem;
    height: 1.67rem;
}
</style>