<script setup lang="ts">
import type { RoadizDocument } from '@roadiz/types'
import type Plyr from 'plyr'

import plyrIconsUrl from '~/assets/images/plyr-icons.svg?url'

import('assets/scss/vendors/_plyr.scss')

const props = defineProps<{
    document?: RoadizDocument
    plyr?: Plyr.Options
}>()

const playerElement = ref<HTMLElement | null>(null)

let player: Plyr | null = null

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

const $style = useCssModule()

async function createPlayer() {
    if (player || !playerElement.value) return

    const options: Plyr.Options = {
        disableContextMenu: false,
        iconUrl: (plyrIconsUrl as string),
        iconPrefix: 'plyr-icon',
        ...props.plyr,
    }
    const PlyrClass = await import('plyr').then(module => module.default)

    player = new PlyrClass(playerElement.value, options)
    player.elements.container?.classList.add($style['plyr-native-container'])
}

onMounted(() => {
    if (playerElement.value && !isEmbed.value) createPlayer()
})
</script>

<template>
    <iframe
        v-if="isEmbed"
        :src="embedSrc"
        :class="$style.iframe"
    />
    <audio
        v-else
        ref="playerElement"
        controls
        :class="$style.iframe"
    >
        <source
            :src="internalSrc"
            :type="document?.mimeType || 'audio/mpeg'"
        >
    </audio>
</template>

<style lang="scss" module>
.iframe {
    border: 0;
}

.plyr-native-container {
    --plyr-control-icon-size: 24px;
}
</style>
