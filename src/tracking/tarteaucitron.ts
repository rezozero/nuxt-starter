export interface TarteaucitronConfigOptions {
    policyUrl?: string
    googleAnalytics?: string
    matomoSiteId?: string
    matomoUrl?: string
}

/*
 * This method initialize TAC directly on your website. If you need to use
 * Google Tag Manager, you should move this configuration to an external GTM tag.
 *
 * Override this method if you need to adjust configuration: such multi-domains cookie
 * or exotic trackers, etc
 */
export function createTarteaucitronConfig(options: TarteaucitronConfigOptions): string {
    let script = `
        tarteaucitron.init({
    	  "privacyUrl": "${options.policyUrl}",
          "bodyPosition": "bottom",
    	  "hashtag": "#cookie_consent",
    	  "cookieName": "cookie_consent",
    	  "orientation": "bottom",
          "groupServices": false,
          "serviceDefaultState": "wait",
    	  "showAlertSmall": false,
    	  "cookieslist": false,
          "closePopup": false,
          "showIcon": false,
          "iconPosition": "BottomRight",
    	  "adblocker": false,
          "DenyAllCta" : true,
          "AcceptAllCta" : true,
          "highPrivacy": true,
    	  "handleBrowserDNTRequest": false,
    	  "removeCredit": true,
    	  "moreInfoLink": false,
          "useExternalCss": true, /* Use _tarteaucitron.scss */
          "useExternalJs": false,
          "readmoreLink": "",
          "mandatory": true,
          "mandatoryCta": true
        });
    `

    /*
     * Google Analytics (universal)
     */
    if (options.googleAnalytics && options.googleAnalytics.startsWith('UA-')) {
        script += `

        tarteaucitron.user.analyticsUa = '${options.googleAnalytics}';
        tarteaucitron.user.analyticsAnonymizeIp = true;
        (tarteaucitron.job = tarteaucitron.job || []).push('analytics');
        `
    }

    /*
     * Google Analytics (GA4)
     */
    if (options.googleAnalytics && options.googleAnalytics.startsWith('G-')) {
        script += `

        tarteaucitron.user.gtagUa = '${options.googleAnalytics}';
        (tarteaucitron.job = tarteaucitron.job || []).push('gtag');
        `
    }

    if (options.matomoSiteId && options.matomoUrl) {
        script += `

        tarteaucitron.user.matomoId = '${options.matomoSiteId}';
        tarteaucitron.user.matomoHost = '${options.matomoUrl}';
        (tarteaucitron.job = tarteaucitron.job || []).push('matomo');
        `
    }

    return script
}
