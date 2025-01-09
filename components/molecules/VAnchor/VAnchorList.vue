<script  lang="ts" setup>
import type { VAnchorProps } from '~/components/molecules/VAnchor/VAnchorItem.vue'

const { width } = useWindowSize()

interface VAnchorListProps {
    anchors: VAnchorProps[]
}

const props = defineProps<VAnchorListProps>()

const anchorsProps = computed(() => {
    return props.anchors.map((anchor) => {
        return {
            ...anchor,
            href: `#${anchor.id}`,
        }
    })
})

const elementList = computed(() => {
    return props.anchors.map(anchorItem => document.getElementById(anchorItem.id))
})

// INIT OBSERVER LISTENER
type VisibleObserverEntry = IntersectionObserverEntry | null

const observers: (IntersectionObserver | null)[] = []
const visibleElements = ref<VisibleObserverEntry[]>(Array(props.anchors.length).fill(null))

const linkElement = ref<HTMLElement[]>([])

function onObserverUpdated(entry: IntersectionObserverEntry, index: number) {
    if (entry.intersectionRatio > 0) {
        visibleElements.value[index] = entry
    }
    else if (visibleElements.value[index]) {
        visibleElements.value[index] = null
    }
}

function initObservers() {
    elementList.value.forEach((element, index) => {
        if (!element) {
            const disabledLink = linkElement.value[index]
            disabledLink?.setAttribute?.('inert', 'true')

            return
        }

        const observer = new IntersectionObserver(
            entries => onObserverUpdated(entries[0], index),
            {
                rootMargin: `0px 0px 0px 0px`,
                threshold: [0, 0.5, 1],
            },
        )

        observer.observe(element)
        observers[index] = observer
    })
}

function disposeObservers() {
    observers.forEach((obs) => {
        obs?.disconnect()
        obs = null
    })
    observers.length = 0
}

function resetObserver() {
    disposeObservers()
    initObservers()
}

onMounted(initObservers)
onBeforeUnmount(disposeObservers)
watch(width, resetObserver) // Don't use resize event because it's triggered on scroll when mobile footer UI is updated

// SETUP ACTIVE LINK ON SCROLL
const activeIndex = computed(() => {
    const filteredList = visibleElements.value.filter(v => !!v)

    if (!filteredList.length) return -1
    else if (filteredList.length === 1) return visibleElements.value.findIndex(v => !!v)

    const activeItem = visibleElements.value.reduce((acc, entry) => {
        if (entry && acc && entry.intersectionRatio > acc.intersectionRatio) return entry
        else if (!acc) return entry

        return acc
    })

    return visibleElements.value.findIndex(i => activeItem?.target && i?.target.isEqualNode(activeItem.target))
})

// ACTIONS
const route = useRoute()
function onClick(event: Event) {
    const href = (event.currentTarget as HTMLElement)?.getAttribute('href') || ''
    const target = document.querySelector(href)

    // Remove actual hash
    const anchorHrefList = anchorsProps.value.map(({ href }) => href)
    if (anchorHrefList.includes(route.hash)) {
        history.pushState({}, '', route.path)
    }

    if (target) {
        event.preventDefault()
        // the scroll top anchor offset could be manage in VBlock with scroll-margin-top property
        target.scrollIntoView({ behavior: 'smooth' })
    }
}

// TOP BAR
const { isHidden } = useTopBarScroll()

const $style = useCssModule()
const rootClasses = computed(() => {
    return [
        $style.root,
        isHidden.value && $style['root--top-bar-hidden'],
    ]
})
</script>

<template>
    <nav
        :class="rootClasses"
        :aria-label="$t('anchor_list.aria')"
    >
        <ol :class="$style.list">
            <li
                v-for="(anchor, index) in anchorsProps"
                :key="anchor.id"
                :class="$style.item"
            >
                <VAnchorItem
                    :id="anchor.id"
                    ref="linkElement"
                    :href="anchor.href"
                    :label="anchor.label"
                    :aria-current="index === activeIndex"
                    @click.prevent="onClick"
                />
            </li>
        </ol>
    </nav>
</template>

<style lang="scss" module>
@use "assets/scss/mixins/include-media" as *;
@use "assets/scss/functions/rem" as *;

.root {
    display: flex;
}

.list {
    gap: rem(16);
    margin-block: initial;
    padding-block: rem(24);

    @include media('>=lg') {
        gap: rem(32);
        padding-block: rem(32);
    }

}

.item {
    flex-shrink: 0;
    list-style: none;
}
</style>
