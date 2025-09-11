<script lang="ts" setup>
import { NuxtLink } from '#components'
import { joinURL } from 'ufo'
import type { BreadcrumbItem } from '~/composables/use-roadiz-breadcrumb'
import { getJsonLdScriptContent } from '~/utils/json-ld'

const props = defineProps<{
    items: BreadcrumbItem[]
}>()

const route = useRoute()
const enrichedItems = computed(() => {
    return props.items.map((item) => {
        const isCurrent = item.url && item.url === route.path
        const node = isCurrent || !item.url ? 'span' : NuxtLink

        return {
            ...item,
            node,
            to: node === 'span' ? undefined : item.url,
            isCurrent,
        }
    })
})

if (props.items.length > 1 && import.meta.server) {
    const siteUrl = useRuntimeConfig().public.site.url
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListOrder': 'Ascending',
        'itemListElement': props.items
            .filter(i => i.url)
            .map((item, index) => {
                return {
                    '@type': 'ListItem',
                    'position': index + 1,
                    'name': item.label,
                    'item': joinURL(siteUrl, item.url!),
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
            v-for="(item, itemIndex) in enrichedItems"
            :key="item.url || item.label"
        >
            <slot>
                <span
                    v-if="itemIndex !== 0"
                    :class="$style.separator"
                    aria-hidden="true"
                > / </span>
            </slot>
            <component
                :is="item.node"
                :class="$style.item"
                :to="item.to"
                :aria-current="item.isCurrent ? 'page' : undefined"
            >
                {{ item.label }}
            </component>
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
