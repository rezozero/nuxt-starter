<script lang="ts" setup>
// Control bar of `VVideoPlayer` and `VRoadizAudio`, built from Video.js UI elements
// (registered by `~/utils/video/define-player-elements`). The elements give each control its
// role, keyboard support and translated `aria-label`; this component only draws them.
defineProps({
    // Audio has no fullscreen nor controls auto-hiding, but a volume slider
    audio: Boolean,
})
</script>

<template>
    <media-controls :visibility="audio ? 'always' : undefined">
        <media-controls-content :class="[$style.root, audio && $style['root--audio']]">
            <media-controls-group :class="$style.group">
                <media-play-button :class="[$style.button, $style.play]">
                    <VIcon
                        name="player-play"
                        :class="[$style.icon, $style['icon-play']]"
                    />
                    <VIcon
                        name="player-pause"
                        :class="[$style.icon, $style['icon-pause']]"
                    />
                </media-play-button>
                <media-time-slider :class="[$style.slider, $style['slider--time']]">
                    <media-slider-track :class="$style.track">
                        <media-slider-buffer :class="$style.buffer" />
                        <media-slider-fill :class="$style.fill" />
                    </media-slider-track>
                    <media-slider-thumb :class="$style.thumb" />
                </media-time-slider>
                <media-time
                    type="remaining"
                    :class="$style.time"
                />
                <media-mute-button :class="[$style.button, $style.mute]">
                    <VIcon
                        name="player-volume"
                        :class="[$style.icon, $style['icon-volume']]"
                    />
                    <VIcon
                        name="player-muted"
                        :class="[$style.icon, $style['icon-muted']]"
                    />
                </media-mute-button>
                <media-volume-slider
                    v-if="audio"
                    :class="[$style.slider, $style['slider--volume']]"
                >
                    <media-slider-track :class="$style.track">
                        <media-slider-fill :class="$style.fill" />
                    </media-slider-track>
                    <media-slider-thumb :class="$style.thumb" />
                </media-volume-slider>
                <media-fullscreen-button
                    v-else
                    :class="[$style.button, $style.fullscreen]"
                >
                    <VIcon
                        name="player-fullscreen-enter"
                        :class="[$style.icon, $style['icon-fullscreen-enter']]"
                    />
                    <VIcon
                        name="player-fullscreen-exit"
                        :class="[$style.icon, $style['icon-fullscreen-exit']]"
                    />
                </media-fullscreen-button>
            </media-controls-group>
        </media-controls-content>
    </media-controls>
</template>

<style lang="scss" module>
.root {
    --focus-outline-color: rgb(255 255 255);

    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    display: block;
    padding: 10px 16px;
    border-radius: 2px;
    margin: 10px var(--v-player-controls-margin-inline, 16px);
    background-color: rgb(1 1 1);
    color: rgb(255 255 255);
    transition:
        opacity 0.2s,
        translate 0.2s;

    @include media('>=vl') {
        padding: 16px 24px;
        margin: 16px var(--v-player-controls-margin-inline, 24px);
    }

    // Kept on screen while the keyboard is in it, even when the player goes idle
    &:not([data-visible], :has(:focus-visible)) {
        opacity: 0;
        pointer-events: none;
        translate: 0 100%;
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }

    &--audio {
        position: relative;
        margin: 0;
    }
}

.group {
    display: flex;
    align-items: center;
}

.button {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
    padding: 0;
    border-radius: 100%;
    cursor: pointer;
    margin-inline-start: 24px;

    // Mute and fullscreen get `hidden` where the media cannot honor them
    &:not([hidden]) {
        display: inline-flex;
    }

    @media (hover: hover) {
        &:hover {
            background-color: rgb(255 255 255 / 5%);
        }
    }
}

.play {
    margin-inline-start: 0;
}

.icon {
    width: 100%;
    height: 100%;
}

// `:defined`: an element not upgraded yet has no state attribute, and would read as playing
.icon-pause,
.icon-muted,
.icon-fullscreen-exit,
.play:defined:not([data-paused]) .icon-play,
.mute[data-muted] .icon-volume,
.fullscreen[data-fullscreen] .icon-fullscreen-enter {
    display: none;
}

.play:defined:not([data-paused]) .icon-pause,
.mute[data-muted] .icon-muted,
.fullscreen[data-fullscreen] .icon-fullscreen-exit {
    display: block;
}

.slider {
    position: relative;
    display: flex;
    height: 24px;
    align-items: center;
    cursor: pointer;
    margin-inline-start: 16px;

    &--time {
        flex: 1;
    }

    &--volume {
        width: 80px;
        flex-shrink: 0;
    }
}

.track {
    position: absolute;
    right: 0;
    left: 0;
    overflow: hidden;
    height: 3px;
    border-radius: 3px;
    background-color: rgb(255 255 255 / 25%);
}

.buffer,
.fill {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
}

.buffer {
    width: var(--media-slider-buffer);
    background-color: rgb(255 255 255 / 30%);
}

.fill {
    width: var(--media-slider-fill);
    background-color: rgb(255 255 255);
}

// Only shown while the slider is used: it takes the keyboard focus
.thumb {
    position: absolute;
    left: var(--media-slider-fill);
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: rgb(255 255 255);
    opacity: 0;
    translate: -50% 0;

    .slider[data-interactive] &,
    &:focus-visible {
        opacity: 1;
    }
}

.time {
    flex-shrink: 0;
    font-size: 13px;
    font-variant-numeric: tabular-nums;
    margin-inline-start: 16px;
}
</style>
