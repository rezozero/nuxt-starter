<script  lang="ts" setup>
const { width } = useWindowSize()

const props = defineProps<{
    anchors: {
        id: string
        href?: string
        label: string
    }[]
}>()

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

const observers: (IntersectionObserver | null)[] = []
const visibleElements = ref<(IntersectionObserverEntry | null)[]>(Array(props.anchors.length).fill(null))

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
            (entries) => {
                if (entries[0]) {
                    onObserverUpdated(entries[0], index)
                }
            },
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
watch(width, resetObserver)

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
const router = useRouter()
const route = useRoute()
function onAnchorClick(event: Event) {
    const href = (event.currentTarget as HTMLElement)?.getAttribute('href') || ''
    const target = document.querySelector(href)

    router.push({ path: route.path, hash: route.hash, replace: true })

    if (target) {
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
                <a
                    ref="linkElement"
                    :class="$style.root"
                    :href="anchor.href"
                    :aria-current="index === activeIndex"
                    @click.prevent="onAnchorClick"
                >
                    {{ anchor.label }}
                </a>
            </li>
        </ol>
    </nav>
</template>

<style lang="scss" module>
@use "assets/scss/mixins/include-media" as *;
@use "assets/scss/functions/ease" as *;

.root {
    display: flex;
}

.list {
    gap: px-to-rem(16);
    margin-block: initial;
    padding-block: px-to-rem(24);

    @include media('>=lg') {
        gap: px-to-rem(32);
        padding-block: px-to-rem(32);
    }

}

.item {
    flex-shrink: 0;
    list-style: none;
}

.anchor {
    display: flex;
    align-items: center;
    text-decoration: none;
    transition: color 0.3s ease(out-quad);
    white-space: nowrap;
}
</style>
