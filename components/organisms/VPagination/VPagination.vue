<script setup lang="ts">
import type { RouteLocationPathRaw } from 'vue-router'

const route = useRoute()
const TRUNCATE_CHARS = '...'

const props = defineProps({
    length: {
        type: Number,
        default: 0,
    },
    totalVisible: {
        type: Number,
        default: 7,
    },
    searchParam: {
        type: String,
        default: 'page',
    },
})

const index = defineModel({
    default: 1,
})

// @see https://github.com/vuetifyjs/vuetify/blob/v2-dev/packages/vuetify/src/components/VPagination/VPagination.ts#L171
function range(from: number, to: number): number[] {
    const range = []

    from = from > 0 ? from : 1

    for (let i = from; i <= to; i++) {
        range.push(i)
    }

    return range
}

// @see https://github.com/vuetifyjs/vuetify/blob/v2-dev/packages/vuetify/src/components/VPagination/VPagination.ts#L89
const items = computed(() => {
    if (props.length <= props.totalVisible) {
        return range(1, props.length)
    }

    const even = props.totalVisible % 2 === 0 ? 1 : 0
    const left = Math.floor(props.totalVisible / 2)
    const right = props.length - left + 1 + even

    if (index.value > left && index.value < right) {
        const firstItem = 1
        const lastItem = props.length
        const start = index.value - left + 2
        const end = index.value + left - 2 - even
        const secondItem = start - 1 === firstItem + 1 ? 2 : TRUNCATE_CHARS
        const beforeLastItem = end + 1 === lastItem - 1 ? end + 1 : TRUNCATE_CHARS

        return [1, secondItem, ...range(start, end), beforeLastItem, props.length]
    }
    else if (index.value === left) {
        const end = index.value + left - 1 - even
        return [...range(1, end), TRUNCATE_CHARS, props.length]
    }
    else if (index.value === right) {
        const start = index.value - left + 1
        return [1, TRUNCATE_CHARS, ...range(start, props.length)]
    }
    else {
        return [...range(1, left), TRUNCATE_CHARS, ...range(right, props.length)]
    }
})

const previousPageDisabled = computed(() => {
    return index.value === 1
})

const nextPageDisabled = computed(() => {
    return index.value === props.length
})

const nextPageTo = computed(() => {
    return !nextPageDisabled.value ? createPageLocation(index.value + 1) : ''
})

const previousPageTo = computed(() => {
    return !previousPageDisabled.value ? createPageLocation(index.value - 1) : ''
})

const createPageLocation = (index: number): RouteLocationPathRaw => {
    return {
        path: route.path,
        query: {
            ...route.query,
            ...{ [props.searchParam]: index.toString() },
        },
    }
}

const { themeClass } = useTheme()
</script>

<template>
    <nav
        :class="[$style.root, themeClass]"
    >
        <ul
            :class="$style.list"
        >
            <li
                v-for="(item, itemIndex) in items"
                :key="`${item}-${itemIndex}`"
                :class="[$style.item, typeof item === 'number' && item === index && $style['item--active']]"
            >
                <NuxtLink
                    v-if="typeof item === 'number'"
                    :to="createPageLocation(item)"
                    :class="$style.item__link"
                    :aria-label="$t('pagination.page_%index%', { index: item })"
                    :aria-current="item === index ? 'page' : undefined"
                >
                    {{ item }}
                </NuxtLink>
                <span v-else>{{ item }}</span>
            </li>
        </ul>
        <div :class="$style.buttons">
            <VButton
                :disabled="previousPageDisabled"
                :to="previousPageTo"
                :aria-label="$t('pagination.previous_page')"
                icon-name="arrow-left"
            />
            <VButton
                :disabled="nextPageDisabled"
                :to="nextPageTo"
                :aria-label="$t('pagination.next_page')"
                icon-name="arrow-right"
            />
        </div>
    </nav>
</template>

<style lang="scss" module>
.root {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: rem(16) rem(24);

    @include theme-variants('-pagination-')
}

.list {
    display: flex;
    flex-shrink: 0;
    flex-wrap: wrap;
    align-items: center;
    padding: initial;
    margin: initial;
}

.item {
    display: flex;
    width: rem(40);
    height: rem(40);
    align-items: center;
    justify-content: center;
    list-style: none;
    transition: 0.3s ease(out-quad);
    transition-property: background-color, color;

    &--active {
        background-color: #000;
        color: #fff;
    }
}

.item__link {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
    justify-content: center;
    color: inherit;
    text-decoration: none;

    @media (hover: hover) {
        &:hover:not(.item--active &) {
            background-color: #ccc;
        }
    }
}

.buttons {
    display: flex;
    gap: rem(24);

    @include media('>=md') {
        margin-left: rem(32);
    }
}
</style>
