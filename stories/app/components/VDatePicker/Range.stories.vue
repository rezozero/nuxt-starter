<script lang="ts" setup>
const datePickerValue = ref({
    start: new Date(),
    end: new Date(),
})
</script>

<template>
    <NuxtStory>
        <div :class="$style.root">
            <VDatePicker v-model.range="datePickerValue" />
        </div>
    </NuxtStory>
</template>

<style lang="scss" module>
.root {
    max-width: 500px;
    margin: 0 auto;
}
</style>
