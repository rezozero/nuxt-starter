<script lang="ts">
import Vue from 'vue'
import type { VNode } from 'vue'

export default Vue.extend({
    name: 'VBlock',
    functional: true,
    render(createElement, context): VNode {
        return createElement(
            'section',
            {
                ...context.data,
                class: ['grid', context.data.staticClass, context.data.class],
            },
            context.children
        )
    },
})
</script>
