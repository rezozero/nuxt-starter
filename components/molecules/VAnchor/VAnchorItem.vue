<script  lang="ts" setup="">
export interface VAnchorProps {
    id: string
    href?: string
    label: string
}

const props = defineProps<VAnchorProps>()

const _href = computed(() => {
    return props.href || `#${props.id}`
})

const mounted = ref(false)
const enabled = ref(true)

onMounted(() => {
    mounted.value = true

    const id = _href.value.replace('#', '')
    enabled.value = !!document.getElementById(id)
})

const $style = useCssModule()
const rootClasses = computed(() => {
    return [
        $style.root,
        mounted.value && $style['root--mounted'],
    ]
})
</script>

<template>
    <VTag
        tag="a"
        :class="rootClasses"
        :href="_href"
        :aria-label="$t('scroll_to', { name: label })"
        :inert="!enabled"
        :label="label"
    />
</template>

<style lang="scss" module>
@use "assets/scss/functions/rem" as *;

.root {
    display: flex;
    align-items: center;
    text-decoration: none;
    transition: color 0.3s ease(out-quad);
    white-space: nowrap;

    &:not(#{&}--mounted) {
        cursor: wait;
    }

    &[inert] {
        opacity: 0.4;
    }
}

.icon {
    margin-left: rem(4);
}
</style>
