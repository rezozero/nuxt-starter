<script setup lang="ts">
import type { RoadizDocument } from '@roadiz/types'

const props = defineProps<{
    document?: RoadizDocument
}>()

const internalSrc = computed(() => {
    return props.document?.relativePath
        && !props.document.relativePath.startsWith('http')
        && !props.document.relativePath.startsWith('/')
        ? useRoadizDocumentUrl(props.document.relativePath)
        : props.document?.relativePath
})

const isEmbed = computed(() => {
    return !!props.document?.embedId && !!props.document?.embedPlatform
})

// An embed <iframe> needs a name of its own (RGAA 2.1): the document title when
// the CMS has one, a generic label otherwise.
const { t } = useI18n()
const iframeTitle = computed(() => props.document?.name || t('audio_player.iframe_title'))

const embedSrc = computed(() => {
    if (!isEmbed.value) return

    const platform = props.document?.embedPlatform

    if (platform !== 'deezer' && platform !== 'spotify' && platform !== 'soundcloud') return

    let params: Record<string, string> = {}

    // if (platform === 'deezer') {
    //   params = {}
    // }
    //
    // if (platform === 'spotify') {
    //   params = {}
    // }

    if (platform === 'soundcloud') {
        params = {
            hide_related: '0',
            show_comments: '0',
            show_artwork: '0',
            show_user: '0',
            show_reposts: '0',
            visual: '0',
            controls: '0',
        }
    }

    return getEmbedSrc(props.document?.embedId as string, platform, params)
})

onMounted(() => {
    if (!isEmbed.value) import('~/utils/video/define-player-elements')
})
</script>

<template>
    <iframe
        v-if="isEmbed"
        :src="embedSrc"
        :title="iframeTitle"
        :class="$style.iframe"
    />
    <media-i18n v-else>
        <audio-player>
            <media-container :class="$style.player">
                <audio>
                    <source
                        :src="internalSrc"
                        :type="document?.mimeType || 'audio/mpeg'"
                    >
                </audio>
                <VPlayerControls audio />
                <media-hotkey
                    keys="Space"
                    action="togglePaused"
                />
                <media-hotkey
                    keys="m"
                    action="toggleMuted"
                />
                <media-hotkey
                    keys="ArrowLeft"
                    action="seekStep"
                    value="-10"
                />
                <media-hotkey
                    keys="ArrowRight"
                    action="seekStep"
                    value="10"
                />
            </media-container>
        </audio-player>
    </media-i18n>
</template>

<style lang="scss" module>
.iframe {
    border: 0;
}

.player {
    display: block;
}
</style>
