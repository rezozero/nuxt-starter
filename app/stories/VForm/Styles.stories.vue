<script setup lang="ts">
import schema from './schemas/all-fields'
import type { JsonSchemaExtended } from '~~/types/json-schema'
</script>

<template>
    <NuxtStory>
        <div>
            <h1>Default</h1>
            <VForm
                :schema="(schema as JsonSchemaExtended)"
                class="v-form--default"
            />
        </div>
        <div>
            <h1>Underline</h1>
            <VForm
                :schema="(schema as JsonSchemaExtended)"
                class="v-form--underline"
            />
        </div>
    </NuxtStory>
</template>
