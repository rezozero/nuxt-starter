<script lang="ts" setup>
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
        :aria-label="$t('v_breadcrumb.aria_label')"
        role="navigation"
    >
        <template
            v-for="(item, itemIndex) in items"
            :key="item.url"
        >
            <NuxtLink
                :class="$style.item"
                :to="item.url"
            >
                {{ item.label }}
            </NuxtLink>
            <slot :is-last="itemIndex !== items.length - 1">
                <span
                    v-if="itemIndex !== items.length - 1"
                    :class="$style.separator"
                >/</span>
            </slot>
        </template>
    </nav>
</template>

<style lang="scss" module>
.root {
    display: var(--v-breadcrumbs-display, flex);
    align-items: center;
    column-gap: var(--spacing-4xs);

    @include media('>=md') {
        column-gap: var(--spacing-lg);
    }
}

.item {
    color: var(--colors-breadcrumb-item-content, #000);

    &:not(:where(a)) {
        color: var(--colors-breadcrumb-item-content-disabled, #eee);
    }

    &:global(.router-link-exact-active) {
        text-decoration: none;
    }
}

.separator {
    display: block;
    margin-inline: var(--spacing-6xs, 0.375rem);
}
</style>
