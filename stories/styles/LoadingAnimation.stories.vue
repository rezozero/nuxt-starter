<script setup lang="ts">

</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant title="Global class">
            <div
                class="loading-animation"
                :class="$style.block"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Global mixin">
            <div
                :class="[$style.block, $style['block--loading-animation']]"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Text placeholder">
            <div
                :class="[$style.text]"
            />
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<style module lang="scss">
.block {
    width: 100%;
    max-width: 500px;
    aspect-ratio: 300/200;

    &--loading-animation {
        @include loading-animation;
    }
}

.text {
    @include loading-animation-text-placeholder();

    width: 15ch;
}
</style>
