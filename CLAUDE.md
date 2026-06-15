# CLAUDE.md

## Traductions (i18n)

Les clés de traduction sont gérées via **Xilofone**, un service externe de gestion des traductions.

Les fichiers `i18n/locales/nuxt.*.json` sont générés automatiquement par la commande :

```bash
pnpm xilo
```

**Ne pas modifier directement les fichiers `nuxt.*.json`.** Toute modification locale sera écrasée lors de la prochaine exécution de `pnpm xilo`.

Pour ajouter ou modifier une clé de traduction, mettre à jour les données directement dans l'interface Xilofone, puis relancer `pnpm xilo` pour synchroniser les fichiers locaux.
