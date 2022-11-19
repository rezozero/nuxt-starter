import Vue from 'vue'
import type { VueConstructor } from 'vue'
import { ThisTypedComponentOptionsWithRecordProps } from 'vue/types/options'
import { ExtendedVue } from 'vue/types/vue'

export type ComponentWithCustomOptions<T, V extends Vue = Vue> = {
    $options: T
} & V

export type ComponentWithCustomOptionsConstructor<T, V extends Vue = Vue> = {
    extend<Data, Methods, Computed, Props>(
        options?: ThisTypedComponentOptionsWithRecordProps<
            ComponentWithCustomOptions<T, V>,
            Data,
            Methods,
            Computed,
            Props
        > &
            T
    ): ExtendedVue<ComponentWithCustomOptions<T, V>, Data, Methods, Computed, Props>
} & VueConstructor
