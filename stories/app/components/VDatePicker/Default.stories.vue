<template>
    <NuxtStory>
        <div :class="$style.root">
            <ClientOnly>
                <VDatePicker />
            </ClientOnly>
        </div>
    </NuxtStory>
</template>

<style lang="scss" module>
.root {
    max-width: 500px;
    margin: 0 auto;
}
</style>
