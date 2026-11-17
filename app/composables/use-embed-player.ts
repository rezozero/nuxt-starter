import type { Ref } from 'vue'

type EmbedCommand = 'play' | 'pause'

// `YT.PlayerState`
const YOUTUBE_ENDED = 0
const YOUTUBE_PLAYING = 1
const YOUTUBE_PAUSED = 2

// The SDKs poll at this pace until the player answers.
const HANDSHAKE_INTERVAL = 250

function parseMessage(data: unknown): Record<string, unknown> | undefined {
    if (typeof data === 'string') {
        try {
            return JSON.parse(data)
        }
        catch {
            return undefined
        }
    }

    return data && typeof data === 'object' ? data as Record<string, unknown> : undefined
}

// Drives a YouTube or Vimeo iframe through the postMessage protocol their own SDKs
// (`www-widgetapi.js`, `player.js`) speak, without loading them: enough to play, pause
// and follow the playback state — all a background video needs.
export function useEmbedPlayer(
    iframe: Ref<HTMLIFrameElement | null | undefined>,
    platform: MaybeRefOrGetter<string | undefined>,
) {
    const isReady = ref(false)
    const isPlaying = ref(false)
    // Width over height of the video itself, Vimeo only: the document's dimensions come
    // from its thumbnail, whose ratio rarely matches the video's.
    const videoRatio = ref<number>()
    let videoWidth: number | undefined
    let videoHeight: number | undefined

    const isYouTube = computed(() => toValue(platform) === 'youtube')

    // YouTube tags its messages with the id the parent introduced itself with.
    const id = useId()

    function getOrigin() {
        try {
            return iframe.value?.src ? new URL(iframe.value.src).origin : undefined
        }
        catch {
            return undefined
        }
    }

    function post(message: Record<string, unknown>) {
        const target = iframe.value?.contentWindow
        const origin = getOrigin()
        if (!target || !origin) return

        // YouTube only parses strings, Vimeo takes both.
        if (isYouTube.value) target.postMessage(JSON.stringify({ ...message, id, channel: 'widget' }), origin)
        else target.postMessage(message, origin)
    }

    // The last command given before the player could take it, sent once it can.
    let pendingCommand: EmbedCommand | undefined

    function send(command: EmbedCommand) {
        if (!isReady.value) {
            pendingCommand = command
            return
        }

        if (isYouTube.value) post({ event: 'command', func: command === 'play' ? 'playVideo' : 'pauseVideo', args: [] })
        else post({ method: command })
    }

    // The player may have loaded before hydration, its own greeting lost: knock until it answers.
    let handshakeTimer: ReturnType<typeof setInterval> | undefined

    function stopHandshake() {
        clearInterval(handshakeTimer)
        handshakeTimer = undefined
    }

    function knock() {
        if (isYouTube.value) post({ event: 'listening' })
        else post({ method: 'ping' })
    }

    function startHandshake() {
        stopHandshake()
        if (isReady.value) return

        knock()
        handshakeTimer = setInterval(knock, HANDSHAKE_INTERVAL)
    }

    function onReady() {
        if (isReady.value) return

        isReady.value = true
        stopHandshake()

        if (isYouTube.value) {
            post({ event: 'command', func: 'addEventListener', args: ['onStateChange'] })
        }
        else {
            ['playing', 'pause', 'ended'].forEach(value => post({ method: 'addEventListener', value }))
            // Autoplay may have started before the subscription, its `playing` unheard.
            post({ method: 'getPaused' })
            post({ method: 'getVideoWidth' })
            post({ method: 'getVideoHeight' })
        }

        if (pendingCommand) {
            send(pendingCommand)
            pendingCommand = undefined
        }
    }

    function onVideoSize() {
        if (videoWidth && videoHeight) videoRatio.value = videoWidth / videoHeight
    }

    function onYouTubeState(state: unknown) {
        if (state === YOUTUBE_PLAYING) isPlaying.value = true
        else if (state === YOUTUBE_PAUSED || state === YOUTUBE_ENDED) isPlaying.value = false
    }

    useEventListener(window, 'message', (event: MessageEvent) => {
        if (!iframe.value || event.source !== iframe.value.contentWindow || event.origin !== getOrigin()) return

        const message = parseMessage(event.data)
        if (!message) return

        if (isYouTube.value) {
            // Any answer means the player listens, the SDK flushes its queue on the first one.
            onReady()

            if (message.event === 'onStateChange') onYouTubeState(message.info)
            else if (message.event === 'infoDelivery' || message.event === 'initialDelivery') {
                onYouTubeState((message.info as Record<string, unknown> | undefined)?.playerState)
            }
        }
        // Vimeo answers a ping with the ping itself or with `ready`.
        else if (message.event === 'ready' || message.method === 'ping') onReady()
        else if (message.method === 'getPaused') isPlaying.value = message.value === false
        else if (message.method === 'getVideoWidth' || message.method === 'getVideoHeight') {
            const value = Number(message.value) || undefined

            if (message.method === 'getVideoWidth') videoWidth = value
            else videoHeight = value

            onVideoSize()
        }
        else if (message.event === 'playing') isPlaying.value = true
        else if (message.event === 'pause' || message.event === 'ended') isPlaying.value = false
    })

    watch(iframe, (element) => {
        isReady.value = false
        isPlaying.value = false
        videoRatio.value = undefined
        videoWidth = undefined
        videoHeight = undefined

        // Still blank and same-origin, knocks would be refused: `load` starts the handshake.
        if (element?.contentDocument === null) startHandshake()
        else stopHandshake()
    })

    // Knocks sent while the iframe was still blank were lost: the SDKs start over on load.
    useEventListener(iframe, 'load', startHandshake)

    onScopeDispose(stopHandshake)

    return {
        isReady: readonly(isReady),
        isPlaying: readonly(isPlaying),
        videoRatio: readonly(videoRatio),
        play: () => send('play'),
        pause: () => send('pause'),
    }
}
