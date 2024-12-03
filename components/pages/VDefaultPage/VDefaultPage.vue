<script lang="ts" setup>
import type { NSPage } from '~/types/roadiz'
import type { PageComponentProps } from '~/types/app'

defineProps<PageComponentProps<NSPage>>()
</script>

<template>
    <div>
        <h1 class="text-h1">
            {{ item.title || 'VDefaultPage' }}
        </h1>
    </div>
</template>

<!-- <style lang="scss" module></style> -->
