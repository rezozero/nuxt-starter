export default {
    title: 'formulaire_de_contact_mecenat',
    type: 'object',
    properties: {
        nom: {
            type: 'string',
            title: 'Nom',
            attr: {
                'data-group': null,
                placeholder: null,
            },
            propertyOrder: 1,
        },
        prenom: {
            type: 'string',
            title: 'Prénom',
            attr: {
                'data-group': null,
                placeholder: null,
            },
            propertyOrder: 2,
        },
        adresse_e_mail: {
            type: 'string',
            title: 'Adresse e-mail',
            attr: {
                'data-group': null,
                placeholder: null,
            },
            widget: 'email',
            propertyOrder: 3,
        },
        ville: {
            type: 'string',
            title: 'Ville',
            attr: {
                'data-group': null,
                placeholder: null,
            },
            propertyOrder: 4,
        },
        zip_postal_code: {
            type: 'string',
            title: 'ZIP/Postal Code',
            attr: {
                'data-group': null,
                placeholder: null,
            },
            propertyOrder: 6,
        },
        votre_demande_concerne: {
            items: {
                type: 'string',
                enum: ["Un événement d'entreprise", 'Le mécénat', "La soirée de Gala de l'Opéra de Lyon", 'Autre'],
                enum_titles: [
                    "Un événement d'entreprise",
                    'Le mécénat',
                    "La soirée de Gala de l'Opéra de Lyon",
                    'Autre',
                ],
                options: {
                    enum_titles: [
                        "Un événement d'entreprise",
                        'Le mécénat',
                        "La soirée de Gala de l'Opéra de Lyon",
                        'Autre',
                    ],
                },
            },
            minItems: 0,
            uniqueItems: true,
            type: 'array',
            title: 'Votre demande concerne',
            attr: {
                'data-group': null,
                placeholder: null,
            },
            propertyOrder: 7,
        },
        message: {
            type: 'string',
            title: 'Message',
            attr: {
                'data-group': null,
                placeholder: null,
            },
            widget: 'textarea',
            propertyOrder: 8,
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
    required: ['nom', 'prenom', 'zip_postal_code', 'message'],
}
