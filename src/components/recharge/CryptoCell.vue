<template>
    <div class="deposit-cell">
        <img src="/image/btc.svg" alt="">
        <slot></slot>
    </div>
</template>

<script setup lang="ts">


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
    height: 40%;
}
</style>