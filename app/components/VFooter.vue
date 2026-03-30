<script lang="ts" setup>
import type { RoadizWalker } from '@roadiz/types'

const { data } = useCommonContent()

const footerData = computed(() => data.value?.footers?.footerWalker)

const mainMenuWalker = computed(() => data.value?.menus?.footerMenuWalker as RoadizWalker | undefined)
const mainMenu = computed(() => mainMenuWalker.value && useRoadizMenu(mainMenuWalker.value).value)
</script>

<template>
    <footer
        role="contentinfo"
    >
        <h2>{{ footerData?.item.title }}</h2>
        <ul v-if="mainMenu?.children">
            <li
                v-for="(child, index) in mainMenu.children"
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
    </footer>
</template>
