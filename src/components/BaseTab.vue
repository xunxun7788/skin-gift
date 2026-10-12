<template>
    <div class="base-tab font-16">
        <div v-for="(item, index) in tabs" :key="index" @click="tabIndex = index"
            :class="{ tab: true, active: tabIndex == index }">
            {{ item }}
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, watch } from "vue";

const x = defineProps({
    tabs: {
        type: Array<string>,
    },
    changeTab: Function
});

let tabIndex = ref(0);

watch(tabIndex, () => {
    x.changeTab(tabIndex.value)
})

function setCurrentTab(index: number) {
    tabIndex.value = index
}

defineExpose({ setCurrentTab })

</script>

<style scoped>
.base-tab {
    height: 2.5rem;
    display: flex;
    gap: 1.5rem;
    flex-shrink: 0;
    flex-direction: row;
    overflow-x: auto;
    position: relative;
    align-items: center;
}


.base-tab::-webkit-scrollbar {
    display: none;
    /* 隐藏滚动条 */
}

.tab {
    position: relative;
    display: flex;
    align-items: center;
    height: 100%;
    font-weight: bold;
    color: #6B7280FF;
    cursor: pointer;
}

.active {
    color: #EDEFF3FF;
}

.active::after {
    content: "";
    width: 100%;
    background-color: var(--theme-color);
    height: .14rem;
    left: 0;
    border-top-left-radius: .1rem;
    border-top-right-radius: .1rem;
    position: absolute;
    bottom: 0;
}

@media screen and (max-width: 995px) {
    .base-tab {
        height: 48px;
    }
}
</style>
