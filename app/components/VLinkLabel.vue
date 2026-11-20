<!-- Same output as `getLinkLabelWithContext()`, the context as visually hidden text -->
<script lang="ts" setup>
import { LINK_CONTEXT_SEPARATOR } from '~/utils/a11y/link-label'

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
