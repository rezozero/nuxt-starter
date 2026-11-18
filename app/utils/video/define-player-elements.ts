// Video.js registers its custom elements as an import side effect. The players import this
// module on mount, client side only, so nothing is loaded until a media actually shows up.
import '@videojs/html/video/player'
import '@videojs/html/audio/player'
import '@videojs/html/ui/container'
import '@videojs/html/ui/controls'
import '@videojs/html/ui/controls-content'
import '@videojs/html/ui/controls-group'
import '@videojs/html/ui/play-button'
import '@videojs/html/ui/mute-button'
import '@videojs/html/ui/fullscreen-button'
import '@videojs/html/ui/time'
import '@videojs/html/ui/time-slider'
import '@videojs/html/ui/volume-slider'
import '@videojs/html/ui/slider-track'
import '@videojs/html/ui/slider-buffer'
import '@videojs/html/ui/slider-fill'
import '@videojs/html/ui/slider-thumb'
import '@videojs/html/ui/hotkey'
import '@videojs/html/ui/gesture'
// `<media-i18n>` follows `<html lang>`: English is built in, any other pack is fetched on
// connection. French, the starter's default locale (`I18N_DEFAULT_LOCALE`), is registered up front
// so that the labels read by screen readers never start in English (RGAA 4.11). Register the
// default locale of the project here if it differs.
import '@videojs/html/i18n'
import '@videojs/html/i18n/locales/fr/register'
