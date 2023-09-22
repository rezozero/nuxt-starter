import type { FunctionalComponent, PropType, VNodeChild } from 'vue'
import { h } from 'vue'
import { JsonSchemaExtended } from '~/types/json-schema'
import createFormChildren, { ComponentsMap } from '~/utils/form/create-form-children'
import { Violation } from '~/utils/form/form-element'

export interface FactoryPropsTypes {
    schema: JsonSchemaExtended
    componentsMap: ComponentsMap
    id: string
    modelValue: Record<string, unknown>
    errors?: Violation[]
    disabled?: boolean
    parents?: string[]
}

/*
 * https://vuejs.org/guide/extras/render-function.html#functional-components
 */
const VFormElementFactory: FunctionalComponent<FactoryPropsTypes, ['update:modelValue']> = (
    props,
    { emit },
): VNodeChild => {
    return createFormChildren(props, emit, props.componentsMap) || h('')
}

VFormElementFactory.props = {
    schema: {
        type: Object as PropType<JsonSchemaExtended>,
        required: true,
    },
    componentsMap: {
        type: Object as PropType<ComponentsMap>,
        required: true,
    },
    id: {
        type: String,
        default: '',
    },
    modelValue: {
        type: Object as PropType<Record<string, unknown>>,
        required: false,
        default: () => {},
    },
    errors: Object as PropType<Violation[]>,
    disabled: Boolean,
    parents: Array as PropType<string[]>,
}
VFormElementFactory.emits = ['update:modelValue']

export default VFormElementFactory
