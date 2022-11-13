<template>
    <v-field-wrapper v-bind="$props" :class="$style.root" :focused="isOpen" :filled="isFilled" :disabled="disabled">
        <select
            :name="name"
            :class="$style.select"
            tabindex="-1"
            :multiple="multiple"
            :required="required"
            :disabled="disabled"
        >
            <option disabled :selected="!isFilled" value>{{ placeholder }}</option>
            <option
                v-for="option in options"
                :key="option.value"
                :value="option.value"
                :selected="isSelectedOption(option)"
            >
                {{ option.label }}
            </option>
        </select>

        <multiselect
            ref="multiselect"
            v-model="internalValue"
            :options="options"
            :multiple="multiple"
            :close-on-select="!multiple"
            track-by="value"
            label="label"
            :placeholder="placeholder"
            :searchable="options.length > 10"
            :disabled="disabled"
            :show-labels="false"
            :option-height="27"
            @open="onOpen"
            @close="onClose"
        >
            <template #caret="{ toggle }">
                <icon-chevron-down :class="$style.caret" @mousedown.prevent.stop="toggle" />
            </template>
            <template #noResult>
                <span>{{ $t('select.no_result') }}</span>
            </template>
            <template #option="slotProps">
                <span>{{ slotProps.option.label }}</span>
                <icon-check :class="$style['option-icon']" />
            </template>
        </multiselect>
    </v-field-wrapper>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import mixins from 'vue-typed-mixins'
import IconChevronDown from '~/assets/images/icons/chevron-down.svg?sprite'
import 'vue-multiselect/dist/vue-multiselect.min.css'
import FormElement from '~/mixins/FormElement'
import IconCheck from '~/assets/images/icons/check.svg?sprite'

export interface SelectOption {
    label: string
    value: string
    selected?: boolean
    disabled?: boolean
}

export default mixins(FormElement).extend({
    name: 'VSelect',
    components: { Multiselect: () => import('vue-multiselect'), IconChevronDown, IconCheck },
    props: {
        value: [Object, Array] as PropType<SelectOption | SelectOption[]>,
        options: {
            type: Array as PropType<SelectOption[]>,
            default: () => [],
        },
        multiple: Boolean,
        placeholder: String,
    },
    data() {
        return {
            internalValue: this.value,
            isOpen: false,
        }
    },
    computed: {
        isFilled(): boolean {
            if (Array.isArray(this.internalValue)) return this.internalValue.length > 0
            else return !!this.internalValue
        },
    },
    watch: {
        value() {
            this.internalValue = this.value
        },
        internalValue() {
            this.$emit('input', this.internalValue)
        },
    },
    methods: {
        isSelectedOption(option: SelectOption): boolean {
            if (Array.isArray(this.internalValue)) {
                return typeof this.internalValue.find((value) => value.value === option.value) !== 'undefined'
            } else {
                return this.internalValue?.value === option.value
            }
        },
        onOpen() {
            this.isOpen = true
        },
        onClose() {
            this.isOpen = false
        },
    },
})
</script>

<style lang="scss" module>
/**
 * ⚠️ !important rules reset Multiselect style
 */

.root {
    position: relative;
}

.select {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
}

.root :global .multiselect {
    display: flex;
    min-height: 0;
    color: inherit;
    font-size: inherit;
    font-weight: bold;

    &--disabled {
        background-color: transparent;
    }
}

.caret {
    flex-shrink: 0;
    order: 2;
    margin-left: auto;

    :global(.multiselect--active) & {
        transform: rotate(180deg);
    }

    :global(.multiselect--disabled) & {
        opacity: 0.3;
    }
}

.root :global .multiselect__tags {
    min-height: rem(30);
    flex-grow: 1;
    padding: 0;
    border: none;
    background-color: transparent;
    color: inherit;
    font-size: inherit;
}

.root :global .multiselect__tags-wrap {
    display: flex;
    flex-wrap: wrap;
}

.root :global .multiselect__tag {
    display: flex;
    align-items: center;
    padding: rem(4) rem(4) rem(4) rem(12);
    margin: rem(6) rem(8) 0 0;
    background-color: rgba(#000, 0.4);
    border-radius: rem(14);
    color: #fff;
    font-size: rem(14);
}

.root :global .multiselect__tag-icon {
    position: relative;
    display: flex;
    width: rem(16);
    height: rem(16);
    align-items: center;
    justify-content: center;
    border-radius: 50%;

    &::after {
        margin-top: -2px;
        color: #fff;
    }

    &:hover,
    &:focus {
        background-color: rgba(#000, 0.3);
    }
}

.root :global .multiselect__input {
    padding: 0;
    background-color: transparent;
}

.root :global .multiselect__placeholder {
    display: none !important;
}

.root :global .multiselect--active .multiselect__placeholder {
    display: block;
}

.root :global .multiselect__single {
    padding: 0;
    margin: 0;
    font-size: inherit;
    line-height: inherit;
}

.root :global .multiselect__content-wrapper {
    width: 100%;
    border: none;
    box-shadow: 0 12px 12px rgba(0, 0, 0, 0.1);
}

.root :global .multiselect:not(.multiselect--above) .multiselect__content-wrapper {
    top: 100%;
}

.root :global .multiselect__element {
    margin: rem(2) 0;
}

.root :global .multiselect__option {
    display: flex !important;
    align-items: center;

    &.multiselect__option--highlight {
        background-color: rgba(#000, 0.6) !important;
    }

    &.multiselect__option--selected:not(.multiselect__option--highlight) {
        color: rgba(#000, 0.6) !important;
    }
}

.option-icon {
    margin-left: auto;
    visibility: hidden;

    .root :global(.multiselect__option--selected) & {
        visibility: inherit;
    }
}
</style>
