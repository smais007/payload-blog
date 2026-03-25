import { CollectionConfig } from 'payload'

export const ArticlesAuthors: CollectionConfig = {
    slug: 'articles-authors',
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
            options: ['Author', 'Editor', 'Contributor', 'Guest'],
            defaultValue: 'Author',
            required: true,
        },
    ],
}
