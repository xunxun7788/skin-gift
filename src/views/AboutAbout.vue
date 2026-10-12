<template>
    <div class="about-layout">
        <div class="rule-text font-16 font-9AA1AD">
            <div v-for="(item, index) in textArr" :key="index">
                <span v-if="(typeof item) == 'string'">{{ $t(item, getRuleParam(index)) }}</span>
            </div>
        </div>
    </div>

</template>

<script lang="ts" setup>
import { config } from '../utils';


const textArr = [
    'aboutAbout.rule1',
    'aboutAbout.rule2',
    'aboutAbout.rule3',
    'aboutAbout.rule4',
    'aboutAbout.rule5',
    'aboutAbout.rule6',
    'aboutAbout.rule7',
    'aboutAbout.rule8',
    'aboutAbout.rule9',
    'aboutAbout.rule10',
    'aboutAbout.rule11',
]

function getRuleParam(index: number): any {
    if (index == 0) {
        return { appName: config.appSimpleName, companyName: config.companyName }
    } else if (index == 10) {
        return { webUrl: config.webUrl }
    }
    return null
}

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
    flex-direction: column;
    overflow-y: auto;
}
</style>