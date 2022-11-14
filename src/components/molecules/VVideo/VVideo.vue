<script lang="ts">
import Vue from 'vue'
import type { PropType, VNode } from 'vue'
import { RoadizDocument } from '@roadiz/abstract-api-client/dist/types/roadiz'
import { VNodeData } from 'vue/types/vnode'
import type Plyr from 'plyr'
import { getEmbedSrc } from '~/utils/embed'
import { isImage } from '~/utils/roadiz/document'
import VImage, { VImageProps } from '~/components/molecules/VImage/VImage.vue'
import IconPlay from '~/assets/images/icons/play.svg?sprite'
import eventBus from '~/utils/event-bus'
import EventType from '~/constants/event-type'
import VButton from '~/components/molecules/VButton/VButton.vue'

type VideoFit = 'cover' | 'none'

export interface VVideoProps {
    document?: RoadizDocument
    src?: string
    controls?: boolean
    autoplay?: boolean
    muted?: boolean
    playsinline?: boolean
    loop?: boolean
    background?: boolean
    fit: VideoFit | boolean
    youtube?: Record<string, string>
    vimeo?: Record<string, string>
    poster?: RoadizDocument | boolean
    posterProps?: VImageProps
    wrapper?: string | boolean
    plyr?: Plyr.Options
    theme?: string
    interaction?: boolean
    hideCta?: boolean
}

export default Vue.extend<any, any, any, VVideoProps>({
    name: 'VVideo',
    props: {
        document: Object as PropType<RoadizDocument>,
        src: String,
        controls: {
            type: Boolean,
            default: true,
        },
        autoplay: Boolean,
        muted: Boolean,
        playsinline: {
            type: Boolean,
            default: true,
        },
        loop: Boolean,
        background: Boolean,
        fit: [String, Boolean] as PropType<VideoFit | boolean>,
        youtube: Object as PropType<Record<string, string>>,
        vimeo: Object as PropType<Record<string, string>>,
        poster: {
            type: [Object, Boolean] as PropType<RoadizDocument | boolean>,
            default: true,
        },
        posterProps: Object as PropType<VImageProps>,
        wrapper: {
            type: [String, Boolean],
            default: 'div',
        },
        plyr: Object as PropType<Plyr.Options>,
        theme: String,
        interaction: Boolean, // the video is playing because of a user interaction
        hideCta: Boolean,
    },
    data() {
        return {
            player: null as Plyr | null,
            hadInteraction: false,
            playerSize: [] as number[],
        }
    },
    computed: {
        isEmbed(): boolean {
            return !!this.document?.embedId && !!this.document?.embedPlatform
        },
        internalPoster(): RoadizDocument | null {
            if (this.poster === true) {
                if (isImage(this.document?.thumbnail)) return this.document?.thumbnail as RoadizDocument
                if (isImage(this.document)) return this.document
            } else if (typeof this.poster === 'object' && isImage(this.poster)) {
                return this.poster
            }

            return null
        },
        embedSrc(): string | void {
            if (!this.isEmbed) return

            const platform = this.document?.embedPlatform

            if (platform !== 'youtube' && platform !== 'vimeo') return

            let params: Record<string, string> = {}

            // Plyr progressive enhancement https://github.com/sampotts/plyr#youtube
            if (platform === 'youtube') {
                params = {
                    iv_load_policy: '3',
                    modestbranding: '1',
                    playsinline: '1',
                    showinfo: '0',
                    rel: '0',
                    enablejsapi: '1',
                }
            } else if (platform === 'vimeo') {
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

            return getEmbedSrc(this.document?.embedId as string, platform, params)
        },
        classNames(): (boolean | string | undefined | null)[] {
            return [
                this.$style.root,
                this.isEmbed && this.$style['root--embed'],
                this.fit === 'cover' && this.$style['root--cover'],
                this.needsInteraction && this.internalPoster && this.$style['root--poster'],
                this.shouldAppendPlayerContent && this.$style['root--player'],
            ]
        },
        needsInteraction(): boolean {
            return (!this.autoplay || (this.autoplay && !this.muted && !this.interaction)) && !this.background
        },
        shouldAppendPlayerContent(): boolean {
            return (this.needsInteraction && this.hadInteraction) || !this.needsInteraction
        },
        playerStyle(): Record<string, string> {
            const style: Record<string, string> = {}

            if (this.playerSize) {
                style.width = this.playerSize[0] + 'px'
                style.height = this.playerSize[1] + 'px'
            }

            return style
        },
    },
    watch: {
        hadInteraction() {
            if (!this.hadInteraction) return

            this.$nextTick(this.createPlayer)
        },
    },
    mounted() {
        if (this.$refs.player) this.createPlayer()
    },
    beforeDestroy() {
        eventBus.$off(EventType.RESIZE, this.onResize)
    },
    methods: {
        async createPlayer() {
            if (this.player || !this.$refs.player) return

            const options: Plyr.Options = {
                disableContextMenu: false,
                controls: ['play', 'progress', 'current-time', 'mute', 'fullscreen'],
                ...this.plyr,
                autoplay: this.background || this.autoplay || (this.needsInteraction && this.hadInteraction),
                muted: this.background || this.muted,
                loop: { active: this.background || this.loop },
            }
            const PlyrClass = await import('plyr').then((module) => module.default)

            if (!this.controls || this.background) options.controls = []
            if (this.background) {
                options.clickToPlay = false
                options.fullscreen = { enabled: false }
            }
            if (this.vimeo) options.vimeo = this.vimeo
            if (this.youtube) options.youtube = this.youtube

            this.player = new PlyrClass(this.$refs.player as HTMLElement, options)

            if (this.fit === 'cover') {
                this.updatePlayerSize()
                eventBus.$on(EventType.RESIZE, this.onResize)
            }
        },
        updatePlayerSize() {
            // for now, it handles cover size only
            const mediaWidth = this.document?.thumbnail?.imageWidth || this.document.imageWidth
            const mediaHeight = this.document?.thumbnail?.imageHeight || this.document.imageHeight
            const ratio = mediaWidth && mediaHeight ? parseFloat(mediaWidth) / parseFloat(mediaHeight) : 16 / 9
            const width = this.$el.clientWidth + 2 // + 2 for hiding a potential antialiasing issue
            const height = this.$el.clientHeight + 2
            const boundsRatio = width / height

            if (boundsRatio < ratio) {
                this.playerSize = [height * ratio, height]
            } else {
                this.playerSize = [width, width * ratio]
            }
        },
        getUrl(src?: string): string | undefined {
            return src && !src.startsWith('http') ? this.$documentURL(src) : src
        },
        onResize() {
            if (this.player && this.fit === 'cover') this.updatePlayerSize()
        },
        onPosterClick() {
            this.hadInteraction = true
        },
    },
    render(createElement): VNode {
        const children: VNode[] = []
        const data: VNodeData = {
            class: this.classNames,
        }
        const image =
            this.internalPoster &&
            this.needsInteraction &&
            createElement(VImage, {
                props: { image: this.internalPoster, ...this.posterProps },
                nativeOn: {
                    click: this.onPosterClick,
                },
                class: this.$style.image,
            })
        const cta =
            this.needsInteraction &&
            !this.hideCta &&
            createElement(VButton, {
                props: {
                    theme: this.theme,
                },
                class: this.$style.cta,
                on: {
                    click: this.onPosterClick,
                },
                scopedSlots: {
                    icon: () => createElement(IconPlay),
                },
            })
        const poster =
            this.needsInteraction &&
            this.internalPoster &&
            createElement(
                'div',
                {
                    class: this.$style.poster,
                },
                // [imageLink || image, cta]
                [image, cta]
            )
        const iframe =
            (this.shouldAppendPlayerContent || !poster) &&
            this.isEmbed &&
            createElement('iframe', {
                attrs: {
                    src: this.embedSrc,
                    allowfullscreen: '',
                    allowtransparency: '',
                    allow: 'autoplay',
                },
                class: this.$style.iframe,
            })
        const player =
            iframe &&
            createElement(
                'div',
                {
                    ref: 'player',
                    style: this.playerStyle,
                },
                [iframe]
            )
        const video =
            (this.shouldAppendPlayerContent || !poster) &&
            !this.isEmbed &&
            createElement(
                'video',
                {
                    attrs: {
                        playsinline: this.playsinline && '',
                        controls: this.controls && !this.background && '',
                        muted: this.muted && '',
                        loop: this.loop && '',
                        autoplay: this.autoplay && '',
                    },
                    ref: 'player',
                    class: this.$style.video,
                },
                [
                    createElement('source', {
                        attrs: {
                            src: this.getUrl(this.src || this.document?.relativePath),
                            type: this.document?.mimeType || 'video/mp4',
                        },
                    }),
                    ...(this.document?.altSources
                        ?.filter((document: RoadizDocument) => !!document.relativePath)
                        ?.map((document: RoadizDocument) =>
                            createElement('source', {
                                attrs: {
                                    src: this.getUrl(document.relativePath),
                                    type: document?.mimeType,
                                },
                            })
                        ) || []),
                ]
            )

        if (!this.wrapper) {
            if (player) return player
            else if (video) return video
        }

        if (poster) children.push(poster)
        if (player) children.push(player)
        if (video) children.push(video)

        return createElement(typeof this.wrapper === 'string' ? this.wrapper : 'div', data, children)
    },
})
</script>

<style lang="scss" module>
.root {
    &--poster {
        position: relative;
    }

    &--cover {
        position: relative;
        overflow: hidden;
        width: 100%;
        height: 100%;
    }
}

.poster {
    position: relative;
    width: var(--v-video-poster-width, auto);
    height: var(--v-video-poster-height, auto);

    .root--player & {
        visibility: hidden;
    }
}

.image picture {
    &::after {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(#000, 0.1);
        content: '';
    }
}

.cta {
    position: absolute;
    bottom: 0;
    left: 0;
    margin: var(--v-video-cta-margin, 24px);

    @include media('>=md') {
        margin: var(--v-video-cta-margin, 32px);
    }

    @include media('>=lg') {
        margin: var(--v-video-cta-margin, 40px);
    }

    @include media('>=xl') {
        margin: var(--v-video-cta-margin, 52px 62px);
    }
}

:global(.plyr__controls) {
    padding: 10px 22px !important;
}

:global(.plyr__volume) {
    width: inherit;
    min-width: inherit;
}
:global(.plyr__controls__item):not(:first-child) {
    margin-left: rem(10) !important;
}

:global(.plyr) {
    --plyr-video-controls-background: #{rgba(color(black), 0.8)};
    --plyr-video-progress-buffered-background: #{rgba(255, 255, 255, 0.3)};
    --plyr-range-fill-background: '#fff';
    --plyr-control-radius: 100%;
    --plyr-video-control-background-hover: #fff;
    --plyr-video-control-color-hover: #{color(black)};
    --plyr-control-icon-size: 15px;
    --plyr-range-track-height: 3px;

    [data-plyr='play'] svg:not(:first-child) {
        transform: translateX(1px);
    }

    .root--poster & {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .root--cover & {
        width: 100%;
        height: 100%;
    }

    .root--embed.root--cover & {
        position: absolute;
        top: 50%;
        left: 50%;
        max-width: none;
        transform: translate(-50%, -50%);
    }
}

.iframe {
    border: 0;
}

.video {
    .root--poster & {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .root--cover & {
        object-fit: cover;
    }
}
</style>
