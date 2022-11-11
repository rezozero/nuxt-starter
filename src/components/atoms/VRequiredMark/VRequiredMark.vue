<template functional>
    <span :class="$style.root">*</span>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    name: 'VRequiredMark',
})
</script>

<style lang="scss" module>
.root {
    color: red;
}
</style>
