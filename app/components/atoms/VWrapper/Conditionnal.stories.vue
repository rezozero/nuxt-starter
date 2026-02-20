<script lang="ts" setup>
const options = ['h1', 'h2', 'button', null]
const selectedOption = ref(options[0])
</script>

<template>
    <NuxtStory>
        <template #aside>
            <select
                id="wrapper-select"
                name="wrapperElement"
                @change="(e) => selectedOption = e?.target?.value || ''"
            >
                <option value="">
                    --Element to render--
                </option>
                <option
                    v-for="option in options"
                    :key="option || 'falsy'"
                    :value="option"
                    :selected="option === selectedOption"
                >
                    {{ option }}
                </option>
            </select>
        </template>
        <NuxtStoryVariant>
            <VWrapper :wrapper="selectedOption">
                Dynamic {{ selectedOption ? `${selectedOption} tag` : 'text node' }}
            </VWrapper>
        </NuxtStoryVariant>
    </NuxtStory>
</template>
