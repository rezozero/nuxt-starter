<script setup lang="ts">
withDefaults(
    defineProps<{
        playState?: 'paused' | 'running'
    }>(),
    {
        playState: 'running',
    },
)
</script>

<template>
    <svg :class="$style.root" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
        <circle :class="$style.circle" cx="25" cy="25" r="20" stroke-width="5" />
    </svg>
</template>

<style lang="scss" module>
// @see https://codepen.io/zapdev/pen/MYJRaj

@keyframes rotate {
    100% {
        transform: rotate(360deg);
    }
}

@keyframes dash {
    0% {
        stroke-dasharray: 1, 200;
        stroke-dashoffset: 0;
    }

    50% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -35;
    }

    100% {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: -124;
    }
}

.root {
    animation: rotate 1.5s linear infinite;
    animation-play-state: var(--v-spinner-play-state, v-bind(playState));
}

.circle {
    animation: dash 1.5s ease-in-out infinite 0s;
    animation-play-state: inherit;
    fill: none;
    stroke: currentcolor;
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
    stroke-linecap: round;
}
</style>
