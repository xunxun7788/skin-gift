<template>
    <div class="help-dialog">
        <BaseDialog ref="baseDialogRef">
        </BaseDialog>
        <transition name="layout" @after-leave="props.dismiss">
            <div v-show="isShow" class="help-dialog-body">
                <div class="title">
                    {{ $t('common.gameIntro') }}
                </div>
                <div class="rule-text">
                    <p>{{ $t('fuliHelp.rule1') }}</p>
                    <br>
                    <table border="1" style="border-collapse:collapse;width: 100%;">
                        <tbody>
                            <!-- 表头：字段名称 -->
                            <tr>
                                <td align="center">{{ $t('fuliHelp.level') }}</td>
                                <td align="center">{{ $t('fuliHelp.levelValue') }}</td>
                            </tr>
                            <!-- 循环每一条helpData，一条数据 = 一行tr -->
                            <tr v-for="item in helpData" :key="item.level">
                                <td align="center">
                                    <span class="font-FFBF00 din bold">{{ item.level }}</span>
                                </td>
                                <td align="center" style="color: var(--color-d6);">
                                    {{ item.accumulate_num }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <br>
                    <p>{{ $t('fuliHelp.rule1Note') }}</p>
                </div>

                <div v-on:click="close_" class="close-btn btn">
                    <img src="/image/close.svg" alt="">
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue';
import useFuli from '../../hooks/useFuli.ts';
import BaseDialog from '../BaseDialog.vue';
const { apiFuliHelp } = useFuli()
const helpData = reactive<any[]>([])
const props = defineProps(['dismiss', 'type', 'text', 'price', 'onConfirm'])

const isShow = ref(false)


const baseDialogRef = ref<any>(null)

onMounted(() => {
    isShow.value = true
    getData()
})

async function getData() {
    const result = await apiFuliHelp()
    if (result) {
        Object.assign(helpData, result.data.data.level)
    }
}

function close_() {
    if (baseDialogRef.value) {
        baseDialogRef.value.close()
    }
    isShow.value = false
}

</script>

<style scoped>
.help-dialog {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 200;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.help-dialog-body {
    position: relative;
    width: 500px;
    max-height: 60%;
    overflow-y: auto;
    justify-content: center;
    align-items: center;
    background-color: #171A21FF;
    border-radius: .66rem;
    border: 1px solid #333A47FF;
    padding: 1rem;
    display: flex;
    flex-direction: column;
}

.help-dialog-text {
    display: flex;
    overflow-y: auto;
    margin-top: 1rem;
    gap: 1.3rem;
    flex-direction: column;
}

.close-btn {
    position: absolute;
    right: .5rem;
    padding: .5rem;
    top: .5rem;
}


.rule-text {
    flex-grow: 1;
    padding: 0 0.6rem;
    margin-top: 1rem;
    font-size: var(--font-size-18);
    color: #9AA1AD;
    overflow-y: auto;
}

.title {
    height: 8%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    font-size: 1rem;
}

.layout-enter-active {
    animation: anima-layout-in 0.3s ease;
}

.layout-leave-active {
    animation: anima-layout-out 0.3s ease;
}

@keyframes anima-layout-in {
    0% {
        opacity: 0;
        transform: scale(.5);
    }

    100% {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes anima-layout-out {
    0% {
        opacity: 1;
    }

    100% {
        opacity: 0;
        transform: scale(.5)
    }
}
</style>