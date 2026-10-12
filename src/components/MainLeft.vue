<template>
    <div ref="drawerRef" class="left-layout _windows" :style="wrapStyle">
        <div class="left-list">
            <img v-on:click="setCurrentTab('/home', true)" class="logo btn" :class="{ 'logo-big': isOpen }"
                :src="`/${isOpen ? 'logo' : 'lno'}.svg`" alt="">
            <div v-on:click="setCurrentTab(value.v, true)" :class="{ 'cell': true, 'cell-help': value.i == 7 }"
                :style="wrapBoxStyle" v-for="value in arr" :value="value.v">
                <div class="icon">
                    <BoxIcon class="icon" v-if="value.i == 0" :color="tabIndex == value.i ? '#EDEFF3' : null" />
                    <BattleIcon class="icon" v-if="value.i == 1" :color="tabIndex == value.i ? '#EDEFF3' : null" />
                    <RollIcon class="icon" v-if="value.i == 2" :color="tabIndex == value.i ? '#EDEFF3' : null" />
                    <BagIcon class="icon" v-if="value.i == 3" :color="tabIndex == value.i ? '#EDEFF3' : null" />
                    <InviteIcon class="icon" v-if="value.i == 4" :color="tabIndex == value.i ? '#EDEFF3' : null" />
                    <LevelIcon class="icon" v-if="value.i == 5" :color="tabIndex == value.i ? '#EDEFF3' : null" />
                    <HelpIcon class="icon" v-if="value.i == 6" :color="tabIndex == value.i ? '#EDEFF3' : null" />
                </div>
                <span :class="{ 'nav-text': true, 'text-fade': !isOpen }">{{ $t(value.n) }}</span>
            </div>
        </div>

        <div class="link-layout">
            <img class="link-cell" src="/image/tg.svg" alt="">
            <img class="link-cell" src="/image/discord.svg" alt="">
            <img class="link-cell" src="/image/x.svg" alt="">
        </div>
    </div>
</template>


<script lang="ts" setup>
import { computed, inject, onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import router from '../router';
import { useUserStore } from '../store/user';
import { showLoginDialog } from '../utils/index.ts';
import BagIcon from './icons/main/BagIcon.vue';
import BattleIcon from './icons/main/BattleIcon.vue';
import BoxIcon from './icons/main/BoxIcon.vue';
import HelpIcon from './icons/main/HelpIcon.vue';
import InviteIcon from './icons/main/InviteIcon.vue';
import LevelIcon from './icons/main/LevelIcon.vue';
import RollIcon from './icons/main/RollIcon.vue';

const useUser = useUserStore()
let { path } = useRoute()

const drawerRef = ref<HTMLDivElement | null>(null)
const isOpen = ref(true)
const realContentWidth = ref(0)

const tabIndex = ref(0);

const emitter = inject<any>("emitter");

const arr = [
    {
        'n': 'nav.box',
        'i': 0,
        'v': '/home'
    },
    {
        'n': 'nav.battle',
        'i': 1,
        'v': '/battle'
    },
    {
        'n': 'nav.roll',
        'i': 2,
        'v': '/roll'
    },
    {
        'n': 'mine.myBag',
        'i': 3
        , 'v': '/bag'
    },
    {
        'n': 'share.Invite',
        'i': 4,
        'v': '/profile'
    },
    {
        'n': 'nav.fuli',
        'i': 5,
        'v': '/reward'
    },
    {
        'n': 'nav.help',
        'i': 6,
        'v': '/help'
    },
];

const doResize = async () => {
    realContentWidth.value = -1;
}

onMounted(() => {
    router.beforeEach((to, _, next) => {
        setCurrentTab(to.path, false)
        next()
    })
    setCurrentTab(path, false)
    window.addEventListener("resize", doResize);
    changeSize();
    emitter.on('toggleMainMenu', toggle)
    emitter.on('changeLang', () => {
        doResize()
    });
})

function changeSize() {
    realContentWidth.value = (drawerRef.value!.firstElementChild as HTMLElement).scrollWidth;
}

const toggle = (payload: { isOpen: boolean }) => {
    isOpen.value = payload.isOpen
    if (realContentWidth.value == -1) {
        changeSize()
    }
}

const wrapStyle = computed(() => {
    var width = isOpen.value ? `calc(${realContentWidth.value}px + 1.6rem)` : '3.67rem'
    if (realContentWidth.value == -1 && isOpen.value) {
        width = ''
    }
    return ({
        width: width,
        padding: isOpen.value ? '.8rem' : '.8rem 0 .8rem 0'
    });
})

const wrapBoxStyle = computed(() => {
    var width = isOpen.value ? `calc(${realContentWidth.value}px)` : '2.2rem'
    if (realContentWidth.value == -1 && isOpen.value) {
        width = ''
    }
    return ({
        width: width,
    })
})

function setCurrentTab(name: string, isNeedPush = true) {
    if ((name == '/profile' || name == '/bag' || name == "/reward") && !useUser.isLogin) {
        showLoginDialog()
        return
    }
    var list = document.getElementsByClassName('cell')
    for (let index = 0; index < list.length; index++) {
        const element = list[index];
        const value = element.getAttribute("value")?.toString()
        if (value == name) {
            tabIndex.value = index;
        } else {
            element.classList.remove('active')
        }
    }
    if (name.includes('openBlind')) {
        tabIndex.value = 0;
    } else if (name.includes('battle')) {
        tabIndex.value = 1;
    } else if (name.includes("roll")) {
        tabIndex.value = 2;
    } else if (name.includes("help")) {
        tabIndex.value = 6
    } else if (name.includes("recharge")) {
        tabIndex.value = 4
    } else if (name.includes('home') || name == '/') {
        tabIndex.value = 0;
    }
    const element = list[tabIndex.value];
    element?.classList.add('active')
    if (isNeedPush) {
        router.push({
            path: name
        })
    }
}

onUnmounted(() => {
    window.removeEventListener("resize", doResize);
})

</script>

<style scoped>
.left-layout {
    height: 100dvh;
    overflow-y: auto;
    overflow-x: hidden;
    flex-shrink: 0;
    box-sizing: border-box;
    padding: .8rem;
    background-color: #171A21;
    flex-direction: column;
    align-items: center;
    z-index: 10;
    display: flex;
    transition: width .5s ease;
}


.left-list {
    display: flex;
    flex-direction: column;
    gap: .3rem;
    align-items: center;
    flex: 1;
}

.icon {
    width: 1rem;
    height: 1rem;
}

.logo {
    width: 2rem;
    margin-bottom: 1rem;
}

.logo-big {
    width: 3rem;
}

.cell {
    padding: 0 .6rem;
    cursor: pointer;
    box-sizing: border-box;
    height: 2rem;
    flex-shrink: 0;
    white-space: nowrap;
    gap: .2rem;
    width: 100%;
    font-weight: bold;
    text-align: center;
    align-items: center;
    display: flex;
    border-radius: .5rem;
    color: #6B7280FF;
    transition: width .4s ease;
}

.cell-help {
    margin-top: .8rem;
}

.active {
    color: #EDEFF3FF;
    background-color: #FFFFFF4D;
}

.link-layout {
    display: flex;
    flex-direction: v-bind('isOpen ? ' row' : "column"');
    justify-content: center;
    align-items: center;
    width: 100%;
}

.link-cell {
    cursor: pointer;
    touch-action: none;
    width: 1rem;
    height: 1rem;
    padding: .4rem;
}



.nav-text {
    white-space: nowrap;
    flex-shrink: 0;
    opacity: 1;
    transition: opacity 0.35s ease;
}

.text-fade {
    opacity: 0;
}
</style>
