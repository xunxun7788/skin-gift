<template>
    <div v-on:click="onItemClick(data)" class="deposit-cell">
        <img :src="getImageUrl(data.icon)" alt="">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">
import { getImageUrl } from '../../utils';


defineProps(['data', 'onItemClick'])

</script>

<style scoped>
.deposit-cell {
    position: relative;
    background-color: #1F232CFF;
    border-radius: .5rem;
    display: flex;
    height: 4rem;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

.deposit-cell img {
    height: 50%;
}
</style>