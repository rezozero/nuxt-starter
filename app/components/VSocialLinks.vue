<script setup lang="ts">
defineProps<{
    socials: SocialLink[]
}>()
</script>

<template>
    <ul :class="$style.root">
        <li
            v-for="social in socials"
            :key="social.url"
        >
            <slot :social="social">
                <VButton
                    :aria-label="social.name"
                    :to="social.url"
                    :icon-name="social.icon"
                />
            </slot>
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
    gap: var(--v-social-links-gap, var(--spacing-4xs));
    list-style: none;
}
</style>
