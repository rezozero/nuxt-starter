<template>
    <v-field-wrapper v-bind="$props" :focused="isFocused" :filled="isFilled">
        <textarea
            v-bind="$attrs"
            ref="input"
            v-model="internalValue"
            :required="required"
            :name="name"
            :disabled="disabled"
            :class="$style.textarea"
            @focus="onFocus"
            @blur="onBlur"
        ></textarea>
    </v-field-wrapper>
</template>

<script lang="ts">
import mixins from 'vue-typed-mixins'
import TextInput from '~/mixins/TextInput'

export default mixins(TextInput).extend({
    name: 'VTextarea',
})
</script>

<style lang="scss" module>
.textarea {
    width: 100%;
    min-height: rem(150);
    border: none;
    font-weight: bold;

    &:focus,
    &:focus-visible {
        outline: none;
    }

    &:disabled {
        background-color: transparent;
    }
}
</style>
