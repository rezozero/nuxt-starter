import type { PropType } from 'vue'

// https://github.com/ambroisemaupate/intervention-request#available-operations
export default {
    fit: String,
    align: String,
    flip: String,
    crop: String,
    width: [Number, String],
    height: [Number, String],
    background: String,
    greyscale: [Boolean, Number],
    blur: [Number, String],
    quality: [Number, String],
    progressive: [Number, Boolean],
    interlace: [Number, Boolean],
    sharpen: [Number, String],
    contrast: [Number, String],
    noProcess: [Number, Boolean],
    hotspot: [
        String,
        Object,
    ] as PropType<string | {
        x: [number, string]
        y: [number, string]
        areaStartX?: [number, string]
        areaStartY?: [number, string]
        areaEndX?: [number, string]
        areaEndY?: [number, string]
    }>,
}
