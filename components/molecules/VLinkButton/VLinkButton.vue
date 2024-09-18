<script lang="ts">
import type { PropType } from 'vue'
import { vLinkProps } from '~/components/molecules/VLink/VLink.vue'
import { vButtonProps } from '~/components/molecules/VButton/VButton.vue'

type KeyOfButton = keyof typeof vButtonProps
export type VButtonEmphasis = 'primary' | 'secondary' | 'ternary'

export const vButtonLinkProps = {
    ...vButtonProps,
    ...vLinkProps,
    emphasis: {
        type: [String, Boolean] as PropType<VButtonEmphasis | false>,
        default: 'secondary',
    },
}

const buttonKeyList = Object.keys(vButtonProps)

function isKeyOfButton(key: string): key is KeyOfButton {
    return buttonKeyList.includes(key)
}

export default defineComponent({
    props: vButtonLinkProps,
    setup(props) {
        const emphasisProps = computed(() => {
            const result: Partial<typeof vButtonProps> = {}

            if (props.emphasis === 'primary') {
                Object.assign(result, { filled: true })
            }
            else if (props.emphasis === 'secondary') {
                Object.assign(result, { outlined: true })
            }

            return result
        })

        const buttonProps = computed(() => {
            return buttonKeyList.reduce(
                (acc, key) => {
                    // @ts-expect-error:next-line
                    if (isKeyOfButton(key) && props[key]) acc[key] = props[key]
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
    <VLink
        v-slot="vLinkProps"
        :document="document"
        :label="label"
        :reference="reference"
        :url="url"
        custom
    >
        <VButton
            :class="$attrs.class"
            :disabled="!vLinkProps.href && !vLinkProps.to"
            :icon-name="
                iconName
                    || (!!vLinkProps.download || !!document
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
