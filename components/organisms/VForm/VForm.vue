<template>
    <form v-if="formattedSchema" :id="id" :method="method" @submit="onSubmit">
        <slot name="beforeFields" />
        <v-form-element-factory
            :id="id"
            v-model="value"
            :schema="schema"
            :errors="errorsPerProperty"
            :disabled="disabled"
            :components-map="componentsMap"
        />
        <footer class="form__footer">
            <div class="actions">
                <p v-if="errorMessage" type="error" class="errors" :title="$t(errorMessage)" />
                <p v-if="isSuccess" :title="successLabel || $t('form.success')" type="success" class="success" />
                <slot name="submitButton" :can-submit="canSubmit" :disabled="isDisabled" :label="submitButtonLabel">
                    <button v-if="canSubmit" :disabled="isDisabled" class="actions__button">
                        {{ submitButtonLabel }}
                    </button>
                </slot>
            </div>
            <div v-if="gdpr" class="fr-messages-group">
                <p class="fr-message">
                    {{ $t('form.gdpr') }}
                </p>
            </div>
        </footer>
    </form>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'
import { computed, reactive } from 'vue'
import { FetchError } from 'ofetch'
import { captureException } from '@sentry/browser'
import VFormElementFactory from '~/components/organisms/VForm/VFormElementFactory'
import { JsonSchemaExtended } from '~/types/json-schema'
import { ComponentsMap } from '~/utils/form/create-form-children'
import { Violation } from '~/utils/form/form-element'

interface FormSubmitParams {
    action?: string
    formData?: FormData
}

// @see https://github.com/microsoft/TypeScript/issues/36217#issuecomment-600885388
interface FormDataEvent extends Event {
    readonly formData: FormData
}

export type SubmitFunction = (arg: FormSubmitParams) => Promise<void>

// const { $toasts } = useNuxtApp()
// const { t } = useI18n()
const emit = defineEmits(['submit', 'update:modelValue'])

const props = defineProps({
    modelValue: {
        type: Object as PropType<Record<string, any>>,
        required: true,
    },
    schema: {
        type: [Object, String] as PropType<JsonSchemaExtended | string>,
        required: true,
    },
    componentsMap: {
        type: Object as PropType<ComponentsMap>,
        required: true,
    },
    method: {
        type: String,
        default: 'post',
    },
    action: {
        type: String,
        default: () => '',
    },
    disabled: {
        type: Boolean,
        default: false,
    },
    allowSubmittingAgain: {
        type: Boolean,
        default: true,
    },
    gdpr: {
        type: Boolean,
        default: true,
    },
    submitLabel: {
        type: String,
        default: undefined,
    },
    pendingLabel: {
        type: String,
        default: undefined,
    },
    successLabel: {
        type: String,
        default: undefined,
    },
    errorLabel: {
        type: String,
        default: undefined,
    },
    submitCallback: {
        type: Function as PropType<SubmitFunction>,
        required: false,
        default: undefined,
    },
    id: {
        type: String,
        default: undefined,
    },
})

const data = reactive({
    isPending: false,
    isSuccess: false,
    error: null as FetchError | null,
    internalData: {},
    loadedSchema: null as null | JsonSchemaExtended,
})

const value = computed({
    get() {
        return props.modelValue
    },
    set(value) {
        emit('update:modelValue', value)
    },
})

const isSuccess = computed(() => data.isSuccess)
const canSubmit = computed(() => props.allowSubmittingAgain || !data.isSuccess)

const rawSchema = computed((): JsonSchemaExtended | undefined | null => {
    return typeof props.schema === 'object' ? props.schema : data.loadedSchema
})
const formattedSchema = computed((): JsonSchemaExtended | undefined | null => {
    if (!rawSchema.value) {
        return
    }

    const schema = Object.assign({}, rawSchema.value)

    // remove recaptcha
    delete schema.properties?.recaptcha
    if (schema.required && Array.isArray(schema.required)) {
        schema.required = schema.required.filter((value: string) => value !== 'recaptcha')
    }

    return schema
})

const isDisabled = computed((): boolean => {
    return props.disabled || data.isPending
})
const submitButtonLabel = computed((): string => {
    return data.isPending ? props.pendingLabel || 'form.pending' : props.submitLabel || 'form.submit'
})

const errorsPerProperty = computed((): Violation[] => {
    if (data.error?.response?._data?.violations) {
        return data.error?.response?._data?.violations
    }
    return []
})

const errorMessage = computed((): string | null => {
    if (data.error && props.errorLabel) {
        return props.errorLabel
    }

    if (data.error?.response?._data?.['hydra:description'] && errorsPerProperty.value.length === 0) {
        return data.error?.response?._data['hydra:description'] || null
    }

    if (errorsPerProperty.value.length > 0) {
        return 'form.contains_errors'
    }

    if (data.error?.response?._data?.detail) {
        return data.error?.response?._data?.detail || null
    }

    return null
})

const defaultSubmitCallback: SubmitFunction = (): Promise<void> => {
    return new Promise((resolve) => resolve())
}

const onSubmit = async (event: FormDataEvent): Promise<void> => {
    emit('submit', event)

    if (event.defaultPrevented) {
        return
    }

    event.preventDefault()

    const form = event.target as HTMLFormElement
    const action = form.action
    const formData = new FormData(form)

    data.isPending = true
    data.error = null

    const submitCallback = props.submitCallback || defaultSubmitCallback
    const submitObject = { action, formData } as FormSubmitParams

    await submitCallback(submitObject)
        .then(() => {
            data.isSuccess = true
        })
        .catch((error: FetchError) => {
            captureException(error)
            data.isSuccess = false
            data.error = error
        })
        .finally(() => {
            data.isPending = false
        })
}
</script>

<style lang="scss" scoped>
footer {
    margin: 1em 0;
}

.errors {
    margin: 1em 0;
}

.success {
    margin: 1em 0;
}
</style>
