<template>
    <div>{{ walker.item.title }}</div>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'
import Block from '~/mixins/Block'

export default mixins(Block).extend({})
</script>
