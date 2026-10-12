<template>
    <div class="help-dialog">
        <BaseDialog ref="baseDialogRef">
        </BaseDialog>
        <transition name="layout" @after-leave="props.dismiss">
            <div v-show="isShow" class="help-dialog-body">
                <span class="font-26 font-EDEFF3">
                    {{ $t('battle.gameIntro') }}
                </span>
                <div class="help-dialog-text font-16 font-9AA1AD">
                    <span v-for="value in 7">
                        {{ $t(`rollHelp.rule${value}`) }}
                    </span>
                </div>

                <div v-on:click="close_" class="close-btn btn">
                    <img src="/image/close.svg" alt="">
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import BaseDialog from '../BaseDialog.vue';

const props = defineProps(['dismiss', 'type', 'text', 'price', 'onConfirm'])

const isShow = ref(false)


const baseDialogRef = ref<any>(null)

onMounted(() => {
    isShow.value = true
})

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

.op-dialog-actions {
    display: flex;
    width: 100%;
    align-items: center;
    gap: 1rem;
    height: 2rem;
}

.op-dialog-btn {
    flex: 1;
    height: 100%;
    background-color: #333A47FF;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #EDEFF3FF;
    border-radius: 1rem;
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