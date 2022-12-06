<script lang="ts">
import Vue from 'vue'
import type { VNode, PropType } from 'vue'
import { CreateElement } from 'vue/types/umd'
import { RenderContext } from 'vue/types/options'
import { JsonSchemaExtended } from '~/types/json-schema'
import VMultiselect, { SelectOption } from '~/components/organisms/VSelect/VSelect.vue'
import VFormFieldset from '~/components/organisms/VForm/VFormFieldset.vue'
import VInput from '~/components/molecules/VInput/VInput.vue'
import VTextarea from '~/components/molecules/VTextarea/VTextarea.vue'
import VInputList, { InputListOption } from '~/components/molecules/VInputList/VInputList.vue'
import { RECAPTCHA_INPUT } from '~/components/organisms/VForm/VForm.vue'
import VInputHidden from '~/components/atoms/VInputHidden/VInputHidden.vue'

function createChildren(createElement: CreateElement, context: RenderContext): VNode[] | undefined {
    const rootSchema = context.props.schema
    const requiredProperties = rootSchema.required || []
    const parents = context.props.parents

    if (!rootSchema.properties) return

    return Object.entries(rootSchema.properties).map((property) => {
        const key = property[0]
        const schema = property[1] as JsonSchemaExtended
        const errors = context.props.errors?.[key]
        const id = context.props.id ? `${context.props.id}-${key}` : key
        const required = requiredProperties.includes(key)
        const name = parents?.length ? parents.slice().concat([key]).join('[') + ']'.repeat(parents.length) : key
        const defaultProps: Record<string, any> = {
            label: schema.title,
            errors,
            name,
            parents,
            description: schema.description,
            disabled: context.props.disabled,
        }
        const defaultAttrs = {
            ...schema.attr,
            id,
        }

        // fieldset
        if (schema.type === 'object') {
            return createElement(VFormFieldset, {
                props: {
                    ...defaultProps,
                    schema,
                    id,
                    schemaKey: key,
                    data: context.props.data,
                },
                attrs: {
                    ...defaultAttrs,
                },
            })
        }

        // input list
        if (schema.widget === 'choice-multiple-expanded' || schema.widget === 'choice-expanded') {
            const isMultiple = schema.widget === 'choice-multiple-expanded'
            const enumList = isMultiple
                ? ((schema.items as JsonSchemaExtended)?.enum as (string | number)[])
                : (schema.enum as (string | number)[])

            if (!enumList) return createElement('')

            const titles = isMultiple ? (schema.items as JsonSchemaExtended)?.enum_titles : schema.enum_titles
            const options: InputListOption[] = enumList.map((value, index) => ({
                value: String(value),
                label: titles?.[index] || String(value),
            }))

            return createElement(VInputList, {
                props: {
                    ...defaultProps,
                    required,
                    options,
                    multiple: isMultiple,
                },
                attrs: {
                    ...defaultAttrs,
                },
                on: {
                    input: (...args: any[]) => context.parent.$emit('input', ...args),
                },
            })
        }

        // select
        if (schema.type === 'array' || schema.enum) {
            const isMultiple = schema.type === 'array'
            const items =
                schema.items && Array.isArray(schema.items) ? (schema.items as JsonSchemaExtended[])?.[0] : schema.items
            const enumList = isMultiple ? items?.enum : schema.enum

            if (!enumList) return createElement('')

            const titles = isMultiple ? items?.enum_titles : schema.enum_titles
            const options: SelectOption[] = enumList.map((value, index) => ({
                value: String(value),
                label: titles?.[index] || String(value),
            }))

            return createElement(VMultiselect, {
                props: {
                    ...defaultProps,
                    required,
                    options,
                    placeholder: null, // prevent vue-multiselect placeholder
                    multiple: isMultiple,
                    name: isMultiple ? defaultProps.name + '[]' : defaultProps.name,
                },
                attrs: {
                    ...defaultAttrs,
                },
            })
        }

        // recaptcha
        if (key === RECAPTCHA_INPUT) {
            return createElement(VInputHidden, {
                props: {
                    ...defaultProps,
                },
            })
        }

        // input / textarea
        if (
            schema.type === 'string' ||
            schema.type === 'boolean' ||
            schema.type === 'integer' ||
            schema.type === 'number'
        ) {
            if (schema.widget === 'textarea') {
                return createElement(VTextarea, {
                    props: {
                        ...defaultProps,
                        required,
                        value: context.props.data?.[key],
                    },
                    attrs: {
                        ...defaultAttrs,
                    },
                    on: {
                        input: (...args: any[]) => context.parent.$emit('input', ...args),
                    },
                })
            }

            const type = schema.widget || schema.type
            const attrs: Record<string, string> = {
                ...defaultAttrs,
            }
            const props: Record<string, any> = {
                ...defaultProps,
                type,
                required,
                value: context.props.data?.[key],
            }

            if (type === 'boolean') {
                props.type = 'checkbox'
            } else if (type === 'integer') {
                props.type = 'number'
                attrs.step = '1'
            } else if (type === 'datetime') {
                props.type = 'datetime-local'
            } else if (type === 'file') {
                if (props.name && attrs.multiple) props.name = props.name + '[]'
            }

            return createElement(VInput, {
                props,
                attrs,
                on: {
                    input: (...args: any[]) => context.parent.$emit('input', ...args),
                },
            })
        }

        return createElement('')
    })
}

export default Vue.extend({
    name: 'VFormElementFactory',
    functional: true,
    props: {
        schema: {
            type: Object as PropType<JsonSchemaExtended>,
            required: true,
        },
        id: {
            type: String,
            default: '',
        },
        data: Object as PropType<Record<string, string>>,
        errors: Object as PropType<Record<string, Record<string, string>> | Record<string, string>>,
        disabled: Boolean,
        parents: Array as PropType<string[]>,
    },
    render(createElement, context): VNode | VNode[] {
        const children = createChildren(createElement, context)

        return children && children.length ? children : createElement('')
    },
})
</script>
