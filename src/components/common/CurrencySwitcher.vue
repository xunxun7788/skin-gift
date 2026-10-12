<template>
    <div class="currency-layout _mobile">
        <div v-on:click="change(0)" class="currency-cell" :class="{ 'active': tabIndex == 0 }">
            <UsdIcon class="size-1rem" :color="tabIndex == 0 ? '#EDEFF3' : null" />
        </div>
        <div v-on:click="change(1)" class="currency-cell" :class="{ 'active': tabIndex == 1 }">
            <RsdIcon class="size-1rem" :color="tabIndex == 1 ? '#EDEFF3' : null" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useUserStore } from '../../store/user.ts';
import emitter from '../../utils/eventBus.ts';
import RsdIcon from '../icons/main/RsdIcon.vue';
import UsdIcon from '../icons/main/UsdIcon.vue';

const useUser = useUserStore()

const tabIndex = ref(0)

onMounted(() => {
    tabIndex.value = useUser.unitValue == 'usd' ? 0 : 1
})

function change(index: number) {
    tabIndex.value = index;
    useUser.unitValue = index == 0 ? 'usd' : 'rub'
    emitter.emit('refreshRoute')
}

</script>

<style scoped>
.currency-layout {
    height: 36px;
    gap: 8.5px;
    display: flex;
    align-items: center;
    border-radius: 18px;
    padding: 2px;
    box-sizing: border-box;
    background-color: #262B35FF;
    width: 129px;
}

.currency-cell {
    width: 58px;
    cursor: pointer;
    touch-action: none;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 32px;
    border-radius: 16px;
}

.currency-layout .active {
    background-color: #FFFFFF4D;
}
</style>