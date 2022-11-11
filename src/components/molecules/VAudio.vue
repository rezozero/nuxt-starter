<script lang="ts">
import Vue from 'vue'
import type { PropType, VNode } from 'vue'
import { RoadizDocument } from '@roadiz/abstract-api-client/dist/types/roadiz'
import Plyr from 'plyr'
import { VNodeData } from 'vue/types/vnode'
import { getEmbedSrc } from '~/utils/embed'

export interface VAudioProps {
    document?: RoadizDocument
    plyr?: Plyr.Options
}

export default Vue.extend<any, any, any, VAudioProps>({
    name: 'VAudio',
    props: {
        document: Object as PropType<RoadizDocument>,
    },
    data() {
        return {
            player: null as Plyr | null,
        }
    },
    computed: {
        internalSrc(): string | undefined {
            return this.document?.relativePath && !this.document.relativePath.startsWith('http')
                ? this.$documentURL(this.document.relativePath)
                : this.document?.relativePath
        },
        isEmbed(): boolean {
            return !!this.document?.embedId && !!this.document?.embedPlatform
        },
        embedSrc(): string | void {
            if (!this.isEmbed) return

            const platform = this.document?.embedPlatform

            if (platform !== 'deezer' && platform !== 'spotify' && platform !== 'soundcloud') return

            let params: Record<string, string> = {}

            if (platform === 'deezer') {
                params = {}
            }

            if (platform === 'spotify') {
                params = {}
            }

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

            return getEmbedSrc(this.document?.embedId as string, platform, params)
        },
    },
    mounted() {
        if (this.$refs.player && !this.isEmbed) this.createPlayer()
    },
    methods: {
        createPlayer() {
            if (this.player || !this.$refs.player) return

            const options: Plyr.Options = {
                disableContextMenu: false,
                ...this.plyr,
            }

            this.player = new Plyr(this.$refs.player as HTMLElement, options)
        },
    },
    render(createElement): VNode {
        const children: VNode[] = []
        const data: VNodeData = {
            class: this.classNames,
        }
        const iframe =
            this.isEmbed &&
            createElement('iframe', {
                attrs: {
                    src: this.embedSrc,
                },
                class: this.$style.iframe,
            })
        const audio =
            !this.isEmbed &&
            createElement(
                'audio',
                {
                    attrs: {
                        controls: true,
                    },
                },
                [
                    createElement('source', {
                        attrs: { src: this.internalSrc, type: this.document?.mimeType || 'audio/mpeg' },
                    }),
                ]
            )

        if (iframe) children.push(iframe)
        if (audio) children.push(audio)

        return createElement('div', data, children)
    },
})
</script>
<style lang="scss" module>
.iframe {
    border: 0;
}
</style>
