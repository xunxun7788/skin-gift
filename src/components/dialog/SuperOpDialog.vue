<template>
    <div class="op-dialog">
        <BaseDialog ref="baseDialogRef">
        </BaseDialog>
        <transition name="layout" @after-leave="props.dismiss">
            <div v-show="isShow" class="op-dialog-body">
                <span class="bold font-32 font-EDEFF3 mobile-title">{{ $t('opDialog.tip') }}</span>
                <div v-if="type == 'joinBattle'" class="font-9AA1AD font-16">
                    <span>{{ $t('opDialog.confirmConsume') }}</span>
                    <span class="font-EDEFF3">{{ priceUnit() }}{{ formatCoin(price) }}</span>
                    {{ $t('opDialog.joinBattleQuestion') }}
                </div>
                <div v-else class="font-16 font-9AA1AD"> {{ $t(text) }}</div>
                <div class="op-dialog-actions font-18 bold">
                    <div v-on:click="close_" class="op-dialog-btn btn">
                        {{ $t('opDialog.cancel') }}
                    </div>
                    <div v-on:click="onConfirm" class="op-dialog-btn btn color-FFBF00 font-1A1206">
                        {{ $t('opDialog.confirm') }}
                    </div>
                </div>
            </div>
        </transition>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { formatCoin, priceUnit } from '../../utils/index.ts';
import BaseDialog from '../BaseDialog.vue';

const props = defineProps(['dismiss', 'type', 'text', 'price', 'onConfirm'])

const isShow = ref(false)

const baseDialogRef = ref<any>(null)

onMounted(() => {
    isShow.value = true
})

function onConfirm() {
    close_()
    props.onConfirm?.()
}

function close_() {
    if (baseDialogRef.value) {
        baseDialogRef.value.close()
    }
    isShow.value = false
}

</script>

<style scoped>
.op-dialog {
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

.op-dialog-body {
    width: 500px;
    gap: 1.3rem;
    justify-content: center;
    align-items: center;
    background-color: #171A21FF;
    border-radius: .66rem;
    border: 1px solid #333A47FF;
    padding: 1rem;
    display: flex;
    flex-direction: column;
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

@media screen and (max-width: 995px) {

    .mobile-title {
        font-size: 18px;
    }

    .op-dialog-body {
        width: 55%;
        gap: 15px;
        padding: 15px;
    }

    .op-dialog-actions {
        height: 44px;
    }

    .op-dialog-btn {
        border-radius: 22px;
    }
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