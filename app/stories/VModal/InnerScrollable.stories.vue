<script lang="ts" setup>
const isOpen = ref(false)
const hasLeave = ref(!isOpen.value)

function onClick() {
    isOpen.value = true
    hasLeave.value = false
}
</script>

<template>
    <NuxtStory>
        <VButton
            :class="$style.button"
            emphasis="secondary"
            @click="onClick"
        >
            Open
        </VButton>
        <LazyVModal
            v-if="!hasLeave"
            v-model="isOpen"
            @enter="hasLeave = false"
            @after-leave="hasLeave = true"
        >
            <div :class="$style.inner">
                content
            </div>
        </LazyVModal>
    </NuxtStory>
</template>

<style lang="scss" module>
.inner {
    height: 200vh;
    background-color: lightgrey;
}
</style>
