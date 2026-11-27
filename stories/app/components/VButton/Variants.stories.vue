<script setup lang="ts">
import { vButtonVariant, vButtonSizes } from '~/components/VButton.vue'
</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant
            v-for="variant in vButtonVariant"
            :key="variant"
            :title="variant"
        >
            <div>
                <template
                    v-for="size in vButtonSizes"
                    :key="size"
                >
                    <div :class="$style.row">
                        <VButton
                            :label="`Button label ${size}`"
                            :variant="variant"
                            :size="size"
                            icon-name="check"
                        />
                        <VButton
                            :label="`Button label ${size}`"
                            :variant="variant"
                            :size="size"
                            icon-name="check"
                            disabled
                        />
                    </div>
                </template>
            </div>
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<style lang="scss" module>
.row {
    display: flex;
    margin-bottom: 16px;
    gap: 16px;
}
</style>
