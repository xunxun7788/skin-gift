<template>
    <div v-on:click="doWork" class="drop-button btn gap-8 font-16">
        <span class="text">{{ $t(textValue) }} </span>
        <img :class="{ 'drop-arrow': isFull ?? false, 'drop-arrow-active': isShow }" src="/image/sort.svg" alt="">
        <div class="drop-show-layout font-14" :class="{ 'drop-show-layout-show': isShow }">
            <span v-for="value in data['sub']" v-on:click="changeValue(value)">{{ $t(value['t']) }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const p = defineProps(['data', 'onChange', 'isFull', 'onCheck'])

const isShow = ref(false)

const textValue = ref('')

onMounted(() => {
    textValue.value = p.data['text']
})

async function doWork() {
    const r = await p.onCheck?.()
    if (r == true || r == null) {
        isShow.value = !isShow.value
    }
}

function changeValue(value: any) {
    textValue.value = value['t']
    p.onChange?.(value)
}

</script>


<style scoped>
.drop-button {
    position: relative;
    display: flex;
    border-radius: 1rem;
    height: 1.5rem;
    padding: 0 .7rem;
    align-items: center;
    color: #9AA1ADFF;
    box-shadow: inset 0 0 0 1px #333A47FF;
}

.drop-button .text {
    font-weight: bold;
    min-width: 3.25rem;
}

.drop-button img {
    height: .375rem;
    transition: all .3s ease;
}

.drop-arrow {
    position: absolute;
    right: 0.7rem;
}

.drop-arrow-active {
    transform: rotate(180deg);
}

.drop-show-layout {
    position: absolute;
    z-index: 2;
    left: 0;
    right: 0;
    padding: .5rem .7rem;
    top: 1.8rem;
    width: fit-content;
    scale: 0;
    white-space: nowrap;
    display: flex;
    flex-direction: column;
    transform-origin: top center;
    border: 1px solid #333A47FF;
    border-radius: .5rem;
    background-color: #262B35FF;
    transition: all .3s ease;
}

.drop-show-layout span {
    padding: .25rem 0;
    width: 100%;
    text-align: left;
}

.drop-show-layout-show {
    scale: 1;
}
</style>