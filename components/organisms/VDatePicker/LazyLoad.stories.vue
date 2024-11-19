<template>
    <NuxtStory>
        <ClientOnly>
            <template #fallback>
                <div :class="$style.fallback">
                    <div :class="$style.head">
                        Loading...
                    </div>
                    <div :class="$style.content">
                        <VSpinner :class="$style.spinner" />
                    </div>
                </div>
            </template>
            <VDatePicker :class="$style['date-picker']" />
        </ClientOnly>
    </NuxtStory>
</template>

<style lang="scss" module>
@use "assets/scss/functions/rem" as *;
@use "assets/scss/functions/color" as *;

.fallback,
.date-picker {
    outline: 2px solid black;
}

.fallback {
    display: flex;
    max-width: rem(380);
    flex-direction: column;
    aspect-ratio: 393 / 286;
    text-align: center;
}

.head {
    display: flex;
    height: 30px;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
    font-size: rem(18);
    font-weight: 600;
}

.content {
    display: flex;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
    margin: rem(16);
    background-color: color(grey-50);
}

.spinner {
    width: rem(40);
}
</style>
