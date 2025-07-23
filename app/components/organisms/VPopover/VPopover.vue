<script lang="ts" setup>
import type { ComponentPublicInstance } from 'vue'
import type { UseFloatingOptions } from '@floating-ui/vue'
// TODO: use popover API?
// https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using
//  popover API a11y -> https://hidde.blog/popover-accessibility/
// Maybe the support is not good enough yet? (e.g. Safari not supported under 16.5)

const { floatingOptions } = defineProps<{
    label?: string
    popoverClass?: string | string[]
    floatingOptions?: UseFloatingOptions
}>()

const attrs = useAttrs()

// Open state
const open = defineModel<boolean>()

function close() {
    open.value = false
}

function toggle() {
    open.value = !open.value
}

watch(open, (value) => {
    if (value || !button.value) return

    // focus the button when closing the popover
    unrefElement(button)?.focus()
})

watch(useRoute(), () => {
    // close on route change
    close()
})

onMounted(() => {
    // close with Esc key
    useEventListener(window, 'keydown', (event) => {
        if (event.key === 'Escape' && !event.defaultPrevented && open.value) {
            event.preventDefault()
            close()
        }
    })

    // close on click outside of popover element
    useEventListener(document, 'click', (event) => {
        const popoverElement = unrefElement(popover)
        const buttonElement = unrefElement(button)

        if (
            !popoverElement
            || event.target === popoverElement
            || popoverElement.contains(event.target as Node)
            || !buttonElement
            || event.target === buttonElement
            || buttonElement.contains(event.target as Node)
        ) return

        close()
    })
})

// Button
const button = ref<HTMLElement | ComponentPublicInstance | null>(null)
const buttonId = useId()
const buttonAttrs = computed(() => ({
    ...attrs,
    'id': buttonId,
    'aria-haspopup': 'dialog',
    'aria-expanded': open.value,
    'aria-controls': popoverId,
}))

function assignButton(element: Element | ComponentPublicInstance | null) {
    button.value = element as HTMLElement | ComponentPublicInstance | null
}

// Popover
const popover = ref<HTMLElement | ComponentPublicInstance | null>(null)
const popoverId = useId()
const popoverAttrs = computed(() => ({
    'id': popoverId,
    'aria-labelledby': buttonId,
}))

function assignPopover(element: Element | ComponentPublicInstance | null) {
    popover.value = element as HTMLElement | ComponentPublicInstance | null
}

// Positioning
const { style: popoverStyle, positioningDisabled, isPositioned } = usePopoverPosition({
    button,
    popover,
    open,
    floatingOptions,
})

// close popover to prevent glitch due to positioning changes
watch(positioningDisabled, () => {
    close()
})

// Public properties
defineExpose({
    close,
})
</script>

<template>
    <slot
        :attrs="buttonAttrs"
        :open="open"
        :toggle="toggle"
        :assign-ref="assignButton"
    >
        <VButton
            v-bind="buttonAttrs"
            :ref="assignButton"
            :label="label"
            size="md"
            @click="toggle"
        />
    </slot>
    <slot
        name="popover"
        :attrs="popoverAttrs"
        :open="open"
        :close="close"
        :popover-style="popoverStyle"
        :assign-ref="assignPopover"
        :positioning-disabled="positioningDisabled"
        :is-positioned="isPositioned"
    >
        <Transition>
            <LazyVPopoverContent
                v-if="open"
                v-bind="popoverAttrs"
                :ref="assignPopover"
                v-model="open"
                :label="label"
                :positioning-disabled="positioningDisabled"
                :is-positioned="isPositioned"
                :style="!positioningDisabled && popoverStyle"
                :class="popoverClass"
            >
                <slot
                    name="popover-content"
                    :close="close"
                    :open="open"
                />
            </LazyVPopoverContent>
        </Transition>
    </slot>
</template>
