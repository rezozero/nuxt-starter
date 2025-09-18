<script setup lang="ts">
const content = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas a urna vitae mauris pharetra blandit ac id libero. Aenean vehicula arcu vitae leo mattis, in sodales arcu lacinia. Sed posuere lacus et sem condimentum tristique. Donec et nunc quam. Vivamus mattis justo ac tristique efficitur. In quis enim eget lectus iaculis vulputate. Donec pretium odio gravida purus egestas commodo. Nulla facilisi. Sed mattis, lorem quis fermentum blandit, eros lorem pulvinar felis, fringilla tempor nunc ex sed ligula.'
</script>

<template>
    <NuxtStory
        :class="$style.root"
    >
        <VClampedText
            :content="content"
            :ui="{
                content: $style.content,
            }"
        >
            <template #default="{ toggle, id, ariaLabel, isExpanded }">
                <button
                    :aria-controls="id"
                    :aria-label="ariaLabel"
                    :class="$style.toggle"
                    @click="toggle"
                >
                    <VIcon
                        :name="isExpanded ? 'MinusMD' : 'PlusMD'"
                        role="button"
                        size="2rem"
                    />
                </button>
            </template>
        </VClampedText>
    </NuxtStory>
</template>

<style lang="scss" module>
.content {
    max-width: min(100%, 70ch);
}

.toggle {
    margin-top: 4px;
    cursor: pointer;
}
</style>
