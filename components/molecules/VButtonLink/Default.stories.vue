<script lang="ts" setup>
const sizes = ['s', 'm', 'l']
</script>

<template>
    <NuxtStory :class="$style.root">
        <NuxtStoryVariant title="Primary">
            <div v-for="size in sizes" :key="'primary' + size" :class="$style.sizes">
                <VButtonLink :size="size" emphasis="primary" label="Extenal" url="https://google.com" />
                <VButtonLink :reference="{ url: '/path' }" :size="size" emphasis="primary" label="Internal" />
                <VButtonLink
                    :document="{ relativePath: '/document-path.pdf' }"
                    :size="size"
                    emphasis="primary"
                    label="document"
                />
                <VButtonLink :size="size" emphasis="primary" label="Without link" />
            </div>
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Secondary">
            <div v-for="size in sizes" :key="'Secondary' + size" :class="$style.sizes">
                <VButtonLink :size="size" emphasis="secondary" label="Extenal" url="https://google.com" />
                <VButtonLink :reference="{ url: '/path' }" :size="size" emphasis="secondary" label="Internal" />
                <VButtonLink
                    :document="{ relativePath: '/document-path.pdf' }"
                    :size="size"
                    emphasis="secondary"
                    label="document"
                />
                <VButtonLink :size="size" emphasis="secondary" label="Without link" />
            </div>
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Ternary">
            <div v-for="size in sizes" :key="'Ternary' + size" :class="$style.sizes">
                <VButtonLink :size="size" emphasis="ternary" label="Extenal" url="https://google.com" />
                <VButtonLink :reference="{ url: '/path' }" :size="size" emphasis="ternary" label="Internal" />
                <VButtonLink
                    :document="{ relativePath: '/document-path.pdf' }"
                    :size="size"
                    emphasis="ternary"
                    label="document"
                />
                <VButtonLink :size="size" emphasis="ternary" label="Without link" />
            </div>
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<style lang="scss" module>
.root {
    :global(.nuxt-story-variant__main) {
        flex-direction: column;
        align-items: flex-start;
    }
}

.sizes {
    display: flex;
    gap: rem(40);
}
</style>
