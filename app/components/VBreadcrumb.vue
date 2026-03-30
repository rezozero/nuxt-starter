<script lang="ts" setup>
import { NuxtLink } from '#components'
import { joinURL } from 'ufo'
import type { BreadcrumbItem } from '~/composables/use-roadiz-breadcrumb'
import { getJsonLdScriptContent } from '~/utils/json-ld'

const props = defineProps<{
    items: BreadcrumbItem[]
}>()

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
        :aria-label="$t('breadcrumb.aria_label')"
        role="navigation"
    >
        <ol :class="$style.list">
            <li
                v-for="item in items"
                :key="(item.url || '') + '-' + (item.label || '')"
                :class="$style.item"
            >
                <NuxtLink
                    :to="item.url"
                    :class="$style.link"
                >
                    {{ item.label }}
                </NuxtLink>
            </li>
        </ol>
    </nav>
</template>

<style lang="scss" module>
.list {
    display: var(--v-breadcrumb-list-display, inline-flex);
    align-items: center;
    padding: 0;
    margin: 0;
    list-style: none;
}

.item {
    & + &::before {
        display: inline-block;
        height: 12px;
        border-right: 1px solid currentcolor;
        content: "";
        margin-inline: 7px;
        transform: rotate(15deg);
    }
}

.link {
    &[href=""],
    &:global(.router-link-exact-active) {
        text-decoration: none;
    }
}
</style>
