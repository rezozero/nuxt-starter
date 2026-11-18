<script lang="ts" setup>
import { getLocaleEndonym } from '~/utils/i18n/get-locale-endonym'

const { locale } = useI18n()
const { availableAlternateLinks } = useAlternateLinks()

// Each language is named in itself ('Français', 'English'…), so that visitors recognize their own
const items = computed(() => availableAlternateLinks.value.map(alternateLink => ({
    ...alternateLink,
    label: alternateLink.locale ? getLocaleEndonym(alternateLink.locale) : '',
    isCurrent: alternateLink.locale === locale.value,
})))
</script>

<template>
    <div
        v-if="items.length > 1"
    >
        <nav :aria-label="$t('lang_switch.aria_label')">
            <ul>
                <li
                    v-for="item in items"
                    :key="item.url"
                    :class="[$style.item, item.isCurrent && $style['item--current']]"
                >
                    <a
                        :href="item.url"
                        :hreflang="item.locale"
                        :lang="item.locale"
                        :aria-current="item.isCurrent ? 'page' : undefined"
                    >
                        {{ item.label }}
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
}
</style>
