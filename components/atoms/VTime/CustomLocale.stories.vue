<template>
    <NuxtStory>
        <NuxtStoryVariant title="Single">
            <VTime
                datetime="2023-06-28T22:00:00+02:00"
                locale="en"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Single (with minutes)">
            <VTime
                datetime="2023-06-28T22:15:00+02:00"
                locale="en"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Range (multi times / same day)">
            <div>
                <VTime
                    :datetime="['2023-06-28T19:30:00+02:00', '2023-06-28T22:30:00+02:00']"
                    locale="en"
                />
            </div>
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Range (multi days / same month)">
            <div>
                <VTime
                    :datetime="['2023-06-28T22:30:00+02:00', '2023-06-29T22:30:00+02:00']"
                    locale="en"
                />
            </div>
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Range (multi days / multi months)">
            <div>
                <VTime
                    :datetime="['2023-06-28T22:30:00+02:00', '2023-07-12T22:30:00+02:00']"
                    locale="en"
                />
            </div>
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Range (multi years)">
            <div>
                <VTime
                    :datetime="['2023-06-28T22:30:00+02:00', '2024-07-12T22:30:00+02:00']"
                    locale="en"
                />
            </div>
        </NuxtStoryVariant>
    </NuxtStory>
</template>
