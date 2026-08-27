<script lang="ts" setup>
import { useNativeCarouselDrag } from '~/composables/use-native-carousel-drag'
import { useNativeCarouselOverscroll } from '~/composables/use-native-carousel-overscroll'
import { useNativeCarouselScroll } from '~/composables/use-native-carousel-scroll'

const props = withDefaults(defineProps<{
    ariaLabel?: string
    listClassName?: string
    enableDrag?: boolean
    enableScroll?: boolean
}>(), { enableDrag: true, enableScroll: true })

const list = ref<HTMLUListElement | null>(null)

const enableDragRef = toRef(props, 'enableDrag')

// Prevent the scroll (mobile (touch) and desktop (wheel)), depending on the prop "enableScroll"
const preventScroll = (e: Event) => e.preventDefault()
watchEffect((onCleanup) => {
    const el = list.value
    if (!el || props.enableScroll) return
    el.addEventListener('wheel', preventScroll, { passive: false })
    el.addEventListener('touchstart', preventScroll, { passive: false })
    onCleanup(() => {
        el.removeEventListener('wheel', preventScroll)
        el.removeEventListener('touchstart', preventScroll)
    })
})

// Handle the drag event (mouse devices only)
const { isDragging } = useNativeCarouselDrag({ element: list, enableDrag: enableDragRef })

// Handle the carousel scroll and related states (touch and mouse devices)
const {
    canPrev,
    canNext,
    currentIndex,
    progress,
    slideCount,
    isSnapping,
    onScroll,
    scrollToIndex,
    triggerPrev,
    triggerNext,
} = useNativeCarouselScroll({ element: list, isDragging })

// Handle the overscroll "bounce" effect when trying to scroll past the first or last slide
// (mouse devices only)
useNativeCarouselOverscroll({ element: list, isDragging })

const slideAttrs = (index: number, total: number): Record<string, string> => ({
    'role': 'group',
    'aria-roledescription': 'slide',
    'aria-label': `${index + 1} / ${total}`,
})

const liveText = computed(() =>
    slideCount.value > 1 ? `${currentIndex.value + 1} / ${slideCount.value}` : '')

defineExpose({
    list,
    triggerPrev,
    triggerNext,
    scrollToIndex,
    canPrev,
    canNext,
    currentIndex,
    progress,
    isDragging,
})
</script>

<template>
    <div
        :class="[$style.root]"
        role="region"
        aria-roledescription="carousel"
        :aria-label="ariaLabel"
    >
        <div
            class="visually-hidden"
            aria-live="polite"
            aria-atomic="true"
        >
            {{ liveText }}
        </div>
        <ul
            ref="list"
            :class="[
                $style.list,
                (isDragging || isSnapping) && $style['list--dragging'],
                !enableDrag && $style['list--drag-disabled'],
                listClassName,
            ]"
            @scroll.passive="onScroll"
            @dragstart.prevent
        >
            <slot
                name="default"
                :class-item="$style.item"
                :slide-attrs="slideAttrs"
            />
        </ul>
    </div>
</template>

<style lang="scss" module>
.list {
    list-style: none;
    margin: 0;
    padding: var(--v-native-carousel-list-padding, 0);
    scroll-padding: var(--v-native-carousel-list-scroll-padding, 0);

    height: var(--v-native-carousel-list-height, auto);
    display: var(--v-native-carousel-list-display, flex);
    gap: var(--v-native-carousel-gap, var(--spacing-xs));
    overflow-x: auto;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
    &::-webkit-scrollbar {
        display: none;
    }
    scroll-snap-type: var(--v-native-carousel-scroll-snap-type, x mandatory);

    @include media('>=lg') {
        gap: var(--v-native-carousel-gap, var(--spacing-md));
    }

    &--dragging {
        scroll-snap-type: none !important;
        * {
            cursor: grabbing;
        }
    }

    &--drag-disabled {
        touch-action: none;
        cursor: default;
    }
}

.item {
    flex: 0 0 auto;
    width: var(--v-native-carousel-item-width, 100%);
    height: var(--v-native-carousel-item-height, auto);
    scroll-snap-align: start;

    & > * {
        user-select: var(--v-native-carousel-item-user-select, none);
    }
}
</style>
