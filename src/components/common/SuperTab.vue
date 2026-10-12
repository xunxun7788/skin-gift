<template>
    <div class="super-tab font-16">
        <div v-on:click="setTabIndex(value.i)" class="super-tab-cell"
            :class="{ 'super-tab-cell-active': tabIndex == value.i }" v-for="value in tabArr">
            {{ $t(value.t) }}
            <div v-if="value.count >= 0" class="super-tab-count font-18">
                {{ value.count }}
            </div>
        </div>
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

const p = defineProps(['tabArr', 'currentIndex', 'onChange'])

const tabIndex = ref(0)

watch(() => p.currentIndex, (v) => {
    tabIndex.value = v
})

onMounted(() => {
    if (p.currentIndex) {
        tabIndex.value = p.currentIndex
    }
})

function setTabIndex(index: number) {
    tabIndex.value = index
    p.onChange?.(index);
}

</script>


<style scoped>
.super-tab {
    position: sticky;
    top: .5rem;
    left: 0;
    z-index: 1;
    height: 2.83rem;
    overflow-y: hidden;
    gap: 1.3rem;
    box-sizing: border-box;
    padding: 0 1rem;
    flex-shrink: 0;
    overflow-x: auto;
    white-space: nowrap;
    background-color: #1F232CFF;
    border-radius: .33rem;
    width: 100%;
    display: flex;
    align-items: center;
}

.super-tab-cell {
    cursor: pointer;
    gap: .33rem;
    touch-action: none;
    position: relative;
    display: flex;
    color: #6B7280FF;
    font-weight: bold;
    display: flex;
    align-items: center;
    transition: all .3s ease;
}

.super-tab-cell-active {
    color: #EDEFF3FF;
    height: 100%;
}

.super-tab-cell-active::after {
    content: '';
    height: .14rem;
    width: 100%;
    border-top-left-radius: .1rem;
    border-top-right-radius: .1rem;
    position: absolute;
    bottom: 0;
    background-color: #FFBF00FF;
}

.super-tab-count {
    color: #9AA1ADFF;
    font-weight: bold;
    display: flex;
    align-items: center;
    background-color: #333A47FF;
    border-radius: 1rem;
    padding: 0 .33rem;
}

@media screen and (max-width: 995px) {
    .super-tab {
        height: 36px;
        padding: 0 16px;
        gap: 20px;
        position: relative;
        background-color: transparent;
    }

    .super-tab-count {
        border-radius: 1rem;
        padding: 0 5px;
        font-size: 14px;
    }

    .super-tab-cell-active::after {
        height: 2px;
    }
}
</style>