import get from 'lodash/get'
import en from '~/assets/locales/orejime/en.json'
import fr from '~/assets/locales/orejime/fr.json'

interface Translations {
    [key: string]: any
}

const DEFAULT_LOCALE = 'fr'

const translationsDict: Translations = {
    fr,
    en,
}

function getTranslations(locale: string): Translations {
    return translationsDict[locale] || translationsDict[DEFAULT_LOCALE]
}

function createTrans(translations: Translations): Function {
    return function (key: string): string {
        return get(translations, key, key)
    }
}

/**
 * @deprecated Use tarteaucitron for better GDPR integration
 * @param locale
 * @param privacyPolicyUrl
 */
export function createOrejimeConfig(locale: string, privacyPolicyUrl: string): string {
    const translations = getTranslations(locale)
    const trans = createTrans(translations)

    return `window.orejimeConfig = {
        elementID: 'orejime',
        appElement: '#__nuxt',
        cookieName: 'orejime',
        cookieExpiresAfterDays: 365,
        privacyPolicy: '${privacyPolicyUrl}',
        default: true,
        mustConsent: false,
        implicitConsent: false,
        lang: '${locale}',
        translations: [],
        apps: [
            {
                name: 'google',
                title: '${trans('orejime.google.title')}',
                description: '${trans('orejime.google.description')}',
                cookies: ['_ga', '_gat', '_gid', '__utma', '__utmb', '__utmc', '__utmt', '__utmz'],
                purposes: ['analytics'],
                required: false,
                optOut: false,
                default: true,
                onlyOnce: true,
            },
            {
                name: 'internal',
                title: '${trans('orejime.internal.title')}',
                description: '${trans('orejime.internal.description')}',
                purposes: ['security', 'usepref'],
                required: true,
                cookie: ['roadiz_token', 'roadiz_remember_me', 'i18n_redirected', 'orejime'],
            },
        ],
    }

    window.orejimeConfig.translations['${locale}'] = {
        consentModal: {
            title: '${trans('orejime.consentModal.title')}',
            description: '${trans('orejime.consentModal.description')}',
            privacyPolicy: {
                name: '${trans('orejime.consentModal.privacyPolicy.name')}',
                text: '${trans('orejime.consentModal.privacyPolicy.text')}',
            },
        },
        consentNotice: {
            changeDescription: '${trans('orejime.consentNotice.changeDescription')}',
            description: '${trans('orejime.consentNotice.description')}',
            learnMore: '${trans('orejime.consentNotice.learnMore')}',
        },
        accept: '${trans('orejime.accept')}',
        acceptAll: '${trans('orejime.acceptAll')}',
        ok: '${trans('orejime.ok')}',
        save: '${trans('orejime.save')}',
        saveData: '${trans('orejime.saveData')}',
        decline: '${trans('orejime.decline')}',
        declineAll: '${trans('orejime.declineAll')}',
        close: '${trans('orejime.close')}',
        enabled: '${trans('orejime.enabled')}',
        disabled: '${trans('orejime.disabled')}',
        app: {
            optOut: {
                title: '${trans('orejime.app.optOut.title')}',
                description: '${trans('orejime.app.optOut.description')}',
            },
            required: {
                title: '${trans('orejime.app.required.title')}',
                description: '${trans('orejime.app.required.description')}',
            },
            purposes: '${trans('orejime.app.purposes')}',
            purpose: '${trans('orejime.app.purpose')}',
        },
        google: {
            title: '${trans('orejime.google.title')}',
            description: '${trans('orejime.google.description')}',
        },
        internal: {
            title: '${trans('orejime.internal.title')}',
            description: '${trans('orejime.internal.description')}',
        },
        poweredBy: '',
        newWindow: '${trans('orejime.newWindow')}',
        purposes: {
            analytics: '${trans('orejime.purposes.analytics')}',
            security: '${trans('orejime.purposes.security')}',
            usepref: '${trans('orejime.purposes.usepref')}',
        },
    }`
}
