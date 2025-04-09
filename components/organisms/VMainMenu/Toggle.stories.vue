<script setup lang="ts">
import commonContent from './fixtures/common-content.json'
import { COMMON_CONTENT_KEY } from '~/composables/use-common-content'

const menuIsOpen = ref(true)

useNuxtApp().payload.data[COMMON_CONTENT_KEY] = commonContent
</script>

<template>
    <NuxtStory layout="fullscreen">
        <VButton
            filled
            @click="menuIsOpen = !menuIsOpen"
        >
            Open
        </VButton>
        <VMainMenu v-model:open="menuIsOpen" />
    </NuxtStory>
</template>
