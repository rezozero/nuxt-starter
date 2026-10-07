<script lang="ts" setup>
import type { ComponentOrTagName } from '~~/types/app'

/**
* An HTML tag name or a component used to wrap the slot element.
* Undefined wrapper, will render only slot.
**/

defineProps<{
    wrapper: ComponentOrTagName | false | undefined
}>()

defineOptions({
    inheritAttrs: false, // Don't spread component data on slot elements
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
