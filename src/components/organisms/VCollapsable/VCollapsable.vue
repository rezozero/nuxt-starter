<script lang="ts">
import Vue from 'vue'
import type { VNode } from 'vue'

export default Vue.extend({
    name: 'VCollapsable',
    props: {
        enabled: Boolean,
        value: Boolean, // collapsed
    },
    methods: {
        toggle() {
            this.$emit('input', !this.value)
        },
    },
    render(createElement): VNode {
        const scopedSlot = this.$scopedSlots.default?.({
            toggle: this.toggle,
        })?.[0]

        return scopedSlot || createElement('')
    },
})
</script>
