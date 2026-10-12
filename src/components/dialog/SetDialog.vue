<template>
    <transition name="dialog-fade" @after-leave="dismiss">
        <div v-if="visible" class="dialog-overlay _mobile font-14" @click.self="handleCancel">
            <div class="dialog-container" :style="style" @click.stop>
                <span>{{ $t('common.language') }}</span>
                <language-switcher style="margin-top: 4px;" />
                <span style="margin-top: 16px;">{{ $t('common.currency') }}</span>
                <currency-switcher style="margin-top: 4px;" />
                <div style="margin-top: 16px;display: flex;align-items: center;justify-content: space-between;">
                    <span>{{ $t('common.sound') }}</span>
                    <img v-on:click="changeSound" style="width: 45px;height: 24px;cursor: pointer;touch-action: none;"
                        :src="`/image/switch_${sound ? 'on' : 'off'}.svg`" alt="">
                </div>
            </div>
        </div>
    </transition>
</template>

<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import useConfig from '../../hooks/useConfig.ts';
import LanguageSwitcher from '../LanguageSwitcher.vue';

const { changeSound, sound } = useConfig()

const visible = ref(false)

const props = defineProps({
    op: {
        type: Object
    },
    dismiss: {
        type: Function
    }
})

const style = computed(() => {
    return {
        right: `${props.op?.sx}px`,
        top: `${props.op?.sy}px`
    }
})

onMounted(() => {
    visible.value = true
})


const handleCancel = () => {
    visible.value = false
};

function dismiss() {
    props.dismiss?.()
}


</script>

<style scoped>
.dialog-overlay {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    z-index: 9999;
}

.dialog-container {
    position: absolute;
    display: flex;
    padding: 25px;
    color: #9AA1ADFF;
    flex-direction: column;
    height: fit-content;
    background-color: #171A21FF;
    border-radius: 16px;
    overflow: hidden;
    padding: 16px;
    border-radius: 16px;
    border: solid 1px #333A47FF;
}

.dialog-header {
    text-align: center;
}

.dialog-title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #333;
}

.dialog-content {
    padding: 16px;
    text-align: center;
    color: #666;
    font-size: 14px;
    line-height: 1.5;
    min-height: 60px;
}

.dialog-footer {
    display: flex;
    gap: 16px;
    margin-top: 6px;
}



.dialog-fade-enter-active,
.dialog-fade-leave-active {
    transition: opacity 0.2s ease;
}

.dialog-fade-enter-from,
.dialog-fade-leave-to {
    opacity: 0;
}

.dialog-container {
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dialog-fade-enter-from .dialog-container,
.dialog-fade-leave-to .dialog-container {
    transform: scale(0.7);
    opacity: 0;
}
</style>