<script setup lang="ts">
const props = withDefaults(
    defineProps<{
        playState?: 'paused' | 'running'
        size?: number
    }>(), { size: 50 })

const halfSize = computed(() => props.size / 2)
const strokeWidth = computed(() => Math.max(props.size / 10, 1))
const radius = computed(() => halfSize.value - strokeWidth.value / 2)

const perimeter = computed(() => radius.value * 2 * Math.PI)
</script>

<template>
    <svg
        :height="size"
        :width="size"
        :class="$style.root"
        :viewBox="`0 0 ${size} ${size}`"
        xmlns="http://www.w3.org/2000/svg"
    >
        <circle
            :class="$style.circle"
            :cx="halfSize"
            :cy="halfSize"
            :r="radius"
            :stroke-width="strokeWidth"
        />
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
        stroke-dasharray: 1, v-bind(perimeter);
        stroke-dashoffset: 0;
    }

    50% {
        stroke-dasharray: calc(v-bind(perimeter) * 0.3px), v-bind(perimeter);
        stroke-dashoffset: calc(v-bind(perimeter) * -0.2px);
    }

    100% {
        stroke-dasharray: calc(v-bind(perimeter) * 0.3px), v-bind(perimeter);
        stroke-dashoffset: calc(v-bind(perimeter) * -1px);
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
    stroke-dasharray: 1, v-bind(perimeter);
    stroke-dashoffset: 0;
    stroke-linecap: round;
}
</style>
