<script setup lang="ts">
const national = ref('')
const international = ref('')
</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant title="tel-national">
            <VInput
                v-model="national"
                autocomplete="tel-national"
                label="Téléphone"
                description="Format attendu : 06 12 34 56 78"
                name="tel-national"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="tel (international)">
            <VInput
                v-model="international"
                autocomplete="tel"
                label="Téléphone international"
                description="Format attendu : +33 6 12 34 56 78"
                name="tel"
            />
        </NuxtStoryVariant>
    </NuxtStory>
</template>
