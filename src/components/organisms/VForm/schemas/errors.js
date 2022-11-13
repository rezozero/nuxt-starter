export default {
    title: 'test_tous_les_types_de_champs',
    type: 'object',
    properties: {
        date_and_time: {
            type: 'string',
            title: 'Date and time',
            attr: {
                'data-group': null,
                placeholder: null,
            },
            widget: 'datetime',
            propertyOrder: 1,
        },
        date: {
            type: 'string',
            title: 'Date',
            attr: {
                'data-group': null,
                placeholder: null,
            },
            widget: 'date',
            propertyOrder: 2,
        },
        text: {
            type: 'string',
            title: 'Text',
        },
        textarea: {
            type: 'string',
            title: 'Textarea',
            attr: {
                'data-group': null,
                placeholder: null,
            },
            widget: 'textarea',
            propertyOrder: 3,
        },
        markdown: {
            type: 'string',
            title: 'Markdown',
            attr: {
                'data-group': null,
                placeholder: null,
            },
            widget: 'textarea',
            propertyOrder: 4,
        },
        boolean: {
            type: 'boolean',
            title: 'Boolean',
            attr: {
                'data-group': null,
                placeholder: null,
            },
            widget: 'checkbox',
            propertyOrder: 5,
        },
        number_int: {
            type: 'integer',
            title: 'Number int',
            attr: {
                'data-group': null,
                placeholder: null,
            },
            propertyOrder: 6,
        },
        number_float: {
            type: 'number',
            title: 'Number float',
            attr: {
                'data-group': null,
                placeholder: null,
            },
            propertyOrder: 7,
        },
        email: {
            type: 'string',
            title: 'Email',
            attr: {
                'data-group': null,
                placeholder: null,
            },
            widget: 'email',
            propertyOrder: 8,
        },
        choice_single: {
            enum: ['Value 1', 'Value 2', 'Value 3'],
            enum_titles: ['Value 1', 'Value 2', 'Value 3'],
            options: {
                enum_titles: ['Value 1', 'Value 2', 'Value 3'],
            },
            type: 'string',
            title: 'Choice single',
            attr: {
                'data-group': null,
                placeholder: null,
            },
            propertyOrder: 9,
        },
        choice_single_extended: {
            enum: ['Value 1', 'Value 2', 'Value 3'],
            enum_titles: ['Value 1', 'Value 2', 'Value 3'],
            options: {
                enum_titles: ['Value 1', 'Value 2', 'Value 3'],
            },
            type: 'string',
            widget: 'choice-expanded',
            title: 'Choice single extended',
            attr: {
                'data-group': null,
                placeholder: null,
            },
            propertyOrder: 10,
        },
        choice_multiple: {
            items: {
                type: 'string',
                enum: ['Value 1', 'Value 2', 'Value 3'],
                enum_titles: [
                    'Value 1',
                    'Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor',
                    'Nullam id dolor id nibh ultricies vehicula ut id elit',
                ],
                options: {
                    enum_titles: ['Value 1', 'Value 2', 'Value 3'],
                },
            },
            minItems: 0,
            uniqueItems: true,
            type: 'array',
            title: 'Choice multiple',
            attr: {
                'data-group': null,
                placeholder: null,
            },
            propertyOrder: 11,
        },
        choice_multiple_extended: {
            items: {
                type: 'string',
                enum: ['Value 1', 'Value 2', 'Value 3'],
                enum_titles: ['Value 1', 'Value 2', 'Value 3'],
                options: {
                    enum_titles: ['Value 1', 'Value 2', 'Value 3'],
                },
            },
            minItems: 0,
            uniqueItems: true,
            type: 'array',
            widget: 'choice-multiple-expanded',
            title: 'Choice multiple extended',
            attr: {
                'data-group': null,
                placeholder: null,
            },
            propertyOrder: 12,
        },
        documents: {
            type: 'string',
            title: 'Documents',
            attr: {
                'data-group': null,
                placeholder: null,
            },
            widget: 'file',
            propertyOrder: 14,
        },
        recaptcha: {
            type: 'string',
            title: 'recaptcha',
            propertyOrder: 15,
        },
    },
    required: ['recaptcha'],
}
