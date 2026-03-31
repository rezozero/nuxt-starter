<template>
    <NuxtStory layout="fullscreen">
        <div :class="$style.root">
            <VCollapsible
                label="This is the label"
                collapsed
            />
        </div>
    </NuxtStory>
</template>

<style lang="scss" module>
.root {
    max-width: 600px;
}
</style>
