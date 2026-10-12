<template>
    <transition name="mask">
        <div v-show="isShow" class="mask">

        </div>
    </transition>

</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';

let isShow = ref(false)



onMounted(() => {
    isShow.value = true
})

function close() {
    isShow.value = false
}

defineExpose({ close })

</script>


<style scoped>
.mask-enter-from,
.mask-leave-to {
    opacity: 0;
}

.mask-enter-active,
.mask-leave-active {
    transition: all 0.3s linear;
}

.mask {
    width: 100%;
    height: 100%;
    position: fixed;
    left: 0;
    top: 0;
    z-index: -1;
    background-color: #00000099;
}
</style>