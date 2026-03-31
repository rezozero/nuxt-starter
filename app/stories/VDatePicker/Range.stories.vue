<script lang="ts" setup>
const datePickerValue = ref({
    start: new Date(),
    end: new Date(),
})
</script>

<template>
    <NuxtStory>
        <div style="max-width: 500px; margin: 0 auto">
            <VDatePicker v-model.range="datePickerValue" />
        </div>
    </NuxtStory>
</template>
