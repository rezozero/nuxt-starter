import type { FunctionalComponent, PropType, VNodeChild } from 'vue'
import type { JsonSchemaExtended } from '~~/types/json-schema'
import createFormChildren from '~/utils/form/create-form-children'
import type { ComponentsMap } from '~/utils/form/create-form-children'
import type { Violation } from '~~/types/form'

type FormModelValue = Record<string, unknown>

export interface FactoryPropsTypes {
    schema?: JsonSchemaExtended
    componentsMap?: ComponentsMap
    id?: string
    modelValue?: FormModelValue
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
    schema: Object as PropType<JsonSchemaExtended>,
    componentsMap: Object as PropType<ComponentsMap>,
    id: {
        type: String,
        default: '',
    },
    modelValue: {
        type: Object as PropType<FormModelValue>,
        required: false,
        default: () => {},
    },
    errors: Object as PropType<Violation[]>,
    disabled: Boolean,
    parents: Array as PropType<string[]>,
}
VFormElementFactory.emits = ['update:modelValue']

export default VFormElementFactory
