<script lang="ts">
import type { PropType } from 'vue'
import { getVideoAttrsValues } from '~/utils/video/video-attributes'
import { getEmbedSrc } from '~/utils/embed'

// interface VVideoSource {
//     src: string
//     type?: string
// }

export const vVideoProps = {
    src: String,
    width: { type: [Number, String] },
    height: { type: [Number, String] },
    autoplay: Boolean,
    controls: { type: Boolean, default: true },
    playsinline: { type: Boolean, default: true },
    loop: { type: Boolean, default: undefined },
    muted: { type: Boolean, default: undefined },
    embedPlatform: { type: String as PropType<'youtube' | 'vimeo'> },
    embedId: { type: String },
    youtube: { type: Object as PropType<Record<string, string>> },
    vimeo: { type: Object as PropType<Record<string, string>> },
    background: Boolean,
    fit: { type: String as PropType<'cover' | 'contain'> },
}

export default defineComponent({
    props: {
        ...vVideoProps,
    },
    emits: ['ready'],
    setup(props, { emit }) {
        const isEmbed = computed(() => !!props.embedPlatform && !!props.embedId)
        const embedSrc = computed(() => {
            if (!isEmbed.value) return

            let params: Record<string, string> = {}

            if (props.embedPlatform === 'youtube') {
                params = {
                    iv_load_policy: '3',
                    modestbranding: '1',
                    playsinline: '1',
                    showinfo: '0',
                    rel: '0',
                    enablejsapi: '1',
                }
            }
            else if (props.embedPlatform === 'vimeo') {
                params = {
                    loop: 'false',
                    byline: 'false',
                    portrait: 'false',
                    title: 'false',
                    speed: 'true',
                    transparent: '0',
                    gesture: 'media',
                }
            }

            return getEmbedSrc(props.embedId as string, props.embedPlatform as string, params)
        })

        // Attributes
        const videoAttrsValue = computed(() => getVideoAttrsValues(props, props.background))
        const playsinline = computed(() => videoAttrsValue.value.playsinline)
        const muted = computed(() => videoAttrsValue.value.muted)
        const loop = computed(() => videoAttrsValue.value.loop)
        const autoplay = computed(() => videoAttrsValue.value.autoplay)
        const controls = computed(() => videoAttrsValue.value.controls)
        const videoAttrs = computed(() => {
            return {
                src: props.src,
                width: props.width,
                height: props.height,
                playsinline: playsinline.value ? '' : undefined,
                muted: muted.value ? '' : undefined,
                loop: loop.value ? '' : undefined,
                autoplay: autoplay.value ? '' : undefined,
                controls: controls.value ? '' : undefined,
            }
        })

        // STYLE
        const $style = useCssModule()
        const ratio = computed(() => {
            return props.width && props.height && Number(props.width) / Number(props.height)
        })
        const playerSize = ref<number[]>([])
        const iframeStyle = computed(() => {
            const style: Record<string, string | number> = {}

            if (playerSize.value.length) {
                style.width = playerSize.value[0] + 'px'
                style.height = playerSize.value[1] + 'px'
            }

            return style
        })

        // PLAYER
        const playerElement = ref<HTMLElement | null>(null)
        let player: Plyr | null = null

        async function createPlayer() {
            if (player || !playerElement.value) return

            const options: Plyr.Options = {
                disableContextMenu: false,
                controls: ['play', 'progress', 'current-time', 'mute', 'fullscreen'],
                ...props.plyr,
                iconUrl: '/images/plyr-icons.svg', // TODO: use Vite to import this file. But it's not working for now.
                iconPrefix: 'plyr-icon',
                autoplay: autoplay.value,
                muted: muted.value,
                loop: { active: loop.value },
            }
            const PlyrClass = await import('plyr').then(module => module.default)

            // I don't know why but listeners property is not used by Plyr.
            // As a workaround I will define the listeners later with on().
            // Remove the listeners property to be sure that the callbacks are not called twice.
            delete options.listeners

            if (!controls.value) options.controls = []
            if (props.background) {
                options.clickToPlay = false
                options.fullscreen = { enabled: false }
            }
            if (props.vimeo) options.vimeo = props.vimeo
            if (props.youtube) options.youtube = props.youtube

            player = new PlyrClass(playerElement.value as HTMLElement, options)

            // Add style to new generated plyr DOM
            player?.elements.container?.classList.add($style['root-initialized'])

            player.on('ready', onPlayerReady)

            // Fix listeners into Plyr options because the callbacks are never called.
            if (props.plyr?.listeners) {
                Object.keys(props.plyr.listeners).forEach(value =>
                    player!.on(value as keyof Plyr.PlyrEventMap, props.plyr!.listeners![value]),
                )
            }

            if (props.fit === 'cover') {
                useEventListener('resize', updatePlayerSize, { passive: true })
                updatePlayerSize()
            }
        }
        const videoReady = ref(false)

        function onPlayerReady() {
            if (player && (props.autoplay || props.background)) {
                // the player is initialized with muted property as true but sometimes Plyr kept a wrong muted value into localStorage (i.e. muted = false)
                // @see https://github.com/sampotts/plyr/issues/838#issuecomment-962596150
                player.muted = muted.value
                player.play()
            }

            emit('ready', player)

            videoReady.value = true
        }

        function updatePlayerSize() {
            // for now, it handles cover size only
            const videoRatio = ratio.value || 16 / 9

            const width = (playerElement.value?.clientWidth || 0) + 2 // + 2 for hiding a potential antialiasing issue
            const height = (playerElement.value?.clientHeight || 0) + 2
            const boundsRatio = width / height

            if (boundsRatio < videoRatio) {
                playerSize.value = [height * videoRatio, height]
            }
            else {
                playerSize.value = [width, width * videoRatio]
            }
        }

        function disposePlayer() {
            player?.destroy()
            player = null
        }

        onMounted(createPlayer)
        onBeforeUnmount(disposePlayer)

        return {
            isEmbed,
            embedSrc,
            videoAttrs,
            playerElement,
            iframeStyle,
            videoReady,
        }
    },
})
</script>

<template>
    <div
        :class="$style.root"
    >
        <iframe
            v-if="isEmbed"
            ref="playerElement"
            :src="embedSrc"
            frameborder="0"
            allow="autoplay"
            :style="iframeStyle"
        />
        <video
            v-else
            ref="playerElement"
            v-bind="videoAttrs"
        >
            <slot />
        </video>
    </div>
</template>

<style lang="scss" module>
.root {

}

.iframe-wrapper {
    width: 100%;
    height: 100%;

    .video,
    .iframe {
        @include video-properties;
    }
}

.iframe,
.video {
    @include video-properties;
}
</style>
