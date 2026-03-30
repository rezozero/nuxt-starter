<script setup lang="ts">
import { NuxtLink } from '#components'
import SearchParam from '~/constants/search-param'

const props = defineProps({
    pending: Boolean,
})

const route = useRoute()
const page = computed(() => {
    const page = route.query[SearchParam.PAGE]
    return page ? parseInt(page as string) : 1
})
const to = computed(() => {
    if (props.pending) return

    return { path: route.path, query: { ...route.query, [SearchParam.PAGE]: page.value + 1 } }
})
</script>

<template>
    <component
        :is="to ? NuxtLink : 'span'"
        :class="$style.root"
        :to="to"
        class="text-button-xl"
    >
        {{ $t('load_more') }}
        <VSpinner
            v-if="pending"
            size="24"
            :class="$style.spinner"
        />
    </component>
</template>

<style module lang="scss">
.root {
    position: relative;
    display: flex;
    width: fit-content;
    flex-wrap: wrap;
    align-items: center;
    font-weight: 600;
    gap: px-to-rem(6);
    padding-block: px-to-rem(8);

    &:not([href]) {
        color: #ccc;
        cursor: default;
    }
}
</style>
