<script setup lang="ts">
// `VDatePicker` shows its placeholder while the calendar chunk loads: one month per row count it can draw
const months = [
    { title: '4 weeks (February 2027)', date: new Date(2027, 1, 15) },
    { title: '5 weeks (October 2026)', date: new Date(2026, 9, 15) },
    { title: '6 weeks (November 2026)', date: new Date(2026, 10, 15) },
]

const selectedDates = ref<(Date | Date[] | null)[]>(months.map(month => month.date))
</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant
            v-for="(month, index) in months"
            :key="month.title"
            :title="month.title"
        >
            <div :class="$style.row">
                <figure :class="$style.figure">
                    <VDatePickerPlaceholder :month="month.date" />
                    <figcaption :class="$style.caption">
                        Placeholder
                    </figcaption>
                </figure>
                <figure :class="$style.figure">
                    <!-- Same box: the calendar must replace the placeholder without moving -->
                    <div :class="$style.stack">
                        <VDatePicker v-model="selectedDates[index]" />
                        <VDatePickerPlaceholder
                            :month="month.date"
                            :class="$style.overlay"
                        />
                    </div>
                    <figcaption :class="$style.caption">
                        Placeholder over the loaded calendar
                    </figcaption>
                </figure>
            </div>
        </NuxtStoryVariant>
    </NuxtStory>
</template>

<style lang="scss" module>
.row {
    display: flex;
    flex-wrap: wrap;
    gap: 40px;
}

.figure {
    width: $date-picker-max-width;
    margin: 0;
}

.stack {
    display: grid;

    > * {
        grid-area: 1 / 1;
    }
}

.overlay {
    opacity: 0.5;
    pointer-events: none;
}

.caption {
    @include text-body-s;

    margin-top: 16px;
    text-align: center;
}
</style>
