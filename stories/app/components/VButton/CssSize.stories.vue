<template>
    <NuxtStory>
        <NuxtStoryVariant>
            <VButton
                label="default"
                :class="$style.button"
                icon-name="check"
            />
            <VButton
                label="with breakpoint"
                :class="[$style.button, $style['button--responsive']]"
                icon-name="check"
            />
            <VButton
                label="XS"
                :class="[$style.button, $style['button--xs']]"
                icon-name="check"
            />
            <VButton
                label="SM"
                :class="[$style.button, $style['button--sm']]"
                icon-name="check"
            />
            <VButton
                label="MD"
                :class="[$style.button, $style['button--md']]"
                icon-name="check"
            />
            <VButton
                label="LG"
                :class="[$style.button, $style['button--lg']]"
                icon-name="check"
            />
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<style lang="scss" module>
@use 'assets/scss/components/v-button';

.button {
    &--xs {
        @include v-button.size('xs');
    }

    &--sm {
        @include v-button.size('sm');
    }

    &--md {
        @include v-button.size('md');
    }

    &--lg {
        @include v-button.size('lg');
    }

    &--responsive {
        @include v-button.size('xs');

        @include media('>=lg') {
            @include v-button.size('md');
        }

        @include media('>=xxl') {
            @include v-button.size('lg');
        }
    }
}
</style>
