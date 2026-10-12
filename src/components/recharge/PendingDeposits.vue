<template>
    <div class="pending-layout">
        <SuperRoundTab :tab-arr="tabArr" />
        <div class="pending-tab margin-top-1rem">
            <span v-for="value in tableArr" :style="{ 'flex': value.flex }">
                {{ $t(value.t) }}
            </span>
        </div>
        <div v-for="value in 10" class="pending-tab pending-cell">
            <span v-for="value in tableArr" :style="{ 'flex': value.flex }">
                {{ $t(value.t) }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import SuperRoundTab from '../common/SuperRoundTab.vue';

const tabArr = [
    {
        't': 'recharge.Cards',
        'i': 0
    },
    {
        't': 'recharge.Crypto',
        'i': 1
    },
    {
        't': 'recharge.GiftCard',
        'i': 2
    },
]

const tableArr = [
    {
        't': 'ID',
        'flex': 140
    },
    {
        't': "recharge.Metod",
        'flex': 213
    },
    {
        't': 'recharge.Sum',
        'flex': 253
    },
    {
        't': 'recharge.Time',
        'flex': 413
    },
    {
        't': 'recharge.Status',
        'flex': 157
    }
]

</script>

<style scoped>
.pending-layout {
    margin: 1rem;
    width: calc(100% - 2rem);
    padding: 1rem;
    display: flex;
    flex-direction: column;
    border-radius: .66rem;
    box-shadow: inset 0 0 0 1px #333A47FF;
    background-color: #171A21FF;
    overflow-y: auto;
    box-sizing: border-box;
}

.pending-tab {
    display: flex;
    padding: 0 1.5rem;
    box-sizing: border-box;
    align-items: center;
    font-weight: bold;
    color: #6B7280FF;
    width: 100%;
    background-color: #1F232CFF;
    border-radius: .33rem;
    height: 2rem;
}

.pending-cell {
    margin-top: 0;
    background-color: transparent;
    color: #9AA1ADFF;
    font-weight: normal;
}
</style>