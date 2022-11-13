<script lang="ts">
import Vue from 'vue'
import type { VNode } from 'vue'

export default Vue.extend({
    name: 'VCollapsableMain',
    functional: true,
    props: {
        enabled: Boolean,
        collapsed: Boolean,
    },
    render(createElement, context): VNode | VNode[] {
        const children: VNode[] = []
        const defaultSlot = context.slots().default
        const { props, data } = context

        if (props.enabled) {
            if (defaultSlot) children.push(defaultSlot)
        }

        const element =
            props.enabled &&
            createElement(
                'div',
                {
                    ...data,
                    directives: [
                        {
                            name: 'show',
                            value: !props.collapsed,
                        },
                    ],
                },
                children
            )
        // @see https://markus.oberlehner.net/blog/transition-to-height-auto-with-vue/
        const transition =
            props.enabled &&
            createElement(
                'transition',
                {
                    props: {
                        name: context.$style.expand,
                    },
                    on: {
                        afterEnter(element: HTMLElement) {
                            element.style.height = 'auto'
                        },
                        enter(element: HTMLElement) {
                            element.style.width = getComputedStyle(element).width
                            element.style.position = 'absolute'
                            element.style.visibility = 'hidden'
                            element.style.height = 'auto'

                            const height = getComputedStyle(element).height

                            element.style.width = ''
                            element.style.position = ''
                            element.style.visibility = ''
                            element.style.height = '0'

                            // Force repaint to make sure the
                            // animation is triggered correctly.
                            // eslint-disable-next-line no-unused-expressions
                            getComputedStyle(element).height

                            requestAnimationFrame(() => {
                                element.style.height = height
                            })
                        },
                        leave(element: HTMLElement) {
                            element.style.height = getComputedStyle(element).height

                            // Force repaint to make sure the
                            // animation is triggered correctly.
                            // eslint-disable-next-line no-unused-expressions
                            getComputedStyle(element).height

                            requestAnimationFrame(() => {
                                element.style.height = '0'
                            })
                        },
                    },
                },
                [element]
            )

        return transition || defaultSlot || createElement('')
    },
})
</script>

<style lang="scss" module>
.expand {
    &:global(#{'-enter-active'}),
    &:global(#{'-leave-active'}) {
        overflow: hidden;
        transition: opacity 0.3s, height 0.3s;
    }

    &:global(#{'-enter'}),
    &:global(#{'-leave-to'}) {
        height: 0;
        opacity: 0;
    }
}
</style>
