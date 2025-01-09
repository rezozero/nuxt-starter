<script lang="ts" setup>
import type { PageComponentProps } from '~/types/app'

defineProps<PageComponentProps>()
</script>

<template>
    <div>
        <h1 class="text-h1">
            {{ item.title || 'VDefaultPage' }}
        </h1>
    </div>
</template>

<!-- <style lang="scss" module></style> -->
