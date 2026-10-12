<template>
    <div class="about-layout">
        <span></span>
        <div class="rule-text font-16">
            <div v-for="(item, index) in textArr" :key="index">
                <span>{{ $t(item) }}</span>
            </div>
            <div class="base-row gap-32">
                <div v-for="value in supportArr" class="base-row gap-8 btn">
                    <div class="support-box">
                        <img class="size-1rem" :src="value.img" alt="">
                    </div>
                    <div class="base-col flex-content-center">
                        <span class="font-14 font-6B7280">{{ value.text }}</span>
                        <span class="font-16 font-9AA1AD">{{ value.link }}</span>
                    </div>
                </div>
            </div>

        </div>
    </div>

</template>

<script lang="ts" setup>

const supportArr = [
    {
        'text': 'Telegram',
        'link': '@GIFTSKIN_Support',
        'img': '/image/tg.svg'
    },
    {
        'text': 'Discord',
        'link': 'discord.gg/giftskin',
        'img': '/image/discord.svg'
    },
    {
        'text': 'X (Twitter)',
        'link': '@GIFTSKIN',
        'img': '/image/x.svg'
    }
]

const textArr = [
    'aboutAbout.contact',
]

</script>

<style scoped>
.about-layout {
    display: flex;
    width: 100%;
    overflow-y: auto;
    box-sizing: border-box;
    padding: 1rem;
    background-color: #171A21FF;
    border-radius: .66rem;
    box-shadow: inset 0 0 0 1px #333A47FF;
}

.rule-text {
    gap: 1rem;
    width: 100%;
    display: flex;
    padding: .5rem 0;
    color: #9AA1ADFF;
    flex-direction: column;
    overflow-y: auto;
}

.support-box {
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #262B35FF;
    border-radius: 1rem;
}
</style>