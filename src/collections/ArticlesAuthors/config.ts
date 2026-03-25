import { CollectionConfig } from 'payload'
import { ARTICLE_AUTHORS_ROLE_OPTIONS } from './constants'

export const ArticlesAuthors: CollectionConfig = {
    slug: 'articles-authors',
    admin: {
        useAsTitle: 'name',
    },
    fields: [
        {
            name: 'name',
            type: 'text',
            required: true,
        },
        {
            name: 'avatar',
            type: 'upload',
            relationTo: 'media',
            required: true,
        },
        {
            name: 'role',
            type: 'select',
            options: Object.values(ARTICLE_AUTHORS_ROLE_OPTIONS),
            defaultValue: ARTICLE_AUTHORS_ROLE_OPTIONS.AUTHOR,
            required: true,
        },
    ],
}
