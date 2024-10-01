<script lang="ts" setup>
const isOpen = ref(false)
const hasLeave = ref(!isOpen.value)

function open() {
    isOpen.value = true
    hasLeave.value = false
}
</script>

<template>
    <NuxtStory :class="$style.root">
        <template #aside>
            <VButton
                emphasis="primary"
                @click="open"
            >
                Open
            </VButton>
        </template>
        <LazyVModal
            v-if="!hasLeave"
            v-model="isOpen"
            :class="$style.modal"
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
.root {
    min-height: 300vh;
}

.modal {
    --v-modal-content-width: #{60vw};

    position: absolute;
    bottom: 0;
    overflow: auto scroll;
    width: 100%;
    height: 50vh;
    min-height: rem(300);
    max-height: 100%;
    padding: rem(40);
}

.inner {
    height: 200vh;
    background-color: lightgrey;
}
</style>
