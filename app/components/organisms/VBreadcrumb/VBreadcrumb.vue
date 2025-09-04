<script lang="ts" setup>
import { NuxtLink } from '#components'
import { joinURL } from 'ufo'
import { getJsonLdScriptContent } from '~/utils/json-ld'

const props = defineProps<{
    items: BreadcrumbItem[]
}>()

if (import.meta.server && props.items.length > 1) {
    const siteUrl = useRuntimeConfig().public.site.url

    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListOrder': 'Descending',
        'itemListElement': props.items
            .filter(i => i.url)
            .map((item, index) => {
                return {
                    '@type': 'ListItem',
                    'position': index + 1,
                    'name': item.label,
                    'item': (item.url && siteUrl && joinURL(siteUrl, item.url)) || undefined,
                }
            }),
    }
    useHead({ script: [getJsonLdScriptContent(structuredData)] })
}
</script>

<template>
    <nav
        v-if="items.length"
        :class="$style.root"
        :aria-label="$t('breadcrumb.aria_label')"
        role="navigation"
    >
        <template
            v-for="(item, itemIndex) in items"
            :key="item.url"
        >
            <component
                :is="item.url ? NuxtLink : 'span'"
                :class="$style.item"
                :to="item.url"
            >
                {{ item.label }}
            </component>
            <slot :is-last="itemIndex !== items.length - 1">
                <span
                    v-if="itemIndex !== items.length - 1"
                    :class="$style.separator"
                > / </span>
            </slot>
        </template>
    </nav>
</template>

<style lang="scss" module>
.root {
    display: var(--v-breadcrumb-display, flex);
    align-items: center;
}

.item {
    &:global(.router-link-exact-active) {
        text-decoration: none;
    }
}

.separator {
    white-space: pre;
}
</style>
