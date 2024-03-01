<script setup lang="ts">
import type { NuxtError } from 'nuxt/app'

defineProps<{
    error: NuxtError
}>()
</script>

<template>
    <div>
        <div v-if="error.statusCode === 404">
            {{ $t('error.not_found.title') }}
        </div>
        <div v-else>
            {{ $t('error.title') }}
        </div>
        <div v-if="error.statusCode === 404">
            {{ $t('error.not_found.body') }}
        </div>
        <div v-else>
            {{ $t('error.body') }}
        </div>
        <a href="/">
            {{ $t('error.back_home') }}
        </a>
    </div>
</template>

<style lang="scss" module></style>
