<template>
    <NuxtStory layout="fullscreen">
        <div :class="$style.wrapper">
            <VCollapsible>
                <template #button="{ isCollapsed, ariaControls, disabled, toggle }">
                    <button
                        :class="$style.button"
                        :aria-expanded="!isCollapsed"
                        :aria-controls="ariaControls"
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
        </div>
    </NuxtStory>
</template>

<style lang="scss" module>
.wrapper {
    max-width: 600px;
}

.button {
    width: 100%;
    cursor: pointer;
    font-size: 24px;
    margin-block: 20px;
}
</style>
