<script setup lang="ts">
import schema from './schemas/errors'
import type { JsonSchemaExtended } from '~~/types/json-schema'

const submitCallback = () => {
    return Promise.reject({
        response: {
            data: {
                errorsPerForm: {
                    date: {
                        date: 'date error',
                    },
                    date_and_time: {
                        date_and_time: 'date and time error',
                    },
                    text: {
                        text: 'text error',
                    },
                    textarea: {
                        textarea: 'textarea error',
                    },
                    markdown: {
                        markdown: 'markdown error',
                    },
                    boolean: {
                        boolean: 'boolean error',
                    },
                    number_int: {
                        number_int: 'number_int error',
                    },
                    number_float: {
                        number_float: 'number_float error',
                    },
                    email: {
                        email: 'email error',
                    },
                    choice_single: {
                        choice_single: 'choice_single error',
                    },
                    choice_single_extended: {
                        choice_single_extended: 'choice_single_extended error',
                    },
                    choice_multiple: {
                        choice_multiple: 'choice_multiple error',
                    },
                    choice_multiple_extended: {
                        choice_multiple_extended: 'choice_multiple_extended error',
                    },
                    documents: {
                        documents: 'documents error',
                    },
                },
            },
        },
    })
}
</script>

<template>
    <NuxtStory>
        <VForm
            :schema="(schema as JsonSchemaExtended)"
            :submit-callback="submitCallback"
            action="test-errors"
            novalidate
        />
    </NuxtStory>
</template>
