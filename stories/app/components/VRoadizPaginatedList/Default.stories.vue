<script lang="ts" setup>
import type { RoadizNodesSources } from '@roadiz/types'

// Raw item returned by the API
interface NSArticle extends RoadizNodesSources {
    publishedAt: string
}

// Item exposed in the slot after transform
interface ArticleCard {
    title: string
    href: string
    date: string
}

function toArticleCard(item: NSArticle): ArticleCard {
    return {
        title: item.title || '',
        href: item.url || '#',
        date: new Date(item.publishedAt).toLocaleDateString('fr-FR'),
    }
}
</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant title="Default">
            <VRoadizPaginatedList
                url="/paginated-items"
                :transform="toArticleCard"
                :params="{ itemsPerPage: 6 }"
            >
                <template #item="{ item, classNames }">
                    <div :class="classNames">
                        <template v-if="item">
                            <a :href="item.href">{{ item.title }}</a> — {{ item.date }}
                        </template>
                        <template v-else>
                            Chargement…
                        </template>
                    </div>
                </template>
                <template #no-result>
                    Aucun résultat
                </template>
            </VRoadizPaginatedList>
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Without transform">
            <VRoadizPaginatedList
                url="/paginated-items"
                :params="{ itemsPerPage: 6 }"
            >
                <template #item="{ item, classNames }">
                    <div :class="classNames">
                        {{ item?.title }}
                    </div>
                </template>
            </VRoadizPaginatedList>
        </NuxtStoryVariant>
        <NuxtStoryVariant title="No result">
            <VRoadizPaginatedList
                url="/paginated-items"
                :transform="toArticleCard"
                :params="{ itemsPerPage: 6, search: 'empty' }"
            >
                <template #item="{ item, classNames }">
                    <div :class="classNames">
                        {{ item?.title }}
                    </div>
                </template>
                <template #no-result>
                    Aucun résultat
                </template>
            </VRoadizPaginatedList>
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Error">
            <VRoadizPaginatedList
                url="/paginated-items"
                :transform="toArticleCard"
                :params="{ itemsPerPage: 6, search: 'error' }"
            >
                <template #item="{ item, classNames }">
                    <div :class="classNames">
                        {{ item?.title }}
                    </div>
                </template>
                <template #error="{ error }">
                    Une erreur est survenue ({{ error.statusCode }})
                </template>
            </VRoadizPaginatedList>
        </NuxtStoryVariant>
    </NuxtStory>
</template>
