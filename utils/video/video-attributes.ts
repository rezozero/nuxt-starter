export function getVideoAttrsValues(props: Record<string, unknown>, hasBackgroundProp: boolean) {
    return {
        playsinline: props.playsinline || hasBackgroundProp,
        muted: !!props.muted || hasBackgroundProp,
        loop: !!props.loop || hasBackgroundProp,
        autoplay: !!props.autoplay || hasBackgroundProp,
        controls: props.controls && !hasBackgroundProp,
    }
}
