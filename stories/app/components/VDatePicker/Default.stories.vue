<script lang="ts" setup>
const date = ref<Date | Date[] | null>(new Date())
</script>

<template>
    <NuxtStory>
        <div :class="$style.root">
            <VDatePicker v-model="date" />
            <output :class="$style.output">{{ date }}</output>
        </div>
    </NuxtStory>
</template>

<style lang="scss" module>
.root {
    max-width: 500px;
    margin: 0 auto;
}

.output {
    display: block;
    margin-top: 16px;
    text-align: center;
}
</style>
