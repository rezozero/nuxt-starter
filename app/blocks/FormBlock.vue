<script setup lang="ts">
import type { UseRoadizBlockProps } from '~~/types/app'
import type { NSFormBlock } from '~~/types/roadiz'
import type { CustomForm } from '~~/types/api'

const props = defineProps<UseRoadizBlockProps>()
const { item } = useRoadizBlock<NSFormBlock>({ props })

const customForm = computed(() => (item.value.customForm as CustomForm[] | undefined)?.[0])
const newsletterSchemaEndpoint = useRuntimeConfig().public.newsletter.schemaEndpoint

const { t, te } = useI18n()

const vFormProps = computed(() => {
    // CustomForm description is used to display GDPR information
    const defaultGdpr = customForm.value?.description

    if (customForm.value?.definitionUrl) {
        return {
            action: customForm.value?.postUrl,
            schema: customForm.value.definitionUrl,
            gdpr: defaultGdpr || (te('form.gdpr') && t('form.gdpr')),
        }
    }
    else if (newsletterSchemaEndpoint) {
        return {
            schema: newsletterSchemaEndpoint,
            action: '/api/newsletter_form/post',
            description: te('form.newsletter_description') ? t('form.newsletter_description') : undefined,
            submitLabel: te('form.newsletter_submit') ? t('form.newsletter_submit') : undefined,
            successLabel: te('form.newsletter_success') ? t('form.newsletter_success') : undefined,
            gdpr: defaultGdpr || (te('form.newsletter_gdpr') && t('form.newsletter_gdpr')),
        }
    }

    return undefined
})

const formId = computed(() => item.value.slug + '-form')
const model = ref({})
</script>

<template>
    <VBlock
        :item="item"
    >
        <h2>{{ item.title }}</h2>
        <VForm
            v-if="vFormProps?.schema"
            :id="formId"
            v-model="model"
            v-bind="vFormProps"
        />
    </VBlock>
</template>
