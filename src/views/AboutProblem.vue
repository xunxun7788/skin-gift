<template>
    <div class="about-layout">
        <div v-for="value in textArr" class="rule-text">
            <div v-for="(item, index) in value" class="base-col" :key="index">
                <span :style="{ 'color': $t(item).startsWith('#') ? 'white' : '#999' }">{{ $t(item).replace('#', '')
                    }}</span>
            </div>
        </div>
    </div>

</template>

<script lang="ts" setup>


const textArr = [
    [
        'aboutProblem.invite.q1',
        'aboutProblem.invite.a1',
        'aboutProblem.invite.q2',
        'aboutProblem.invite.a2',
        'aboutProblem.invite.tip'
    ]
]


</script>

<style scoped>
.about-layout {
    display: flex;
    width: 100%;
    overflow-y: auto;
    box-sizing: border-box;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    background-color: #171A21FF;
    border-radius: .66rem;
    box-shadow: inset 0 0 0 1px #333A47FF;
}

.rule-text {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
</style>