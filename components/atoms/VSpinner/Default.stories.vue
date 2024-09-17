<script lang="ts" setup>
const playState = ref('running')
const size = ref(200)

function toggle() {
    playState.value = playState.value === 'running' ? 'paused' : 'running'
}
</script>

<template>
    <NuxtStory>
        <template #aside>
            <button @click="toggle">State: {{ playState }}</button>
            <div>
                <label for="size">Size </label>
                <input id="spinner-size" v-model="size" type="number" name="size" min="10" max="500" step="10" /><span
                    >px</span
                >
            </div>
        </template>
        <VSpinner :play-state="playState" :class="$style.root" :size="size" />
    </NuxtStory>
</template>

<style lang="scss" module>
.root {
}
</style>
