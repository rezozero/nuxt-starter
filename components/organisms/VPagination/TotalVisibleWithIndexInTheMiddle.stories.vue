<script lang="ts" setup>
const index = ref(5)
</script>

<template>
    <NuxtStory>
        <VPagination
            v-model="index"
            :length="15"
            :total-visible="6"
        />
    </NuxtStory>
</template>
