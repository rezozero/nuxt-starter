<template>
    <NuxtStory>
        <VPopover label="Label">
            <template
                #popover="{ attrs, open, close, assignRef }"
            >
                <div
                    v-if="open"
                    v-bind="attrs"
                    :ref="assignRef"
                >
                    Custom popover
                    <VIconButton
                        icon-name="CloseMD"
                        @click="close"
                    />
                </div>
            </template>
        </VPopover>
    </NuxtStory>
</template>

<script setup lang="ts">
</script>
