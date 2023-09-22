<template>
    <nav v-if="breadcrumbs?.items.length" aria-label="Breadcrumb" class="breadcrumb">
        <ol>
            <li v-if="homePage">
                <nuxt-link :to="homePage.url">{{ homePage.title }}</nuxt-link>
            </li>
            <li v-for="(breadcrumb, index) in breadcrumbs.items" :key="index">
                <nuxt-link :to="breadcrumb.url">{{ breadcrumb.title }}</nuxt-link>
            </li>
        </ol>
    </nav>
</template>

<script setup lang="ts">
import { RoadizBreadcrumbs, RoadizNodesSources } from '@roadiz/abstract-api-client/dist/types/roadiz'
import { PropType } from 'vue'

defineProps({
    breadcrumbs: Object as PropType<RoadizBreadcrumbs>,
    homePage: Object as PropType<RoadizNodesSources>,
})
</script>
