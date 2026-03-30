<script lang="ts" setup>
const isOpen = ref(false)
const hasLeave = ref(!isOpen.value)

function onClick() {
    isOpen.value = true
    hasLeave.value = false
}
</script>

<template>
    <NuxtStory :class="$style.root">
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
            <div :class="$style.content">
                content test
            </div>
        </LazyVModal>
    </NuxtStory>
</template>

<style lang="scss" module>
.root {
    min-height: 200vh;
}

.button {
    position: sticky;
    top: px-to-rem(30);
}

.content {
    padding: px-to-rem(40);
    border: 1px solid black;
    margin: px-to-rem(50);
}
</style>
