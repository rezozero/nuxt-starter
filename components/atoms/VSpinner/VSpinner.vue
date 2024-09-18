<script lang="ts" setup>
const playState = ref('running')

function toggle() {
    playState.value = playState.value === 'running' ? 'paused' : 'running'
}
</script>

<template>
    <NuxtStory>
        <template #aside>
            <VButton filled @click="toggle">Toggle state</VButton>
        </template>
        <VSpinner :play-state="playState" :class="$style.root" />
    </NuxtStory>
</template>

<style lang="scss" module>
.root {
    width: 200px;
    height: 200px;
}
</style>
