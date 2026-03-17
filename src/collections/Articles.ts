import type { CollectionConfig } from 'payload'
import type { FieldHook } from 'payload'
import slugify from 'slugify'

const formatSlug: FieldHook = ({ value, siblingData, originalDoc, operation }) => {
    if (operation === 'create' || operation === 'update') {
        const existingSlug =
            typeof value === 'string' && value.trim().length > 0 ? value : undefined
        const titleSource =
            existingSlug ||
            (typeof siblingData?.title === 'string' && siblingData.title.trim().length > 0
                ? siblingData.title
                : typeof originalDoc?.title === 'string'
                  ? originalDoc.title
                  : undefined)

        if (titleSource) {
            return slugify(titleSource, { lower: true, strict: true })
        }
    }

    return value
}

export const Articles: CollectionConfig = {
    slug: 'articles',
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
            unique: true,
        },
        {
            name: 'slug',
            type: 'text',
            required: true,
            unique: true,
            hooks: {
                beforeValidate: [formatSlug],
            },
        },
        {
            name: 'content',
            type: 'richText',
            required: true,
        },
    ],
}
