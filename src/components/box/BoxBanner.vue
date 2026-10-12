<template>
    <div class="box-banner">
        <div v-for="value in bannerList" class="box-banner-item">
            <img class="btn" v-on:click="goToAction(value)" :src="getImageUrl(value.image)" alt="">
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import useHome from '../../hooks/useHome';
import router from '../../router';
import { getImageUrl } from '../../utils';

const { getBannerData, bannerList } = useHome()

onMounted(() => {
    getBannerData()
})

function goToAction(value: any) {
    console.log(value)
    switch (value.action) {
        case "inner":
            router.push({
                name: value.action_url
            })
            break
        case "outer":
            window.open(value.action_url, '_blanck')
            break;
    }
}

</script>


<style scoped>
.box-banner {
    display: flex;
    margin: 0 2rem;
    margin-top: 1rem;
    gap: .5rem;
}

.box-banner-item {
    flex: 1;
    width: 0;
    aspect-ratio: 513 / 260;
}

.box-banner-item img {
    width: 100%;
    height: 100%;
}
</style>