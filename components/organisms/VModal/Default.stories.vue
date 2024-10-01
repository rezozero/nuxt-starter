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

        <VModal
            v-if="!hasLeave"
            v-model="isOpen"
            @enter="hasLeave = false"
            @after-leave="hasLeave = true"
        >
            <div :class="$style.content">
                content test
            </div>
        </VModal>
    </NuxtStory>
</template>

<style lang="scss" module>
.root {
    min-height: 200vh;
}

.button {
    position: sticky;
    top: rem(30);
}

.content {
    padding: rem(40);
    border: 1px solid black;
    margin: rem(50);
}
</style>
