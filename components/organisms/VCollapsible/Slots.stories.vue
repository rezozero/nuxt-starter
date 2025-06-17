<template>
    <NuxtStory layout="fullscreen">
        <VCollapsible style="max-width: 600px">
            <template #control="{ isCollapsed, ariaControl, disabled, toggle }">
                <button
                    :class="$style.button"
                    :aria-expanded="!isCollapsed"
                    :aria-controls="ariaControl"
                    :disabled="disabled"
                    @click="toggle"
                >
                    Toggle
                </button>
            </template>
            <div>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Cupiditate, delectus earum in minus soluta
                ullam! Atque consectetur fuga totam ullam. Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Cupiditate, delectus earum in minus soluta
                ullam! Atque consectetur fuga totam ullam.
            </div>
        </VCollapsible>
    </NuxtStory>
</template>

<style lang="scss" module>
.button {
    margin-block: 20px;
    width: 100%;
    font-size: 24px;
    cursor: pointer;
}
</style>
