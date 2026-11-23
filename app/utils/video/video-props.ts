import type { PropType } from 'vue'

export const commonVideoProps = {
    background: Boolean,
    fit: { type: String as PropType<'cover' | 'contain'> },
}

export const videoAttributes = {
    width: { type: [Number, String] },
    height: { type: [Number, String] },
    autoplay: Boolean,
    controls: { type: Boolean, default: true },
    playsinline: { type: Boolean, default: true },
    loop: { type: Boolean, default: undefined },
    muted: { type: Boolean, default: undefined },
}

// A `<source>` of a native video: the browser plays the first whose `media` and `type` both match.
export interface VideoSource {
    src: string
    type?: string
    media?: string
}

export const videoSources = {
    sources: { type: Array as PropType<VideoSource[]> },
}

export const embedVideoProps = {
    embedPlatform: { type: String },
    embedId: { type: String },
    // Accessible name of the embed <iframe> (RGAA 2.1).
    title: { type: String },
    youtube: { type: Object as PropType<Record<string, string>> },
    vimeo: { type: Object as PropType<Record<string, string>> },
}
