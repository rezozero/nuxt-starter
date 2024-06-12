<script lang="ts">
import type { PropType } from 'vue'
import { vLinkProps } from '~/components/molecules/VLink/VLink.vue'
import { vButtonProps } from '~/components/molecules/VButton/VButton.vue'

export type VButtonEmphasis = 'primary' | 'secondary' | 'ternary'

export const vButtonLinkProps = {
    ...vButtonProps,
    ...vLinkProps,
    emphasis: {
        type: [String, Boolean] as PropType<VButtonEmphasis | false>,
        default: 'secondary',
    },
}

export default defineComponent({
    props: vButtonLinkProps,
    setup(props) {
        const emphasisProps = computed(() => {
            if (props.emphasis === 'primary') {
                return {
                    filled: true,
                }
            } else if (props.emphasis === 'secondary') {
                return {
                    outlined: true,
                }
            }
        })

        const buttonProps = computed(() => {
            return Object.keys(vButtonProps).reduce(
                (acc, key) => {
                    if (key in props && props[key]) acc[key] = props[key]
                    return acc
                },
                {} as typeof vButtonProps,
            )
        })

        return {
            emphasisProps,
            buttonProps,
        }
    },
})
</script>

<template>
    <VLink v-slot="vLinkProps" :document="document" :label="label" :reference="reference" :url="url" custom>
        <VButton
            :class="$attrs.class"
            :disabled="!vLinkProps.href && !vLinkProps.to"
            :icon-name="
                iconName ||
                (!!vLinkProps.download || !!document
                    ? 'download'
                    : vLinkProps.href
                      ? 'arrow-up-right'
                      : vLinkProps.to
                        ? 'chevron-small-right'
                        : undefined)
            "
            v-bind="{ ...vLinkProps, ...emphasisProps, ...buttonProps }"
        />
    </VLink>
</template>
