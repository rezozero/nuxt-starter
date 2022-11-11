import Vue from 'vue'
import type { PropType } from 'vue'

export default Vue.extend({
    props: {
        required: Boolean,
        errors: Object as PropType<Record<string, string>>,
        label: String,
        name: String,
        disabled: Boolean,
        hideSeparator: Boolean,
        description: String,
        parents: Array as PropType<string[]>,
    },
})
