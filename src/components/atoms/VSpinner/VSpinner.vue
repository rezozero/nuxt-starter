<template functional>
    <svg :class="[data.class, $style.root]" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
        <circle :class="$style.circle" cx="25" cy="25" r="20" stroke-width="5" />
    </svg>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
    name: 'VSpinner',
})
</script>

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
}

.circle {
    animation: dash 1.5s ease-in-out infinite 0s;
    fill: none;
    stroke: currentColor;
    stroke-dasharray: 1, 200;
    stroke-dashoffset: 0;
    stroke-linecap: round;
}
</style>
