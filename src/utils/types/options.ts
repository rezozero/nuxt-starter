import Vue from 'vue'
import type { VueConstructor } from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { ExtendedVue } from 'vue/types/vue'
import { ComponentOptionsMixin } from 'vue/types/v3-component-options'

export type ComponentWithCustomOptions<T, V extends Vue = Vue> = {
    $options: T
} & V

export type ComponentWithCustomOptionsConstructor<T, V extends Vue = Vue> = {
    extend<
        Data,
        Methods,
        Computed,
        Props,
        SetupBindings,
        Mixin extends ComponentOptionsMixin,
        Extends extends ComponentOptionsMixin
    >(
        options?: ThisTypedComponentOptionsWithRecordProps<
            ComponentWithCustomOptions<T, V>,
            Data,
            Methods,
            Computed,
            Props,
            SetupBindings,
            Mixin,
            Extends
        > &
            T
    ): ExtendedVue<ComponentWithCustomOptions<T, V>, Data, Methods, Computed, Props>
} & VueConstructor
