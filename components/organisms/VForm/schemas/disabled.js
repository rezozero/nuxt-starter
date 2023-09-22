export default {
    title: 'formulaire_de_contact_mecenat',
    type: 'object',
    properties: {
        nom: {
            type: 'string',
            title: 'Nom',
        },
        message: {
            type: 'string',
            title: 'Message',
            widget: 'textarea',
        },
        oui_je_souhaite_recevoir_de_l_information_de_l_opera_de_lyon: {
            type: 'boolean',
            title: 'Oui, je souhaite recevoir de l’information de l’Opéra de Lyon !',
            attr: {
                'data-group': null,
                placeholder: null,
            },
            widget: 'checkbox',
            propertyOrder: 9,
        },
        choix_simple: {
            enum: ['Lorem', 'Ipsum', 'Dolor'],
            enum_titles: ['Lorem', 'Ipsum', 'Dolor'],
            options: {
                enum_titles: ['Lorem', 'Ipsum', 'Dolor'],
            },
            type: 'string',
            title: 'Choix simple',
            attr: {
                'data-group': null,
                placeholder: 'Choisir',
            },
            propertyOrder: 10,
        },
    },
    required: ['nom', 'message'],
}
