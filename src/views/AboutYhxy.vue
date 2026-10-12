<template>
    <div class="about-layout">
        <div class="rule-text font-16 font-9AA1AD">
            <div v-for="(item, index) in textArr" :key="index">
                <span>{{ $t(item).replace('#', '') }}</span>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>


const textArr = ['aboutAgreement.content']

</script>

<style scoped>
.about-layout {
    display: flex;
    width: 100%;
    overflow-y: auto;
    box-sizing: border-box;
    padding: 1rem;
    margin-bottom: 1rem;
    background-color: #171A21FF;
    border-radius: .66rem;
    box-shadow: inset 0 0 0 1px #333A47FF;
}


.rule-text {
    gap: 1rem;
    display: flex;
    white-space: pre-line;
    flex-direction: column;
    overflow-y: auto;
}
</style>