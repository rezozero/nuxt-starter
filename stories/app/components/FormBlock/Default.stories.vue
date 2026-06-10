<script lang="ts" setup>
import type { RoadizWalkerKnown } from '~/utils/roadiz/types'
import type { NSFormBlock } from '~~/types/roadiz'
import type { CustomForm } from '~~/types/api'

const walker: RoadizWalkerKnown<NSFormBlock> = {
    item: {
        slug: 'form-block',
        title: 'Form block title',
        customForm: [{
            definitionUrl: '/custom_forms/contact/definition',
            postUrl: '/api/contact_form/post',
            description: 'En soumettant ce formulaire, vous acceptez que vos données soient traitées conformément à notre politique de confidentialité.',
        } as CustomForm],
    },
    children: [],
}
</script>

<template>
    <NuxtStory>
        <FormBlock
            :walker="walker"
            :index="0"
        />
    </NuxtStory>
</template>
