<script setup lang="ts">
import schema from './schemas/fields-with-description'
import type { JsonSchemaExtended } from '~/types/json-schema'
</script>

<template>
    <NuxtStory>
        <VForm :schema="(schema as JsonSchemaExtended)" />
    </NuxtStory>
</template>
