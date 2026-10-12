<template>
    <div class="lang-layout">
        <div v-on:click="handleChange(item.value)" class="lang-cell" v-for="(item, index) in SUPPORT_LOCALES">
            <div :class="{ 'btn': true, 'lang-cell': true, 'lang-active': tabIndex == index }">
                <img class="size-1rem" :src="`/image/${getNameByLang(item.value)}.png`" alt="">
                {{ getNameByLang(item.value).toUpperCase() }}
            </div>
        </div>
        <div v-if="useUser.isLogin" class="_windows base-row flex-align-center gap-8">
            <div class="line">

            </div>
            <div v-on:click="change(0)" class="coin-btn btn" :class="{ 'coin-btn-active': usdIndex == 0 }">
                <UsdIcon class="size-1rem" :color="usdIndex == 0 ? '#EDEFF3' : null" />
            </div>
            <div v-on:click="change(1)" class="coin-btn btn" :class="{ 'coin-btn-active': usdIndex == 1 }">
                <RsdIcon class="size-1rem" :color="usdIndex == 1 ? '#EDEFF3' : null" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup name="LanguageSwitcher">
import { SUPPORT_LOCALES, setLocale } from "@/i18n";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useUserStore } from "../store/user.ts";
import emitter from "../utils/eventBus.ts";
import RsdIcon from "./icons/main/RsdIcon.vue";
import UsdIcon from "./icons/main/UsdIcon.vue";
const useUser = useUserStore()

const { locale } = useI18n();

const tabIndex = computed(() => {
    return SUPPORT_LOCALES.findIndex((l: any) => l.value === locale.value);
})

const usdIndex = ref(0)

onMounted(() => {
    usdIndex.value = useUser.unitValue == 'usd' ? 0 : 1
})

function getNameByLang(value: string) {
    return value.split('-')[0].toString()
}

const handleRefresh = () => {
    emitter.emit('refreshRoute')
}

function handleChange(value: string) {
    localStorage.setItem('lang', value.split("-")[0]);
    setLocale(value);
    handleRefresh()
}

function change(index: number) {
    usdIndex.value = index;
    useUser.unitValue = index == 0 ? 'usd' : 'rub'
    handleRefresh()
}

</script>

<style scoped>
.lang-layout {
    height: 1.5rem;
    border-radius: 1rem;
    background-color: #262B35FF;
    display: flex;
    gap: .33rem;
    padding-right: .086rem;
    justify-content: start;
    align-items: center;
}

.lang-cell {
    height: 1.3rem;
    border-radius: 1rem;
    display: flex;
    width: 2.42rem;
    gap: .16rem;
    color: #6B7280FF;
    padding-left: .083rem;
    justify-content: start;
    align-items: center;
}

.lang-active {
    color: #EDEFF3FF;
    background-color: #FFFFFF4D;
}

.line {
    width: 1px;
    height: 75%;
    background-color: #FFFFFF26;
}

.coin-btn {
    width: 1.33rem;
    height: 1.33rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 1rem;
}

.coin-btn-active {
    background-color: #FFFFFF26;
}

@media screen and (max-width: 995px) {
    .lang-layout {
        height: 36px;
        width: 129px;
    }

    .lang-cell {
        width: 58px;
        font-size: 14px;
        height: 32px;
        gap: 4px;
    }
}
</style>
