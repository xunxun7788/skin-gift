<template>
    <div v-if="loadState > 0" class="state-layout">
        <div v-show="loadState == 2"
            style="display: flex;justify-content: center;flex-direction: column;align-items: center;">
            <img class="icon" :src="`/image/${emptyIcon ?? 'empty'}.svg`">
            <span class="text">{{ $t(emptyText ?? 'common.noData') }}</span>
        </div>
        <div v-show="loadState == 1" style="position: absolute;width: 100%;height: 100%;">
            <OverLoading :is-show-mask="false" style="position: absolute;" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import OverLoading from './OverLoading.vue';


defineProps(['loadState', 'emptyText', 'emptyIcon'])

</script>

<style scoped>
.state-layout {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.icon {
    height: 4rem;
    margin-bottom: 0.3rem;
}

.text {
    font-size: 0.8rem;
    color: #999;
}

@media screen and (max-width:995px) {
    .icon {
        height: 80px;
    }

    .text {
        font-size: 14px;
    }
}
</style>