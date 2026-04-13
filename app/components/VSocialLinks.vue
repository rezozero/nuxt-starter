<script setup lang="ts">
const socials = useRoadizHeadSocialLinks()
</script>

<template>
    <ul :class="$style.root">
        <li
            v-for="social in socials"
            :key="social.url"
        >
            <slot :social="social" />
        </li>
    </ul>
</template>

<style lang="scss" module>
.root {
    position: relative;
    display: flex;
    flex-wrap: wrap;
    padding: var(--v-social-links-padding, 0);
    margin: var(--v-social-links-margin, 0);
    gap: var(--spacing-4xs);
    list-style: none;
}

.button {
    --v-button-padding: 12px;
    --v-button-font-size: 18px;
}
</style>
