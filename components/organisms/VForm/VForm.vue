<script lang="ts" setup>
import type { PropType } from 'vue'
import type { FetchError } from 'ofetch'
import * as Sentry from '@sentry/nuxt'
import type { JsonSchemaExtended } from '~/types/json-schema'
import type { ComponentsMap } from '~/utils/form/create-form-children'
import { useJoinApiUrl } from '~/composables/use-join-api-url'
import { useRecaptchaState } from '~/composables/use-recaptcha-state'

interface FormSubmitParams {
    action?: string
    formData?: FormData
}

export type SubmitFunction = (arg: FormSubmitParams) => Promise<void>

const emit = defineEmits(['submit'])

// MODEL
const model = defineModel<Record<string, unknown>>({ default: {} })

const props = defineProps({
    schema: {
        type: [Object, String] as PropType<JsonSchemaExtended | string>,
        required: true,
    },
    componentsMap: Object as PropType<ComponentsMap>,
    method: {
        type: String,
        default: 'post',
    },
    action: {
        type: String as PropType<string | null>,
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
        default: '',
    },
})

// COMMONS
const { t } = useI18n()

// STATE
const isPending = ref(false)
const isSuccess = ref(false)
const isDisabled = computed(() => props.disabled || isPending.value)

// ERRORS
const error = ref<FetchError | null>(null)
const errorsPerProperty = computed(() => {
    return error.value?.response?._data?.violations || error.value?.response?._data?.errorsPerForm || []
})
const errorMessage = computed(() => {
    if (!error.value) return

    if (props.errorLabel) return props.errorLabel

    if (error.value?.response?._data?.['hydra:description'] && errorsPerProperty.value.length === 0) {
        return error.value?.response?._data['hydra:description'] || null
    }

    if (errorsPerProperty.value.length > 0) {
        return 'form.contains_errors'
    }

    if (error.value?.response?._data?.detail) {
        return error.value?.response?._data?.detail || null
    }

    if (error.value?.response?.status === 429) {
        return t('form.error_too_many_requests')
    }

    return 'form.error' // null
})

// SUBMIT
const canSubmit = computed(() => props.allowSubmittingAgain || !isSuccess.value)

const submitButtonLabel = computed(() => {
    if (isPending.value) return props.pendingLabel || t('form.pending')
    return props.submitLabel || t('form.submit')
})

const defaultSubmitCallback: SubmitFunction = async ({ action, formData }: FormSubmitParams) => {
    const url = action || useJoinApiUrl(useRoute().path)
    const fetch = useRoadizFetchFactory()

    // Error exception don't contain data
    return await fetch(url, {
        method: 'POST',
        body: formData,
    })
}

const formEl = ref<null | HTMLFormElement>(null)
const resetFormData = () => {
    formEl.value?.reset()
    model.value = {}
}

const formattedAction = computed(() => {
    if (!props.action) return

    return useJoinApiUrl(props.action)
})

// INIT RECAPTCHA
const RECAPTCHA_INPUT = 'g-recaptcha-response'
const { recaptcha, init: initRecaptcha } = useRecaptchaState()
onBeforeMount(initRecaptcha)

// SUBMIT
async function onSubmit(event: FormDataEvent): Promise<void> {
    emit('submit', event)

    if (event.defaultPrevented) return

    event.preventDefault()

    const form = event.target as HTMLFormElement
    const action = form.action
    const formData = new FormData(form)

    isPending.value = true
    error.value = null

    if (formData.has(RECAPTCHA_INPUT)) {
        await recaptcha.value?.recaptchaLoaded()
        const token = await recaptcha.value?.executeRecaptcha('form')

        if (token) formData.set(RECAPTCHA_INPUT, token)
    }

    const submitCallback = props.submitCallback || defaultSubmitCallback
    const submitObject = { action, formData } as FormSubmitParams

    await submitCallback(submitObject)
        .then(() => {
            isSuccess.value = true
            resetFormData()
        })
        .catch((submitError: FetchError) => {
            isSuccess.value = false
            error.value = submitError

            Sentry.captureException(submitError)
        })
        .finally(() => {
            isPending.value = false
        })
}

// SCHEMA
const { data: loadedSchema } = typeof props.schema === 'string' ? await useRoadizFetch<JsonSchemaExtended>(useJoinApiUrl(props.schema)) : { data: null }

const gdprContent = computed(() => props.gdpr && t('form.gdpr'))
const rawSchema = computed(() => (typeof props.schema === 'object' ? props.schema : loadedSchema.value))
const formattedSchema = computed(() => {
    if (!rawSchema.value) {
        return
    }

    const schema = { ...rawSchema.value }

    // remove recaptcha
    delete schema.properties?.recaptcha
    if (schema.required && Array.isArray(schema.required)) {
        schema.required = schema.required.filter((value: string) => value !== 'recaptcha')
    }

    return schema
})
</script>

<template>
    <form
        v-if="formattedSchema"
        :id="id"
        ref="formEl"
        :action="formattedAction"
        :method="method"
        @submit="(e) => onSubmit(e)"
    >
        <slot name="beforeFields" />
        <VFormElementFactory
            :id="id"
            v-model="model"
            :components-map="componentsMap"
            :disabled="disabled"
            :errors="errorsPerProperty"
            :schema="formattedSchema"
        />
        <footer :class="$style.footer">
            <div>
                <p
                    v-if="errorMessage"
                    role="status"
                    :class="$style.errors"
                >
                    {{ $t(errorMessage) }}
                </p>
                <p
                    v-if="isSuccess"
                    role="status"
                    :class="$style.success"
                >
                    {{ successLabel || $t('form.success') }}
                </p>
                <slot
                    name="submitButton"
                    v-bind="{ canSubmit, isPending, isDisabled, error, label: submitButtonLabel }"
                >
                    <VButton
                        v-if="canSubmit"
                        :disabled="isDisabled"
                        :label="submitButtonLabel"
                        outlined
                    />
                </slot>
            </div>
            <VMarkdown
                v-if="gdprContent"
                :class="$style.gdpr"
                :content="gdprContent"
                class="text-body-xs"
                inline
                tag="p"
            />
        </footer>
    </form>
</template>

<style lang="scss" module>
.errors {
    margin: 1em 0;
    color: rgb(244, 67, 54);
}

.success {
    margin: 1em 0;
    color: rgb(34, 187, 150);
}

.footer {
    margin-top: px-to-rem(32);
}

.gdpr {
    margin-top: px-to-rem(32);
    color: var(--v-form-gdpr-color, rgb(117 117 117));
}
</style>
