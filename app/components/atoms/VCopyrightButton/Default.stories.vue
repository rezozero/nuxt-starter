<script setup lang="ts">

</script>

<template>
    <NuxtStory :class="$style.root">
        <NuxtStoryVariant>
            <VCopyrightButton />
        </NuxtStoryVariant>
        <NuxtStoryVariant>
            <VCopyrightButton label="Custom label" />
        </NuxtStoryVariant>
        <NuxtStoryVariant>
            <VCopyrightButton>
                <VIcon
                    name="copyright"
                    size="1rem"
                />
            </VCopyrightButton>
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<style lang="scss" module>
.root {
    background-color: lightgrey;
}
</style>
