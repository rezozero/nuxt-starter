<script lang="ts">
import mixins from 'vue-typed-mixins'
import type { VNode } from 'vue'
import IconCheck from '~/assets/images/icons/check.svg?sprite'
import TextInput from '~/mixins/TextInput'
import VFieldWrapper from '~/components/molecules/VFieldWrapper/VFieldWrapper.vue'

export default mixins(TextInput).extend({
    name: 'VInput',
    inheritAttrs: false,
    components: { IconCheck },
    props: {
        type: {
            type: String,
            default: 'text',
        },
    },
    computed: {
        isCheckbox(): boolean {
            return this.type === 'checkbox'
        },
        isRadio(): boolean {
            return this.type === 'radio'
        },
    },
    render(): VNode {
        const input = this.$createElement('input', {
            attrs: {
                ...this.$attrs,
                type: this.type,
                required: this.required,
                name: this.name,
                disabled: this.disabled,
                value: this.internalValue,
            },
            ref: 'input',
            on: {
                input: this.onInput,
                blur: this.onBlur,
                focus: this.onFocus,
            },
            class: this.$style.input,
            slot: this.isCheckbox || this.isRadio ? 'beforeLabel' : 'default',
        })
        const check =
            (this.isCheckbox || this.isRadio) &&
            this.$createElement(
                'div',
                {
                    slot: 'beforeLabel',
                    class: this.$style.check,
                },
                [
                    this.isCheckbox &&
                        this.$createElement(IconCheck, {
                            class: this.$style.check__icon,
                        }),
                ]
            )
        // date and datetime-local types have prefilled data (e.g. --/--/--- 00:00)
        const prefilled =
            this.type === 'date' || this.type === 'datetime-local' || this.type === 'file' || !!this.$attrs.placeholder

        return this.$createElement(
            VFieldWrapper,
            {
                props: {
                    ...this.$props,
                    id: this.$attrs.id,
                    focused: this.isFocused,
                    filled: this.isFilled || prefilled,
                    disabled: this.disabled,
                    inline: this.isCheckbox || this.isRadio,
                    hideSeparator: this.hideSeparator,
                },
                class: this.$style.root,
            },
            [input, check]
        )
    },
})
</script>

<style lang="scss" module>
.input {
    width: 100%;
    border: none;
    font-weight: bold;

    &[type='radio'],
    &[type='checkbox'] {
        position: absolute;
        cursor: pointer;
        opacity: 0;
    }

    &[type='file'] {
        margin-top: rem(12);
    }

    &[type='file']::file-selector-button {
        padding: 0.4em 1em;
        border: none;
        background-color: rgba(#000, 0.2);
        border-radius: 1em;
        font-size: rem(14);
    }

    &:disabled {
        background-color: transparent;
        opacity: 0.3;
    }

    &:focus {
        outline: none;
    }

    &::placeholder {
        color: color(black);
        opacity: 0.5;
    }
}

.check {
    display: flex;
    width: 18px;
    height: 18px;
    align-items: center;
    justify-content: center;
    border: 2px solid color(black);
    margin-right: rem(14);
    color: #fff;

    .input[type='radio'] + & {
        border-radius: 50%;
    }

    .input:checked + & {
        background-color: color(black);
    }

    .input[type='radio'] + &::after {
        width: 6px;
        height: 6px;
        background-color: currentColor;
        border-radius: 50%;
        content: '';
    }
}

.check__icon {
    visibility: hidden;

    .input:checked + .check & {
        visibility: inherit;
    }
}
</style>
