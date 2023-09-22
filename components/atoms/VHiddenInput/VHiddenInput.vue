<template>
    <input :id="id" type="hidden" :name="name" :value="modelValue" />
</template>

<script setup lang="ts">
import { defaultProps } from '~/utils/form/form-element'
import useFormElement from '~/composables/use-form-element'

const props = defineProps({
    ...defaultProps,
    id: String,
    modelValue: {
        type: String,
        default: undefined,
    },
})

const { id, name } = useFormElement(props)
</script>
