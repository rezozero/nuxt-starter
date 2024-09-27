import type { Component, VNodeChild } from 'vue'
import type { JsonSchemaExtended } from '~/types/json-schema'
import type { FactoryPropsTypes } from '~/components/organisms/VForm/VFormElementFactory'
import type { VSelectOption } from '~/components/molecules/VSelect/VSelect.vue'
import LazyVFormFieldset from '~/components/organisms/VForm/VFormFieldset.vue'

export type ComponentsMap = Record<string, Component>

type EmitType = (event: 'update:modelValue', ...args: unknown[]) => void

export const RECAPTCHA_INPUT = 'g-recaptcha-response'

const defaultComponentMaps: Record<string, Component | undefined> = {
    'inputList': defineAsyncComponent(() => import('~/components/molecules/VInputList/VInputList.vue')),
    'hiddenInput': defineAsyncComponent(() => import('~/components/atoms/VHiddenInput/VHiddenInput.vue')),
    'input': defineAsyncComponent(() => import('~/components/molecules/VInput/VInput.vue')),
    'new-password': undefined,
    'textarea': defineAsyncComponent(() => import('~/components/molecules/VTextarea/VTextarea.vue')),
    'markdown': undefined,
    'checkbox': defineAsyncComponent(() => import('~/components/molecules/VInput/VInput.vue')),
    'select': defineAsyncComponent(() => import('~/components/molecules/VSelect/VSelect.vue')),
    'file': defineAsyncComponent(() => import('~/components/molecules/VInput/VInput.vue')),
    'selectExpanded': defineAsyncComponent(() => import('~/components/molecules/VSelect/VSelect.vue')),
    'selectMultipleExpanded': defineAsyncComponent(() => import('~/components/molecules/VInputList/VInputList.vue')),
}

export default function createFormChildren(
    parentProps: FactoryPropsTypes,
    emit: EmitType,
    componentsMap?: ComponentsMap,
): VNodeChild | undefined {
    const rootSchema = parentProps.schema
    const propertiesLength = Object.keys(rootSchema?.properties || {}).filter(key => key !== RECAPTCHA_INPUT).length
    const requiredProperties = rootSchema?.required || []
    const parents = parentProps.parents
    const mergedComponentsMap = { ...defaultComponentMaps, ...componentsMap }

    if (!rootSchema?.properties) {
        return h('')
    }

    const { $i18n } = useNuxtApp()

    return Object.entries(rootSchema.properties)
        .sort((a, b) => a[1]?.propertyOrder - b[1]?.propertyOrder)
        .map((property, propertyIndex) => {
            const key = property[0]
            const schema = property[1] as JsonSchemaExtended
            const error = parentProps.errors?.find(item => item.propertyPath === key)
            const errorMessage = error?.message ? $i18n.t(error?.message).toString() : undefined
            const isInvalid = error && error.message
            const id = parentProps.id ? `${parentProps.id}-${key}` : key
            const required = requiredProperties === true ? requiredProperties : requiredProperties.includes(key)
            const name = parents?.length ? parents.slice().concat([key]).join('[') + ']'.repeat(parents.length) : key
            const lastItem = propertyIndex === propertiesLength - 1
            const typeWithoutSeparator
                = schema.type === 'boolean'
                || schema.widget === 'choice-multiple-expanded'
                || schema.widget === 'choice-expanded'
            /*
             * Make initial field value optional
             */
            const parentModelValues = parentProps.modelValue || {}
            const currentModelValue = parentModelValues?.[key] || null

            const defaultProps: Record<string, unknown> = {
                id,
                'label': schema.title,
                errorMessage,
                isInvalid,
                name,
                parents,
                'hideSeparator': lastItem && typeWithoutSeparator,
                'description': schema.description,
                'hint': schema.description,
                'disabled': schema.attr?.disabled || parentProps.disabled,
                'placeholder': schema.attr?.placeholder || null,
                'autocomplete': schema.attr?.autocomplete || null,
                // Binds reactivity
                'modelValue': currentModelValue,
                'onUpdate:modelValue': (value: unknown): void => {
                    // Make sure null is passed as null and not as string
                    if (value === 'null') {
                        value = null
                    }
                    const finalValue = { ...parentModelValues, [key]: value }
                    emit('update:modelValue', finalValue)
                },
            }
            const defaultAttrs = {
                ...schema.attr,
                id,
            }

            // Virtual object = fieldset but flatten properties with parent's modelValue
            if (schema.type === 'object' && schema?.attr?.virtual === true) {
                return h(LazyVFormFieldset, {
                    ...defaultProps,
                    schema,
                    mergedComponentsMap,
                    'virtual': schema?.attr?.virtual,
                    'schemaKey': key,
                    'modelValue': parentModelValues,
                    'onUpdate:modelValue': (value: object): void => {
                        const finalValue = { ...parentModelValues, ...value }
                        emit('update:modelValue', finalValue)
                    },
                })
            }
            else if (schema.type === 'object') {
                // nested object = fieldset
                return h(LazyVFormFieldset, {
                    ...defaultProps,
                    schema,
                    mergedComponentsMap,
                    schemaKey: key,
                })
            }

            // recaptcha
            if (key === RECAPTCHA_INPUT) {
                if (!mergedComponentsMap.hiddenInput) return h('')

                return h(mergedComponentsMap.hiddenInput, {
                    ...defaultProps,
                })
            }

            // input list
            if (schema.widget === 'choice-multiple-expanded' || schema.widget === 'choice-expanded') {
                const isMultiple = schema.widget === 'choice-multiple-expanded'
                const component
                    = isMultiple && mergedComponentsMap.selectMultipleExpanded
                        ? mergedComponentsMap.selectMultipleExpanded
                        : mergedComponentsMap.selectExpanded || mergedComponentsMap.select
                const enumList = isMultiple
                    ? ((schema.items as JsonSchemaExtended)?.enum as (string | number)[])
                    : (schema.enum as (string | number)[])

                if (!enumList || !component) {
                    return h('')
                }

                const titles = isMultiple ? (schema.items as JsonSchemaExtended)?.enum_titles : schema.enum_titles
                const options: VSelectOption[] = enumList.map((value, index) => ({
                    value: String(value),
                    label: titles?.[index] || String(value),
                }))

                return h(component, {
                    ...defaultProps,
                    legend: schema.title,
                    required,
                    options,
                    multiple: isMultiple,
                    inline: isMultiple,
                    modelValue: currentModelValue || (isMultiple ? [] : ''),
                })
            }

            // select
            if (schema.type === 'array' || schema.enum) {
                const isMultiple = schema.type === 'array'
                const items
                    = schema.items && Array.isArray(schema.items)
                        ? (schema.items as JsonSchemaExtended[])?.[0]
                        : schema.items
                const enumList = isMultiple ? items?.enum : schema.enum
                const component
                    = isMultiple && mergedComponentsMap.selectMultipleExpanded
                        ? mergedComponentsMap.selectMultipleExpanded
                        : mergedComponentsMap.select

                if (!enumList || !component) {
                    return h('')
                }

                const titles = isMultiple ? items?.enum_titles : schema.enum_titles
                const options: VSelectOption[] = enumList.map((value, index) => ({
                    value: String(value),
                    label: titles?.[index] || String(value),
                }))

                return h(component, {
                    ...defaultProps,
                    required,
                    options,
                    multiple: isMultiple,
                    inline: isMultiple,
                    modelValue: currentModelValue || (isMultiple ? [] : ''),
                })
            }

            if (schema.type === 'string' && schema.widget === 'file' && !!mergedComponentsMap.file) {
                const attrs: Record<string, string> = {
                    ...defaultAttrs,
                }
                const type = schema.widget || schema.type
                const props: Record<string, unknown> = {
                    ...defaultProps,
                    type,
                    required,
                }
                if (props.name && attrs.multiple) {
                    props.name = props.name + '[]'
                }
                return h(mergedComponentsMap.file, props)
            }

            // input / textarea / checkbox
            if (['string', 'boolean', 'integer', 'number'].includes(schema.type as string)) {
                if (schema.widget === 'textarea') {
                    if (!mergedComponentsMap.textarea) return h('')

                    return h(mergedComponentsMap.textarea, {
                        ...defaultProps,
                        isTextarea: true,
                        required,
                    })
                }

                if (schema.widget === 'joined') {
                    const props: Record<string, unknown> = {
                        ...defaultProps,
                        required,
                        modelValue: currentModelValue ? (currentModelValue as Array<string>).join(', ') : '',
                    }
                    props['onUpdate:modelValue'] = (value: string) =>
                        emit('update:modelValue', { ...parentModelValues, [key]: value.split(',') })

                    const component = mergedComponentsMap.markdown || mergedComponentsMap.textarea

                    if (!component) return h('')

                    return h(component, props)
                }

                if (schema.widget === 'markdown') {
                    const component = mergedComponentsMap.markdown || mergedComponentsMap.textarea

                    if (!component) return h('')

                    return h(component, {
                        ...defaultProps,
                        isTextarea: true,
                        required,
                    })
                }
                if (schema.widget === 'new-password' && mergedComponentsMap['new-password']) {
                    return h(mergedComponentsMap['new-password'], {
                        ...defaultProps,
                        autocomplete: 'new-password',
                    })
                }
                if (schema.widget === 'password' && mergedComponentsMap['new-password']) {
                    return h(mergedComponentsMap['new-password'], {
                        ...defaultProps,
                        autocomplete: 'current-password',
                    })
                }

                const type = schema.widget || schema.type
                const attrs: Record<string, string> = {
                    ...defaultAttrs,
                }
                const props: Record<string, unknown> = {
                    ...defaultProps,
                    type,
                    required,
                }
                props.modelValue = String(props.modelValue || '')

                if (type === 'boolean' || type === 'checkbox') {
                    props.type = 'checkbox'
                }
                else if (type === 'number') {
                    props.type = 'string'
                    props['onUpdate:modelValue'] = (value: unknown) =>
                        emit('update:modelValue', { ...parentModelValues, [key]: Number.parseFloat(value) })
                }
                else if (type === 'integer') {
                    props.type = 'number'
                    props['onUpdate:modelValue'] = (value: unknown) =>
                        emit('update:modelValue', { ...parentModelValues, [key]: Number.parseInt(value) })
                    props.step = '1'
                }
                else if (type === 'datetime' || type === 'datetime-local') {
                    if (props.modelValue) {
                        // Handle timezones between data and client
                        const tzOffset = new Date().getTimezoneOffset() * 60000 // offset in milliseconds
                        const localISOTime = new Date(Date.parse(props.modelValue) - tzOffset).toISOString()
                        props.modelValue = localISOTime.split('.')[0]
                    }
                    else {
                        props.modelValue = ''
                    }
                    props.step = 'unknown'
                    props.type = 'datetime-local'
                }
                else if (type === 'file') {
                    if (props.name && attrs.multiple) {
                        props.name = props.name + '[]'
                    }
                }
                else if (type === 'password') {
                    props.type = 'password'
                }

                if (!mergedComponentsMap.input) return h('')

                return h(mergedComponentsMap.input, props)
            }

            return h('')
        })
}
