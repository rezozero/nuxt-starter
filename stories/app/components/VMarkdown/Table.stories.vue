<script lang="ts" setup>
const withCaption = `Tableau : Tarifs des visites

| Prestation | Durée | Tarif |
| :--- | :--- | :--- |
| **Visite guidée** | 1 h 30 | 12 € par personne |
| **Visite libre** | Environ 1 h | 8 € par personne |
| **Atelier enfant** | 45 min | 5 € par enfant |`

const centered = `Tableau masqué : Horaires d'ouverture

| Période | Ouverture | Fermeture | Dernier accès |
| :--- | :---: | :---: | :---: |
| **Haute saison** | 9 h | 18 h | 17 h 30 |
| **Basse saison** | 10 h | 17 h | 16 h 30 |`

const plain = `| **Prestation** | **Durée** | **Tarif** |
| :--- | :--- | :--- |
| Visite guidée | 1 h 30 | 12 € par personne |
| Visite libre | Environ 1 h | 8 € par personne |`
</script>

<template>
    <NuxtStory>
        <NuxtStoryVariant title="Caption and row headers">
            <VMarkdown :content="withCaption" />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Centered columns, hidden caption">
            <VMarkdown :content="centered" />
        </NuxtStoryVariant>
        <NuxtStoryVariant title="Plain GFM table">
            <VMarkdown :content="plain" />
        </NuxtStoryVariant>
    </NuxtStory>
</template>
