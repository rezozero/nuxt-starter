<script setup lang="ts">
import { http, HttpResponse } from 'msw'
import alert from '~/assets/stories/fixtures/nodes/alert.json'

useMockRequest(
    http.get('*/alerts', () => {
        return HttpResponse.json({
            'hydra:member': [
                {
                    ...alert,
                },
            ],
        })
    }),
)
</script>

<template>
    <NuxtStory layout="fullscreen">
        <ClientOnly>
            <VRoadizAlertsContainer />
        </ClientOnly>
    </NuxtStory>
</template>
