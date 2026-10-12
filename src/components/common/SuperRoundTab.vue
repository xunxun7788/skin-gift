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
import { ref } from 'vue';

const p = defineProps(['tabArr', 'onChange'])

const tabIndex = ref(0)

function setTabIndex(index: number) {
    tabIndex.value = index
    p.onChange?.(index);
}

</script>


<style scoped>
.super-tab {
    height: 2rem;
    gap: .4rem;
    box-sizing: border-box;
    padding: 3px;
    width: fit-content;
    flex-shrink: 0;
    box-shadow: inset 0 0 0 1px #333A47FF;
    border-radius: 1rem;
    display: flex;
}

.super-tab-cell {
    cursor: pointer;
    gap: .33rem;
    touch-action: none;
    position: relative;
    display: flex;
    padding: 0 .66rem;
    color: #6B7280FF;
    font-weight: bold;
    display: flex;
    align-items: center;
    border-radius: 1rem;
}

.super-tab-cell-active {
    background-color: #FFFFFF4D;
    color: #EDEFF3FF;
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
        height: 48px;
    }
}
</style>