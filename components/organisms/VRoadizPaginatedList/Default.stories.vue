<script setup lang="ts">
import { delay, http, HttpResponse } from 'msw'

const NUM_PAGES = 8

const props = defineProps({
    loadingDelay: {
        type: Number,
        default: 0,
    },
})

useMockRequest(
    http.get('*/items', async ({ request }) => {
        const url = new URL(request.url)
        const itemsPerPageParam = url.searchParams.get('itemsPerPage')
        const pageParam = url.searchParams.get('page')
        const page = typeof pageParam === 'string' ? Number(pageParam) - 1 : 0
        const itemsPerPage = typeof itemsPerPageParam === 'string' ? Number(itemsPerPageParam) : 12

        await delay(props.loadingDelay)

        return HttpResponse.json({
            'hydra:member': Array.from({ length: itemsPerPage }).map((_, index) => ({
                title: `Item ${page * itemsPerPage + index + 1}`,
            })),
            'hydra:totalItems': NUM_PAGES * itemsPerPage,
        })
    }),
)
</script>

<template>
    <NuxtStory>
        <ClientOnly>
            <VRoadizPaginatedList url="/items">
                <template #item="{ item, classNames }">
                    <div
                        v-if="item"
                        :class="[classNames, $style.item]"
                    >
                        {{ item.title }}
                    </div>
                    <div
                        v-else
                        class="loading-animation"
                        :class="[classNames, $style.item]"
                    />
                </template>
            </VRoadizPaginatedList>
        </ClientOnly>
    </NuxtStory>
</template>

<style lang="scss" module>
.item {
    display: flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: 300/350;
    background-color: #eee;
}
</style>
