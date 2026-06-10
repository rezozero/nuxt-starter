<script lang="ts" setup></script>

<template>
    <NuxtStory>
        <NuxtStoryVariant>
            <VButton>
                <template #default="{ itemClass }">
                    <span :class="itemClass">Default slot label</span>
                </template>
                <template #icon="{ itemClass }">
                    <VIcon :class="itemClass" name="check" />
                </template>
            </VButton>
            <VButton tag="div" size="lg">
                <template #icon="{ itemClass }">
                    <VIcon :class="itemClass" name="check" />
                </template>
                <template #default="{ itemClass }">
                    <h1 :class="itemClass">Default slot label</h1>
                </template>
            </VButton>
        </NuxtStoryVariant>
    </NuxtStory>
</template>
