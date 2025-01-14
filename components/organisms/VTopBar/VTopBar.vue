<script lang="ts" setup>
import { VRoadizLink } from '#components'

const { isHomePage, homePagePath } = await useHomePage()

// Scroll behavior
const { isHidden, isOnPageTop } = useTopBarScroll()

// Style
const $style = useCssModule()
const rootClasses = computed(() => {
    return [
        $style.root,
        isHomePage.value && $style['root--home'],
        isOnPageTop.value && $style['root--page-top'],
        isHidden.value && $style['root--hidden'],
    ]
})
</script>

<template>
    <div
        :class="rootClasses"
    >
        <component
            :is="isHomePage ? 'div' : VRoadizLink"
            :aria-label="isHomePage ? undefined : $t('back_home')"
            :class="$style['logo-wrapper']"
            :url="isHomePage ? undefined : homePagePath"
        >
            Logo
        </component>
    </div>
</template>

<style lang="scss" module>
@use 'assets/scss/functions/rem' as *;
@use 'assets/scss/functions/ease' as *;

.root {
    position: sticky;
    z-index: 10;
    top: 0;
    display: flex;
    height: rem(120);
    align-items: center;
    justify-content: space-between;
    padding-inline: rem(32);
    transition:
        background-color 0.4s ease(out-quad),
        translate 0.4s ease(out-quad);

    &--hidden {
        translate: 0 -100%;
    }

    &:not(.root--page-top) {
        background-color: #ccc;
    }
}
</style>
