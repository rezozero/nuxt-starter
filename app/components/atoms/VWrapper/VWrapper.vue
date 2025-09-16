<script lang="ts" setup>
import type { ComponentOrTagName } from '~~/types/app'

/**
* An HTML tag name or a component used to wrap the output. Output is not
* wrapped by default.
*
* @defaultValue `"template"` (no wrapper)
*/
defineProps<{
    wrapper: ComponentOrTagName | false | undefined
}>()

defineOptions({
    inheritAttrs: false,
})
</script>

<template>
    <component
        :is="wrapper"
        v-if="wrapper"
        v-bind="$attrs"
    >
        <slot />
    </component>
    <template v-else>
        <slot />
    </template>
</template>
