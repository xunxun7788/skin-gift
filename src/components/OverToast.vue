<template>
    <transition @after-leave="close_">
        <div v-show="isShow" class="layout font-16 bold">
            <div :class="`content ${props.type} gap-8`">
                <img :src="`/image/t-${props.type}.svg`" alt="">
                {{ $t(props.msg) }}
            </div>
        </div>
    </transition>

</template>

<script lang="ts" setup name="OverToast">
import { onMounted, onUnmounted, ref } from 'vue';
const { close, props, id } = defineProps(['close', 'props', 'id'])

let isShow = ref(false)



let timeId = 0;

onMounted(() => {
    if (props.type == null) {
        props.type = 'warn'
    }
    isShow.value = true
    timeId = setTimeout(() => {
        //先播放退出动画再真实退出
        isShow.value = false
    }, 1200);
})

function close_() {
    close(id)
}

onUnmounted(() => {
    clearTimeout(timeId)
})

</script>

<style scoped>
.layout {
    z-index: 1001;
    position: fixed;
    top: 0;
    left: 0;
    display: flex;
    left: 50%;
    top: 10%;
    white-space: nowrap;
    transform: translateX(-50%);
    justify-content: center;
    align-items: center;
}

.content {
    height: 1.8rem;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 1rem;
    border: 1px solid #FFFFFF26;
    border-radius: 2rem;
    backdrop-filter: blur(8px);
    box-sizing: border-box;
    background-color: #FFFFFF26;
}


.content .icon {
    margin-right: 0.3rem;
    width: 1.5rem;
    height: 1.5rem;
}


.warn {
    color: #E3A008FF
}

.error {
    color: #F85149FF;
}

.success {
    color: #3FB950FF;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
    transform: translateX(-50%) translateY(-100%);
}

.v-enter-to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
}



.v-enter-active,
.v-leave-active {
    transition: all 0.3s ease;
}
</style>