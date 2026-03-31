<template>
    <NuxtStory>
        <VPopover label="Label">
            <template #default="{ attrs, open, toggle, assignRef }">
                <VMenuItem
                    v-bind="attrs"
                    :ref="assignRef"
                    :icon-name="open ? 'ArrowSimpleUp' : 'ArrowSimpleDown'"
                    @click="toggle"
                >
                    Custom button
                </VMenuItem>
            </template>
            <template #popover-content>
                Test
            </template>
        </VPopover>
    </NuxtStory>
</template>

<script setup lang="ts">
</script>
