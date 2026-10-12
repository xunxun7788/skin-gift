<template>
    <div class="help-layout">
        <SuperTab class="super-tab" :current-index="currentIndex" :tab-arr="actionArr" v-on:change="changeTab">
        </SuperTab>
        <div class="right-content">
            <RouterView></RouterView>
        </div>
        <div class="mobile _mobile"></div>
    </div>
</template>

<script lang="ts" setup name="Home">
import { onMounted, ref } from 'vue';
import { RouterView, useRoute, useRouter } from 'vue-router';
import SuperTab from '../components/common/SuperTab.vue';
const router = useRouter()
//获取当前路由
let { path } = useRoute()

const actionArr = [
    {
        't': 'footer.aboutUs',
        'i': 0
    },
    {
        't': 'footer.contactUs',
        'i': 1
    },
    {
        't': 'footer.faq'
        , 'i': 2

    },

    {
        't': 'footer.userAgreement',
        'i': 3
    },
    {
        't': 'footer.privacyPolicy'
        ,
        'i': 4
    },
]

const currentIndex = ref(0)

onMounted(() => {
    router.beforeEach((to, _, next) => {
        setCurrentTab(to.path)
        next()
    })
    if (path == '/help') {
        changeTab(0)
    }
    setCurrentTab(path)
})

function setCurrentTab(path: string) {
    if (path.endsWith('about')) {
        currentIndex.value = 0
    } else if (path.endsWith('contact')) {
        currentIndex.value = 1
    } else if (path.endsWith('problem')) {
        currentIndex.value = 2
    } else if (path.endsWith('agreement')) {
        currentIndex.value = 3
    } else if (path.endsWith('privacy')) {
        currentIndex.value = 4
    }
    console.log(currentIndex.value, "  22")
}

function changeTab(index: number) {
    let path = ""
    switch (index) {
        case 0:
            path = "about"
            break;
        case 1:
            path = "contact"
            break;
        case 2:
            path = "problem"
            break;
        case 3:
            path = "agreement"
            break;
        case 4:
            path = "privacy"
            break;
        case 5:
            path = "statement"
            break;
        case 6:
            path = "aml"
            break;

    }
    router.push({
        name: path
    })
}

</script>

<style scoped>
.help-layout {
    height: 100%;
    width: 100%;
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    align-items: center;
    display: flex;
    flex-direction: column;
}

.super-tab {
    position: relative;
    top: 0;
    margin: 0 1rem;
    width: calc(100% - 2rem);
    margin-top: .5rem;
}


.right-content {
    flex: 1;
    overflow-y: auto;
    width: calc(100% - 2rem);
    margin: 0 1rem;
    margin-top: .5rem;
}

.mobile {
    height: 48px;
}
</style>