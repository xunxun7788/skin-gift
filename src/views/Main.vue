<template>
    <div class="main-layout">
        <MainLeft />
        <div class="main-body">
            <MainTop />
            <div class="router">
                <router-view v-slot="{ Component }">
                    <keep-alive :include="['Box']">
                        <component :is="Component" />
                    </keep-alive>
                </router-view>
            </div>
        </div>
        <BottomNav />
    </div>
</template>

<style scoped>
.main-layout {
    background-color: #0E1014;
    display: flex;
    width: 100%;
    height: 100dvh;
    gap: 4px;
    flex-direction: row;
}

.main-body {
    display: flex;
    flex-direction: column;
    flex: 1;
}

.router {
    flex: 1;
    width: 100%;
    position: relative;
    min-width: 0;
    min-height: 0;
}
</style>

<script lang="ts" setup>
import BottomNav from '../components/BottomNav.vue';
import MainLeft from '../components/MainLeft.vue';
import MainTop from '../components/MainTop.vue';


</script>