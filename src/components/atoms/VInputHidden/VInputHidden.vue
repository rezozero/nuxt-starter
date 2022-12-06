<template>
    <input type="hidden" :name="name" :value="value" />
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'
import FormElement from '~/mixins/FormElement'

export default mixins(FormElement).extend({
    name: 'VInputHidden',
    props: {
        value: String,
    },
})
</script>
