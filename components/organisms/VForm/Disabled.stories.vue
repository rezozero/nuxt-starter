<script setup lang="ts">
import schema from './schemas/disabled'
import type { JsonSchemaExtended } from '~/types/json-schema'
</script>

<template>
    <NuxtStory>
        <VForm
            :schema="(schema as JsonSchemaExtended)"
            disabled
        />
    </NuxtStory>
</template>
