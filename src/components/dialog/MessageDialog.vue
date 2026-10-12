<template>
    <div class="msg-layout">
        <div class="size-full" v-on:click="close_"></div>
        <transition name="layout" @after-leave="props.dismiss">
            <div v-show="isShow" class="msg-body">
                <div class="base-row msg-title">
                    <span class="font-32 bold font-EDEFF3">{{ $t('message.notice') }}</span>
                    <div class="close-btn">
                        <CloseIcon v-on:click="close_" class="size-1rem btn" />
                    </div>
                </div>
                <div style="position: relative;">
                    <div class="msg-content">
                        <div v-on:click="clickItem(index, value)" v-for="(value, index) in msgDataList"
                            class="base-col gap-4">
                            <span class="font-16 bold font-9AA1AD" :class="{ 'font-EDEFF3': value.is_read == 0 }">
                                {{ getText(value.text) }}
                            </span>
                            <div class="base-row">
                                <span class="font-14 font-6B7280">{{ value.show_time }}</span>
                            </div>
                            <div :ref="setRefs" class="rich-content">

                            </div>
                        </div>
                        <LoadMoreButton ref="loadStateRef" v-on:load-data="loadData" />
                    </div>
                    <StateLayout class="state-layout" :load-state="msgLoadState"></StateLayout>
                </div>

            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import useMine from '../../hooks/useMine.ts';
import router from '../../router/index.ts';
import CloseIcon from '../icons/main/CloseIcon.vue';
import LoadMoreButton from '../LoadMoreButton.vue';
import StateLayout from '../StateLayout.vue';

const { msgDataList, apiMessageRed, msgLoadState, msgEmptyText, apiMineMessageList, msgTotal } = useMine()

const divRefs = ref<any[]>([]);

const loadStateRef = ref<any>(null)

const isShow = ref(false)
const props = defineProps(['dismiss'])

let page = 1

function close_() {
    isShow.value = false
}

onMounted(() => {
    isShow.value = true
    loadData()
})

async function loadData() {
    const r = await apiMineMessageList(page)
    if (r) {
        const j = r.data.data.list;
        if (j.length > 0) {
            loadStateRef.value?.chageStatus(j.length != 20 ? 3 : 1)
            page++
        } else {
            loadStateRef.value?.chageStatus(3)
        }
    } else {
        loadStateRef.value?.chageStatus(1)
    }
}

function getText(value: any) {
    const l = localStorage.getItem('lang')
    return JSON.parse(value)[l ?? 'en']
}

const setRefs = (el: any) => {
    if (el) {
        divRefs.value.push(el);
    }
};

function clickItem(index: number, data: any) {
    const action = data['action'].toString()
    if (data.is_read == 0) {
        data.is_read = 1
        apiMessageRed(data.id)
    }
    if (action == "battle") {
        props.dismiss?.()
        router.push({
            name: 'battleDetail',
            params: {
                id: data['action_url']
            }
        })
    } else if (action == 'url') {
        window.open(data.action_url, '_blank')
    } else if (action == 'richText') {
        if (divRefs.value[index].innerHTML.length > 0) {
            //隐藏
            divRefs.value[index].innerHTML = ''
            data.show = false
        } else {
            divRefs.value[index].innerHTML = data['action_url']
            data.show = true
        }
    } else if (action == 'details') {
        props.dismiss?.()
        router.push({
            name: 'rollDetail',
            params: {
                id: data['action_url']
            }
        })
    }

}

</script>

<style scoped>
.msg-layout {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: 100%;
}

.msg-title {
    height: 3rem;
    padding-left: 1rem;
    padding-right: .5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}


.close-btn {
    padding: .3rem;
}

.msg-body {
    position: absolute;
    right: 1rem;
    top: 2.8rem;
    z-index: 101;
    background-color: #171A21FF;
    width: 100%;
    display: flex;
    flex-direction: column;
    max-width: 500px;
    box-shadow: inset 0 0 0 1px #333A47FF;
    border-radius: .66rem;
}


.msg-content {
    height: 100%;
    display: flex;
    padding: 0 1rem;
    padding-bottom: 1rem;
    overflow-y: auto;
    gap: .66rem;
    flex-direction: column;
    max-height: 800px;
}

.rich-content {
    max-height: 10rem;
    background-color: #00000033;
    width: 100%;
    overflow: hidden;
    overflow-y: auto;
}

.state-layout {
    position: relative;
    min-height: 200px;
}


@media screen and (max-width: 995px) {
    .msg-body {
        width: 100%;
        height: 90vh;
        bottom: 0;
        left: 0;
        right: 0;
        max-width: 100%;
        margin-top: 10vh;
        top: 0;
    }

    .msg-title {
        height: 80px;
    }
}

.layout-enter-active {
    animation: anima-layout-in 0.3s ease;
}

.layout-leave-active {
    animation: anima-layout-out 0.3s ease;
}

@keyframes anima-layout-in {
    0% {
        opacity: 0;
        transform: scale(.5);
    }

    100% {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes anima-layout-out {
    0% {
        opacity: 1;
    }

    100% {
        opacity: 0;
        transform: scale(.5)
    }
}
</style>