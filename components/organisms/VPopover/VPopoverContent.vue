<script setup lang="ts">
import { clearAllBodyScrollLocks, disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'
import { getHtmlElement } from '~/utils/ref/get-html-element'

const { positioningDisabled } = defineProps<{
    label?: string
    positioningDisabled?: boolean
    isPositioned?: boolean
}>()

const open = defineModel<boolean>()

const root = ref<HTMLDialogElement>()

onMounted(() => {
    nextTick(() => {
        if (!open.value) return

        if (positioningDisabled) {
            disableScroll()

            root.value?.showModal()
        }
        else root.value?.show()
    })
})

onBeforeUnmount(() => {
    if (positioningDisabled) {
        enableScroll()
    }
})

function enableScroll() {
    if (!root.value) return

    const element = getHtmlElement(toValue(root.value))

    if (element) enableBodyScroll(element)
    else clearAllBodyScrollLocks()
}

function disableScroll() {
    if (!root.value) return

    const element = getHtmlElement(toValue(root.value))

    if (element) disableBodyScroll(element, { reserveScrollBarGap: true })
}

watch(open, (value) => {
    if (!value) root.value?.close()
})

// Theme
useThemeProvider({ preferredTheme: 'light' })
</script>

<template>
    <dialog
        ref="root"
        autofocus
        :aria-label="label"
        :class="[
            $style.root,
            positioningDisabled && $style['root--positioning-disabled'],
            isPositioned && !$style['root--positioned'],
        ]"
    >
        <header
            v-if="positioningDisabled"
            :class="$style.header"
        >
            <div
                v-if="label"
                :class="$style.label"
            >
                {{ label }}
            </div>
            <VIconButton
                icon-name="CloseMD"
                size="sm"
                :class="$style.close"
                @click="open = false"
            />
        </header>
        <slot />
    </dialog>
</template>

<style module lang="scss">
.root {
    z-index: 100;
    padding: 20px;
    border: 1px solid #000;
    border-radius: 8px;
    margin: 0; // Remove default <dialog> margin
    background: #fff;

    &--positioning-disabled {
        position: fixed;
        z-index: 100;
        top: 100%;
        left: 0;
        width: 100%;
        max-width: none;
        max-height: none;
        translate: 0% -100%;

        &:global(.v-enter-active),
        &:global(.v-leave-active) {
            transition: translate;

            @media (prefers-reduced-motion: reduce) {
                transition: none;
            }
        }

        &:global(.v-enter-active) {
            transition-duration: .4s;
            transition-timing-function: ease('out-quart');
        }

        &:global(.v-leave-active) {
            transition-duration: .2s;
            transition-timing-function: ease('out-quad');
        }

        &:global(.v-enter-from),
        &:global(.v-leave-to) {
            translate: 0 0;
        }
    }

    &:not(.root--positioning-disabled) {
        box-shadow: 0 28px 36px 0 rgba(0, 0, 0, 15%);
    }

    &::backdrop {
        background: rgba(0, 0, 0, 80%);
    }

    &:global(.v-enter-active)::backdrop,
    &:global(.v-leave-active)::backdrop {
        transition: opacity 0.4s;

        @media (prefers-reduced-motion: reduce) {
            transition: none;
        }
    }

    &:global(.v-enter-from)::backdrop,
    &:global(.v-leave-to)::backdrop{
        opacity: 0;
    }
}

.header {
    display: flex;
    align-items: flex-start;
    align-self: stretch;
    justify-content: space-between;
    padding-bottom: 12px;
}

.label {
    font-size: 14px;
}

.close {
    margin-left: auto;
    translate: 50% -50%;
}
</style>
