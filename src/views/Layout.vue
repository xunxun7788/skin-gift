<template>
    <div class="root-layout">
        <LeftNav></LeftNav>
        <div class="router">
            <Nav></Nav>
            <RouterView></RouterView>
        </div>
    </div>
    <BottomNav />
</template>

<script lang="ts" setup name="Layout">

import { RouterView } from 'vue-router';
import BottomNav from '../components/BottomNav.vue';
import LeftNav from '../components/LeftNav.vue';
import Nav from '../components/Nav.vue';

</script>

<style scoped>
.root-layout {
    display: flex;
    flex-direction: row;
}

.router {
    flex: 1;
    width: 0;
    margin: 30px;
    display: flex;
    flex-direction: column;
}

@media screen and (max-width: 995px) {
    .router {
        padding: var(--window-headerNav-height) 0 0 0;
    }
}
</style>