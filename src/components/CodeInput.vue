<template>
    <div class="code-input-layout">
        <input type="text" @input="inputChange" oninput="value=value.replace(/[^0-9]/g,'')" maxlength="6"
            :placeholder="$t('login.pleaseInputCode')">
        <div @click="getSmsCode" :value="code"
            :class="{ 'code-input-btn': true, 'code-input-timer': showTimeDown > 0 }">{{
                showTimeDown > 0 ? `${showTimeDown}s` : $t('login.getCode') }}</div>
    </div>
</template>

<script lang="ts" setup name="CodeInput">
const { t } = useI18n()

import { onMounted, onUnmounted, ref } from 'vue';
import useHome from '../hooks/useHome'
import { showToast } from '../utils';

const { getCode } = useHome()

const x = defineProps(['getPhone', 'inputChange', 'event'])

const showTimeDown = ref(0)

const code = ref('')

let intervalId = 0

const inputChange = (event: any) => {
    x.inputChange(event.target.value)
}

async function getSmsCode() {
    if (showTimeDown.value > 0) {
        return
    }
    if (x.getPhone.length != 11) {
        showToast({
            'msg': t('login.phoneFormatError')
        })
        return
    }
    const result = await getCode(x.getPhone, x.event ?? 'login')
    if (result) {
        //显示倒计时
        showTimeDown.value = 60
        startTimer()
    }
}

function startTimer() {
    intervalId = setInterval(() => {
        if (showTimeDown.value > 0) {
            showTimeDown.value--
        } else {
            clearInterval(intervalId)
        }
    }, 1000)
}

onUnmounted(() => {
    clearInterval(intervalId)
})

</script>

<style scoped>
.code-input-layout {
    width: 100%;
    position: relative;
    display: flex;
}

input {
    width: 100%;
    height: 1.83rem;
    box-sizing: border-box;
    margin-bottom: 0.4rem;
    padding: 0.2rem 0.52rem;
    color: #bbbbbb;
    border: 2px solid transparent;
    border-radius: 0.17rem;
    background: rgba(255, 255, 255, 0.05);
}

input:focus {
    border: 2px solid #FBC600;
}

/* 暗色模式样式 */
@media (prefers-color-scheme: dark) {
    input {
        background-color: #ffffff22;
    }
}

.code-input-btn {
    height: 1.83rem;
    width: 5rem;
    white-space: nowrap;
    font-weight: normal;
    border-radius: 0.2rem;
    box-sizing: border-box;
    margin-left: 0.32rem;
    margin-bottom: 0.4rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    color: #FBC600;
    cursor: pointer;
    border: 2px solid #FBC600;
    background-color: transparent;
    transition: background-color 0.2s linear;
}

.code-input-timer {
    cursor: not-allowed;
}

.code-input-btn:hover {
    background-color: #FBC60022;
}

@media screen and (max-width : 995px) {
    input {
        font-size: 1rem;
        height: 2.99rem;
        padding: 0.4rem 1rem;
        margin-bottom: 0.8rem;
    }

    .code-input-btn {
        height: 2.99rem;
        width: 7rem;
        padding: 0 0.8rem;
        margin-left: 0.6rem;
        font-size: 1rem;
    }
}
</style>