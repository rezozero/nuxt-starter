const TOTAL_ITEMS = 40

export default defineEventHandler((event) => {
    // Parse the query manually: the auto-imported `getQuery` resolves to h3 v2, incompatible with the h3 v1 event
    const query = Object.fromEntries(new URL(event.path, 'http://localhost').searchParams)
    const page = Math.max(Number(query.page) || 1, 1)
    const itemsPerPage = Math.min(Math.max(Number(query.itemsPerPage) || 12, 1), 100)

    if (query.search === 'error') {
        throw createError({ statusCode: 500, statusMessage: 'Mocked server error' })
    }

    if (query.search === 'empty') {
        return { 'hydra:member': [], 'hydra:totalItems': 0 }
    }

    const start = (page - 1) * itemsPerPage
    const end = Math.min(start + itemsPerPage, TOTAL_ITEMS)
    const members = []

    for (let i = start; i < end; i++) {
        members.push({
            '@id': `/api/articles/${i + 1}`,
            '@type': 'NSArticle',
            'title': `Article ${i + 1}`,
            'url': `/article-${i + 1}`,
            'publishedAt': new Date(Date.UTC(2026, 0, i + 1)).toISOString(),
        })
    }

    return { 'hydra:member': members, 'hydra:totalItems': TOTAL_ITEMS }
})
