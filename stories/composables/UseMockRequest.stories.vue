<script setup lang="ts">
import { http, HttpResponse } from 'msw'

useMockRequest(
    http.get('*/api/fake-request', () => {
        return HttpResponse.json({
            title: 'My response',
        })
    }),
)

onMounted(() => {
    $fetch('api/fake-request')
        .then((response) => {
            console.log(response)
        })
        .catch((error) => {
            console.error(error)
        })
})
</script>

<template>
    <NuxtStory />
</template>
