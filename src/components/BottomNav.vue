<template>
    <div class="layout _mobile">
        <div v-for="(item, index) in arr" @click="changeTab(item.index, item.path)" :key="index" class="item">
            <BoxIcon class="icon" v-if="item.index == 0" :color="currentIndex == index ? '#FFBF00FF' : null" />
            <BattleIcon class="icon" v-else-if="item.index == 1" :color="currentIndex == index ? '#FFBF00FF' : null" />
            <RollIcon class="icon" v-else-if="item.index == 2" :color="currentIndex == index ? '#FFBF00FF' : null" />
            <BagIcon class="icon" v-else-if="item.index == 3" :color="currentIndex == index ? '#FFBF00FF' : null" />
            <MineIcon class="icon" v-else-if="item.index == 4" :color="currentIndex == index ? '#FFBF00FF' : null" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import router from '../router';
import { useUserStore } from '../store/user';
import { showLoginDialog } from '../utils';
import BagIcon from './icons/main/BagIcon.vue';
import BattleIcon from './icons/main/BattleIcon.vue';
import BoxIcon from './icons/main/BoxIcon.vue';
import MineIcon from './icons/main/MineIcon.vue';
import RollIcon from './icons/main/RollIcon.vue';

const useUser = useUserStore()
//获取当前路由
let { path } = useRoute()

const currentIndex = ref(0)

const arr = [
    { 'index': 0, 'path': 'home' },
    { 'index': 1, 'path': 'battle' },
    { 'index': 2, 'path': 'roll' },
    { 'index': 3, 'path': 'bag' },
    { 'index': 4, 'path': 'profile' },
]

onMounted(() => {
    router.beforeEach((to, _, next) => {
        setCurrentTab(to.path)
        next()
    })
    setCurrentTab(path)
})

function setCurrentTab(path: string) {
    currentIndex.value = -1
    if (path.includes('battle')) {
        currentIndex.value = 1
    } else if (path.includes('roll')) {
        currentIndex.value = 2
    } else if (path == '/' || path.includes('openBlind')) {
        currentIndex.value = 0
    } else if (path.includes('bag')) {
        currentIndex.value = 3
    } else if (path.includes('profile')) {
        currentIndex.value = 4
    }
}

function changeTab(index: number, path: string) {
    if ((index == 4 || index == 3) && !useUser.isLogin) {
        showLoginDialog()
        return
    }
    router.push({
        name: path
    })
}

</script>

<style scoped>
.layout {
    height: 56px;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 20;
    background-color: #191B23;
    display: flex;
}

.item {
    flex-grow: 1;
    width: 0;
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    cursor: pointer;
    justify-content: center;
}

.icon {
    height: 100%;
    padding: 14px 0;
    width: 100%;
    display: flex;
    align-items: center;
}
</style>