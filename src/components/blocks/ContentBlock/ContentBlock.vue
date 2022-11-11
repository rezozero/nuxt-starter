<template>
    <v-block>{{ walker.item.title }}</v-block>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'
import Block from '~/mixins/Block'

export default mixins(Block).extend({})
</script>
