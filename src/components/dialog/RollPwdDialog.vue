<template>
    <div class="op-dialog">
        <BaseDialog ref="baseDialogRef">
        </BaseDialog>
        <transition name="layout" @after-leave="props.dismiss">
            <div v-show="isShow" class="op-dialog-body">
                <span class="bold font-32 font-EDEFF3">{{ $t('user.password') }}</span>
                <input type="text" class="pwd-input" v-model="content" :placeholder="$t('user.password')">
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
import BaseDialog from '../BaseDialog.vue';

const props = defineProps(['dismiss', 'onPwd'])

const isShow = ref(false)

const content = ref('')

const baseDialogRef = ref<any>(null)

onMounted(() => {
    isShow.value = true
})

function onConfirm() {
    if (content.value.length <= 0) {
        return
    }
    props.onPwd?.(content.value)
    close_()
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
    width: 300px;
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

.pwd-input {
    box-shadow: inset 0 0 0 1px #6B7280FF;
    height: 2rem;
    background-color: transparent;
    border-radius: 1rem;
    font-size: 16px;
    padding: 0 1rem;
    box-sizing: border-box;
    width: 100%;
}

.pwd-input::placeholder {
    color: #6B7280FF;
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
    .pwd-input {
        height: 44px;
        border-radius: 22px;
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