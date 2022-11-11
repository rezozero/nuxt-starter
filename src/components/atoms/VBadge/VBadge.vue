<script lang="ts">
import Vue from 'vue'
import type { VNode, VNodeData } from 'vue'

export default Vue.extend({
    name: 'VBadge',
    functional: true,
    props: {
        value: { type: Number },
    },
    render(createElement, context): VNode {
        const data: VNodeData = {
            ...context.data,
            class: [context.data.staticClass, context.data.class, context.$style.root],
        }
        const { value } = context.props
        return createElement('span', data, value?.toString())
    },
})
</script>

<style lang="scss" module>
.root {
    display: flex;
    width: rem(19);
    height: rem(19);
    align-items: center;
    justify-content: center;
    background-color: red;
    border-radius: 100%;
    color: #fff;
    font-size: rem(13);
    letter-spacing: 0;
    line-height: 1;
    pointer-events: none;
    user-select: none;
}
</style>
