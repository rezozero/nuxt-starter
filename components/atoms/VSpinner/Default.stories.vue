<script lang="ts" setup>
const playState = ref('running')

function toggle() {
    playState.value = playState.value === 'running' ? 'paused' : 'running'
}
</script>

<template>
    <NuxtStory>
        <template #aside>
            <h3>Current state: {{ playState }}</h3>
            <button @click="toggle">
                Toggle state
            </button>
        </template>
        <VSpinner
            :play-state="playState"
            :class="$style.root"
        />
    </NuxtStory>
</template>

<style lang="scss" module>
.root {
    width: 200px;
    height: 200px;
}
</style>
