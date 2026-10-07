<script setup lang="ts">
const iconFiles = import.meta.glob('~/assets/images/icons/*.svg', { eager: true })

const icons = Object.keys(iconFiles).map((path) => {
    return path.split('/').pop()?.replace('.svg', '') ?? ''
})
</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant title="All icons">
            <div
                :class="$style.container"
            >
                <div
                    v-for="icon in icons"
                    :key="icon"
                    :class="$style.item"
                >
                    <VIcon
                        :name="icon"
                        :class="$style.icon"
                    />
                    <span :class="$style['icon-name']">{{ icon }}</span>
                </div>
            </div>
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<style lang="scss" module>
.container {
    display: grid;
    width: 100%;
    padding: 16px;
    gap: 16px;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
}

.item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 12px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    gap: 8px;
}

.icon {
    font-size: 24px;
}

.icon-name {
    color: #6b7280;
    font-size: 11px;
    text-align: center;
    word-break: break-all;
}
</style>
