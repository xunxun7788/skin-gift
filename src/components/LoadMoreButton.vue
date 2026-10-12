<template>
    <div class="layout">
        <div @click="loadData" v-if="loadStatus == 1" class="btn font-14">
            {{ $t('common.clickToLoad') }}
        </div>
        <div v-else-if="loadStatus == 2">
            <div class="loading-spinner"></div>
        </div>
        <div class="font-16 font-EDEFF3" v-else-if="loadStatus == 3">
            {{ $t('common.noMore') }}
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';


const loadStatus = ref(0)

function chageStatus(status: number) {
    loadStatus.value = status
}

const loadData = () => {
    chageStatus(2)
    emit('loadData')
}

const emit = defineEmits(['loadData'])

defineExpose({ chageStatus })

</script>

<style scoped>
.layout {
    width: 100%;
    display: flex;
    justify-content: center;
}

.btn {
    background-color: var(--theme-color);
    height: 2rem;
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 0 3rem;
    color: #060403;
    font-weight: bold;
    border-radius: 1rem;
}


@media screen and (max-width:995px) {
    .btn {
        height: 44px;
        padding: 0 16px;
        font-weight: bold;
    }

}

.loading-spinner {
    border: 0.3rem solid #f3f3f3;
    border-top: 0.15rem solid var(--theme-color);
    border-radius: 50%;
    width: 2rem;
    height: 2rem;
    animation: spin 1s linear infinite, show 0.2s ease;
}

@keyframes mask {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

@keyframes show {
    0% {
        transform: scale(0);
    }

    100% {
        transform: scale(1);
    }
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }

    100% {
        transform: rotate(360deg);
    }
}
</style>