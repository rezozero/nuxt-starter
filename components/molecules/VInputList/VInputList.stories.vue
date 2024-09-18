<script lang="ts" setup>
const data = {
    name: 'input_list',
    label: 'Input list label',
    options: [...new Array(6)].map((_value, i) => {
        return {
            label: `label ${i}`,
            value: `option_value_${i}`,
        }
    }),
}

const multiValue = ref([])
</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant title="default">
            <VInputList
                id="unique"
                :class="$style.input"
                v-bind="data"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Multiple">
            <VInputList
                id="multiple"
                v-model:model-value="multiValue"
                :class="$style.input"
                multiple
                v-bind="data"
            />
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<style lang="scss" module>
.input {
    width: 100%;
}
</style>
