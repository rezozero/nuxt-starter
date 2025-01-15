<script lang="ts" setup>
import { http, HttpResponse } from 'msw'
import type { CommonContent } from '~/types/api'

const isOpen = ref(false)

useMockRequest(http.get('/common_content', () => {
    return HttpResponse.json({
        menus: {
            mainMenuWalker: {
                '@id': '1',
                '@type': 'menu',
                'item': {
                    '@id': '1',
                    '@type': 'menu',
                },
                'children': [],
            },
        },
    } as CommonContent)
}))
</script>

<template>
    <NuxtStory layout="fullscreen">
        <VButton
            filled
            @click="isOpen = !isOpen"
        >
            Open
        </VButton>
        <VMainMenu :open="isOpen" />
    </NuxtStory>
</template>
