<script lang="ts" setup>
import type { RoadizWalker } from '@roadiz/types'

const isOpen = defineModel<boolean>('open')

const { data } = useCommonContent()
const mainMenuWalker = computed(() => data.value?.menus?.mainMenuWalker)
const menu = computed(() => mainMenuWalker.value && useRoadizMenu(mainMenuWalker as RoadizWalker).value)
const route = useRoute()

watch(
    () => route.fullPath,
    () => {
        isOpen.value = false
    },
)
</script>

<template>
    <VModal
        v-model="isOpen"
        :class="$style.root"
    >
        <nav>
            <ul v-if="menu?.children">
                <li
                    v-for="(child, index) in menu.children"
                    :key="index"
                >
                    <VRoadizLink
                        :reference="child.reference"
                        :url="child.url"
                    >
                        {{ child?.title }}
                    </VRoadizLink>
                    <ul v-if="child.children">
                        <li
                            v-for="(subChild, subIndex) in child.children"
                            :key="subIndex"
                        >
                            <VRoadizLink
                                :reference="subChild.reference"
                                :url="subChild.url"
                            >
                                {{ subChild?.title }}
                            </VRoadizLink>
                        </li>
                    </ul>
                </li>
            </ul>
        </nav>
    </VModal>
</template>

<style lang="scss" module>
.root {
    min-height: 300px;
}
</style>
