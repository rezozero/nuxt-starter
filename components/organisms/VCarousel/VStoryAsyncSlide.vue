<script setup lang="ts">
defineProps({
    index: Number,
})
</script>

<template>
    <div :class="$style.root">Slide {{ index }}</div>
</template>

<style module lang="scss">
.root {
    --v-carousel-slide-width: #{rem(400)};
    --v-carousel-slide-margin-right: #{rem(20)};

    height: rem(200);
    border: 1px solid green;
    background-color: lightgray;
}
</style>
