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

export const videoFile = {
    relativePath: { type: String, required: true },
    mimeType: { type: String },
}

export const videoSrc = {
    src: { type: String },
    mimeType: { type: String },
    altSources: { type: Array as PropType<(typeof videoFile)[]> },
}

export const embedVideoProps = {
    embedPlatform: { type: String as PropType<'youtube' | 'vimeo'> },
    embedId: { type: String },
    youtube: { type: Object as PropType<Record<string, string>> },
    vimeo: { type: Object as PropType<Record<string, string>> },
}
