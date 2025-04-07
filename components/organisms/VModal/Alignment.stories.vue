<script setup lang="ts">
const isOpen = ref(false)
const hasLeave = ref(!isOpen.value)

const alignments = ['top-left', 'top', 'top-right', 'right', 'bottom-right', 'bottom', 'bottom-left', 'left']
const selectedAlign = ref('')

function onSelect(event: Event) {
    const el = event.target as HTMLSelectElement
    selectedAlign.value = el.options[el.selectedIndex].value
}

function open() {
    isOpen.value = true
    hasLeave.value = false
}
</script>

<template>
    <NuxtStory :class="$style.root">
        <template #aside>
            <p>Modal position on enter:</p>
            <br>
            <select
                id="alignment-select"
                name="alignments"
                @input="onSelect"
            >
                <option value="">
                    --Please choose an alignment--
                </option>
                <option
                    v-for="alignment in alignments"
                    :key="alignment"
                    :value="alignment"
                >
                    {{ alignment }}
                </option>
            </select>
            <br>
            <br>
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
            :align="selectedAlign"
            @after-leave="hasLeave = true"
            @enter="hasLeave = false"
        >
            <div :class="$style.content">
                content
            </div>
        </LazyVModal>
    </NuxtStory>
</template>

<style lang="scss" module>
.root {
    min-height: 300vh;
}

.content {
    min-height: px-to-rem(300);
    padding: px-to-rem(40);
}
</style>
