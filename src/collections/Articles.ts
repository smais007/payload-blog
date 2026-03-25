import { convertLexicalToPlaintext } from '@payloadcms/richtext-lexical/plaintext'
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

const MAX_SUMMARY_LENGTH = 160

const generateContentSummary: FieldHook = ({ value, data }) => {
    console.log(data?.content)

    if (value) return ''
    if (!data?.content) return ''
    const text = convertLexicalToPlaintext({ data: data.content }).trim()
    if (!text) return ''
    return text.length > MAX_SUMMARY_LENGTH
        ? `${text.substring(0, MAX_SUMMARY_LENGTH - 3)}...`
        : text
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
        {
            name: 'contentSummary',
            type: 'textarea',
            required: true,
            hooks: {
                beforeValidate: [generateContentSummary],
            },
        },
        {
            name: 'readTimeInMinutes',
            type: 'number',
            defaultValue: 0,
            admin: {
                hidden: true,
            },
            hooks: {
                beforeChange: [
                    ({ siblingData }) => {
                        // Read time is not stored in the database, it's calculated on the fly based on the content length, so we remove it before saving to avoid storing it in the database
                        delete siblingData.readTimeInMinutes
                    },
                ],
                afterRead: [
                    ({ data }) => {
                        const wordsPerMinute = 200 // Average reading speed
                        const text = convertLexicalToPlaintext({ data: data?.content }).trim()
                        const wordCount = text.split(/\s+/).length
                        return Math.ceil(wordCount / wordsPerMinute)
                    },
                ],
            },
        },
        {
            name: 'coverImage',
            type: 'upload',
            relationTo: 'media',
            required: false,
        },
        {
            name: 'authors',
            type: 'relationship',
            relationTo: 'articles-authors',
            required: true,
        },
        {
            name: 'status',
            type: 'select',
            options: ['Draft', 'Published'],
            defaultValue: 'Draft',
        },
        {
            name: 'publishedAt',
            type: 'date',
            required: true,
            admin: {
                condition: (data) => data?.status === 'Published',
                date: {
                    pickerAppearance: 'dayAndTime',
                },
            },
        },
    ],
}
