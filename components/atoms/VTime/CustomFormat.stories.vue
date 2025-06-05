<template>
    <NuxtStory>
        <NuxtStoryVariant title="Start">
            <VTime
                datetime="2023-06-28T22:00:00+02:00"
                :start-date-format="{
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                }"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="End">
            <div>
                <VTime
                    :datetime="['2023-06-28T22:00:00+02:00', '2023-06-29T22:00:00+02:00']"
                    :options="{
                        endDateFormat: {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                        },
                    }"
                />
            </div>
        </NuxtStoryVariant>
    </NuxtStory>
</template>
