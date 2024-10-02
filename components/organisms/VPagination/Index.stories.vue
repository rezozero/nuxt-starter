<script lang="ts" setup>
const index = ref(2)
</script>

<template>
    <NuxtStory>
        <VPagination
            v-model="index"
            :length="3"
        />
    </NuxtStory>
</template>
