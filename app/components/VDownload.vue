<script setup lang="ts">
import type { RoadizDocument } from '@roadiz/types'

const props = defineProps<{
    document: RoadizDocument
    label?: string
}>()

const { locale, t } = useI18n()

const label = computed(() => props.label || props.document?.name || props.document?.filename || props.document?.alt)

const fileSize = computed(() => {
    const f = props.document?.filesize
    return f && formatBytes(f, locale.value)
})

const outputType = computed(() => {
    // Possible values: image, video, audio, pdf, archive, word, excel
    const type = props.document?.type ? props.document.type.toLowerCase() : undefined

    if (type) {
        return t(`document_type.${type}`)
    }

    return ''
})

const metaText = computed(() => {
    if (fileSize.value && outputType.value) {
        return `${outputType.value} (${fileSize.value})`
    }

    if (outputType.value) {
        return outputType.value
    }

    return null
})
</script>

<template>
    <VRoadizLink
        :document="document"
        :class="$style.root"
    >
        <div
            :class="$style.label"
        >
            {{ label }}
        </div>
        <div
            v-if="metaText"
            :class="$style.meta"
        >
            {{ metaText }}
        </div>
        <VIcon
            name="download"
            :class="$style.icon"
        />
    </VRoadizLink>
</template>

<style lang="scss" module>
.root {
    display: flex;
    width: 100%;
    align-items: center;
    justify-content: space-between;
    container-type: inline-size;
    gap: 6px;
    padding-block: 10px;

    @at-root {
        // remove the user agent style, but without specificity (i.e. :where()) for overriding it easily
        :where(a#{&}:link),
        :where(a#{&}:where(:visited)) {
            color: inherit;
            text-decoration: none;
        }
    }

    &:not([href]) {
        color: var(--v-download-disabled-color, #8C8C8C);
    }
}

.label {
    display: -webkit-box;
    overflow: hidden;
    padding-right: 16px;
    margin-right: auto;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;

    @container (width > 600px) {
        -webkit-line-clamp: 1;
    }
}

.meta {
    white-space: nowrap;
}

.icon {
    flex-shrink: 0;
    font-size: 24px;
}
</style>
