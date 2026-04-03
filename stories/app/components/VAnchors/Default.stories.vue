<script  lang="ts" setup>
const items = [...Array(10).keys()].map((i) => {
    return {
        id: `id-${i}`,
        label: `item ${i}`,
    }
})

const disabledIndex = 2
</script>

<template>
    <NuxtStory :class="$style.root">
        <NuxtStoryVariant>
            <VAnchors :anchors="items" />
            <main :class="$style.main">
                <section
                    v-for="(item, i) in items"
                    :id="i=== disabledIndex ? undefined : item.id"
                    :key="item.id"
                    :class="$style.section"
                >
                    <h1 :style="i === disabledIndex && { textDecoration: 'line-through' }">
                        {{ item.label }}
                    </h1>
                </section>
            </main>
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<style lang="scss" module>
.root {
    width: min(100% - #{px-to-rem(48)}, #{px-to-rem(700)});

    :global(.nuxt-story__main) {
        width: 100%;
    }
}

.main {
    width: 100%;
}

.section {
    width: 100%;
    min-height: 30vh;
    border-top: 1px solid lightgrey;
}
</style>
