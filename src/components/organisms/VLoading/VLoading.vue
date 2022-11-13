<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    name: 'VLoading',
    methods: {
        start() {
            document.body.classList.add(this.$style.loading)
        },
        finish() {
            document.body.classList.remove(this.$style.loading)
        },
    },
    render() {
        return this.$slots.default! as any
    },
})
</script>

<style lang="scss" module>
.loading,
.loading a,
.loading button {
    cursor: wait !important;
}
</style>
