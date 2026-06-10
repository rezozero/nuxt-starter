<script setup lang="ts">
import { vButtonDesign, vButtonSizes } from '~/components/VButton.vue'
</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant
            v-for="design in vButtonDesign"
            :key="design"
            :title="design"
        >
            <div>
                <template
                    v-for="size in vButtonSizes"
                    :key="size"
                >
                    <div :class="$style.row">
                        <VButton
                            :label="`Button label ${size}`"
                            :design="design"
                            :size="size"
                            icon-name="check"
                        />
                        <VButton
                            :label="`Button label ${size}`"
                            :design="design"
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
