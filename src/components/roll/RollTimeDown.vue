<template>
    <div class="roll-time">
        <span v-if="isShowTip ?? true" class="font-16 bold font-FFBF00 time-font">
            {{ $t('roll.DrawTime') }}
        </span>
        <div v-for="value in dateArr" class="roll-time-box font-FFBF00 font-13">
            <span class="font-FFBF00 bold font-26 din time-value-font">
                {{ value.v }}
            </span>
            <span class="opacity-60 time-value-tip-font">{{ value.t }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';


const p = defineProps(['time', 'isShowTip'])

let timer: number | null = null

const remainSec = ref(0)

onMounted(() => {
    remainSec.value = p.time
    startCountDown()
})

function formatLotteryTime(lotteryTime: number) {
    let totalSec = Math.max(0, lotteryTime);
    const days = Math.floor(totalSec / 86400);
    totalSec = totalSec % 86400;

    const hours = Math.floor(totalSec / 3600);
    totalSec = totalSec % 3600;

    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;

    const dateArr = [
        { 'v': String(days), 't': 'DAYS' },
        { 'v': String(hours), 't': 'HOURS' },
        { 'v': String(mins), 't': 'MIN' },
        { 'v': String(secs), 't': 'SEC' }
    ]
    return dateArr;
}

const dateArr = computed(() => {
    return formatLotteryTime(remainSec.value)
})

function startCountDown() {
    if (timer) clearInterval(timer)
    timer = window.setInterval(() => {
        remainSec.value--
        if (remainSec.value <= 0) {
            remainSec.value = 0
            stopCountDown()
        }
    }, 1000)
}

function stopCountDown() {
    if (timer) {
        clearInterval(timer)
        timer = null
    }
}

onUnmounted(() => {
    stopCountDown()
})

</script>

<style scoped>
.roll-time {
    display: flex;
    width: 100%;
    white-space: pre-line;
    text-align: center;
    align-items: center;
    font-weight: normal;
    justify-content: center;
    height: 2.7rem;
    gap: .33rem;
}

.roll-time-box {
    display: flex;
    align-items: center;
    flex-direction: column;
    border-radius: .33rem;
    justify-content: center;
    background: linear-gradient(180deg, #3a2d0e4d 0%, #e1bd5433 100%);
    width: 2.4rem;
    height: 100%;
}

@media screen and (max-width: 995px) {

    .roll-time {
        height: 54px;
    }

    .time-font {
        font-size: 14px;
    }

    .time-value-font {
        font-size: 18px;
    }

    .time-value-tip-font {
        font-size: 10px;
    }
}
</style>