<script lang="ts" setup>
const { locale } = useI18n()
const { availableAlternateLinks } = useAlternateLinks()
</script>

<template>
    <div
        v-if="availableAlternateLinks.length > 1"
    >
        <nav>
            <ul>
                <li
                    v-for="alternateLink in availableAlternateLinks"
                    :key="alternateLink.url"
                    :class="[$style.item, alternateLink.locale === locale && $style['item--current']]"
                >
                    <a
                        :href="alternateLink.url"
                        :hreflang="alternateLink.locale"
                    >
                        {{ alternateLink.locale }}
                    </a>
                </li>
            </ul>
        </nav>
    </div>
</template>

<style lang="scss" module>
.item {
    &--current {
        opacity: .5;
    }

    &::first-letter {
        text-transform: uppercase;
    }
}
</style>
