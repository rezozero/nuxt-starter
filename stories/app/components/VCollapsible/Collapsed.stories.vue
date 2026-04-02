<template>
    <NuxtStory layout="fullscreen">
        <div :class="$style.root">
            <VCollapsible
                label="This is the label"
                collapsed
            >
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate, delectus earum in minus soluta
                ullam! Atque consectetur fuga totam ullam. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Cupiditate, delectus earum in minus soluta
                ullam! Atque consectetur fuga totam ullam.
            </VCollapsible>
        </div>
    </NuxtStory>
</template>

<style lang="scss" module>
.root {
    max-width: 600px;
}
</style>
