<script lang="ts">
import Vue from 'vue'
import type { VNode } from 'vue'
import VButton from '~/components/molecules/VButton/VButton.vue'
import IconChevronDown from '~/assets/images/icons/chevron-down.svg?sprite'

export default Vue.extend({
    name: 'VCollapsableHeader',
    props: {
        collapsed: Boolean,
        enabled: Boolean,
        toggle: Function,
    },
    render(createElement): VNode {
        const children: VNode[] = []
        const defaultSlot = this.$slots.default?.[0]

        if (this.enabled) {
            if (defaultSlot) children.push(defaultSlot)

            const cta = createElement(
                VButton,
                {
                    class: this.$style.cta,
                    props: {
                        size: 'sm',
                    },
                },
                [createElement(IconChevronDown, { slot: 'icon' })]
            )

            children.push(cta)
        }

        const element =
            this.enabled &&
            createElement(
                'div',
                {
                    class: [this.$style.root, !this.collapsed && this.$style['root--expanded'], this.$attrs.class],
                    on: {
                        click: this.toggle,
                    },
                },
                children
            )

        return element || defaultSlot || createElement('')
    },
})
</script>

<style lang="scss" module>
.root {
    position: relative;
    display: flex;
    width: 100%;
    align-items: center;
    cursor: pointer;
    user-select: none;
}

.cta {
    align-self: start;
    grid-column-end: -1;
    grid-row: 1;
    justify-self: end;
    transition: transform 0.3s;

    .root--expanded & {
        transform: rotate(-180deg);
    }
}
</style>
