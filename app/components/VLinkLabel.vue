<script lang="ts" setup>
import { LINK_CONTEXT_SEPARATOR } from '~/utils/a11y/link-label'

// A generic link label ("Learn more") followed by its context (the card title) as visually hidden text,
// so the link is unique out of context, see `getLinkLabelWithContext()`
defineProps<{
    label: string
    context?: string
}>()
</script>

<template>
    {{ label }}<span
        v-if="context"
        class="visually-hidden"
    >{{ LINK_CONTEXT_SEPARATOR }}{{ context }}</span>
</template>
