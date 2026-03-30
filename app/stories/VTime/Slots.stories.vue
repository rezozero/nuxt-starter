<template>
    <NuxtStory>
        <NuxtStoryVariant title="Start">
            <VTime datetime="2023-06-28T22:00:00+02:00">
                <template #start="{ formattedStartDateTime }">
                    <span>Custom {{ formattedStartDateTime }}</span>
                </template>
            </VTime>
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Range separator">
            <div>
                <VTime :datetime="['2023-06-28T22:00:00+02:00', '2023-06-29T22:00:00+02:00']">
                    <template #range-separator>
                        /
                    </template>
                </VTime>
            </div>
        </NuxtStoryVariant>
        <NuxtStoryVariant title="End">
            <div>
                <VTime :datetime="['2023-06-28T22:00:00+02:00', '2023-06-29T22:00:00+02:00']">
                    <template #end="{ formattedEndDateTime }">
                        <span>Custom {{ formattedEndDateTime }}</span>
                    </template>
                </VTime>
            </div>
        </NuxtStoryVariant>
    </NuxtStory>
</template>
