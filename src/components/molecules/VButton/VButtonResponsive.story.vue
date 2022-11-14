<template>
    <v-button filled :class="$style.root">Label</v-button>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    name: 'VButtonResponsiveStory',
})
</script>

<style lang="scss" module>
.root {
    @include v-button-size(s);

    @include media('>=lg') {
        @include v-button-size(l);
    }
}
</style>
