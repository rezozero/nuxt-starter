<script lang="ts" setup>
import { joinURL } from 'ufo'

const route = useRoute()
const siteUrl = useRuntimeConfig().public.site.url

const options = [
    {
        id: 0,
        label: 'Internal path',
        value: route.path,
    },
    {
        id: 1,
        label: 'Absolute internal url',
        value: joinURL(siteUrl, '_stories'),
    },
    {
        id: 2,
        label: 'External url',
        value: 'https://google.com',
    },
    {
        id: 3,
        label: 'No link',
        value: '',
    },
]

const selectedId = ref(3)

const selectedOption = computed(() => {
    return options.find(o => o.id === selectedId.value) || options[0]
})

function onSelect(event: Event) {
    const el = event.target as HTMLSelectElement
    selectedId.value = Number(el.options[el.selectedIndex].value) || 0
}
</script>

<template>
    <NuxtStory>
        <template #aside>
            <div>Select link type: </div>
            <select
                id="option"
                name="option"
                @input="onSelect"
            >
                <option
                    v-for="option in options"
                    :key="option.id"
                    :selected="option.id === selectedId"
                    :value="option.id"
                >
                    {{ option.label }}
                </option>
            </select>
            <div>Current href: {{ selectedOption.value || 'undefined' }}</div>
        </template>
        <NuxtStoryVariant title="Component label">
            <VRoadizLink
                :label="selectedOption.label"
                :url="selectedOption.value"
            />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Scoped slot">
            <VRoadizLink
                v-slot="{ to, href }"
                :url="selectedOption.value"
                custom
            >
                <NuxtLink :to="href || to">
                    {{ selectedOption.label }}
                </NuxtLink>
            </VRoadizLink>
        </NuxtStoryVariant>
    </NuxtStory>
</template>
