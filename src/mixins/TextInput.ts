import mixins from 'vue-typed-mixins'
import FormElement from '~/mixins/FormElement'

export default mixins(FormElement).extend({
    props: {
        value: String,
    },
    data() {
        return {
            internalValue: this.value,
            isFocused: false,
        }
    },
    computed: {
        isFilled(): boolean {
            return !!this.internalValue?.length
        },
    },
    watch: {
        internalValue() {
            this.$emit('input', this.internalValue, { name: this.name })
        },
    },
    mounted() {
        // possibly autofilled
        if (!this.internalValue) {
            const element = this.$refs.input as HTMLInputElement

            if (element) this.internalValue = element.value
        }
    },
    methods: {
        onBlur() {
            this.isFocused = false
        },
        onFocus() {
            this.isFocused = true
        },
        onInput(event: Event) {
            this.internalValue = (event.target as HTMLInputElement).value
        },
    },
})
