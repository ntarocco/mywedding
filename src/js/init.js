var DEBUG = DEBUG___VALUE,
    SHOULD_PLAY_ANIMATIONS = !DEBUG,
    COOKIE_LANG_KEY = 'language',
    EVENT_NAME = 'languageChanged';

// CustomEvent Polyfill
(function () {
    if ( typeof window.CustomEvent === "function" ) return false;

    function CustomEvent ( event, params ) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent( 'CustomEvent' );
        evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
        return evt;
    }

    CustomEvent.prototype = window.Event.prototype;

    window.CustomEvent = CustomEvent;
})();

// debounce polyfill
$(window).resize(function() {
    if(this.resizeTO) clearTimeout(this.resizeTO);
    this.resizeTO = setTimeout(function() {
        $(this).trigger('resizeEnd');
    }, 300);
});

(function initLanguage() {
    var cookieLangValue = Cookies.get(COOKIE_LANG_KEY);

    if (!cookieLangValue) {
        getLanguageFromIPOrBrowser();
    } else {
        initI18Next(cookieLangValue);
    }

    function getLanguageFromIPOrBrowser() {

        $.getJSON('//freegeoip.net/json/?callback=?', function (result) {

            var country = '',
                lang;

            if (result && result.country_code) {
                country = result.country_code.toLowerCase();
            }

            if (country.indexOf('fr') !== -1) {
                lang = 'fr';
            } else if (country.indexOf('it') !== -1) {
                lang = 'it';
            }

            if (!lang) {
                initI18NextFromBrowserDetection();
            } else {
                initI18Next(lang);
            }
        })
            .fail(function () {
                initI18NextFromBrowserDetection();
            });
    }

    function getBrowserLangDetection() {
        var browserLanguage = navigator.languages ? navigator.languages[0] : (navigator.language || navigator.userLanguage);
        browserLanguage = browserLanguage.toLowerCase();

        if (browserLanguage.indexOf('fr') !== -1) {
            return 'fr';
        } else if (browserLanguage.indexOf('it') !== -1) {
            return 'it';
        }
    }

    function initI18NextFromBrowserDetection() {
        initI18Next(getBrowserLangDetection());
    }

    function initI18Next(lang) {

        if (!lang) {
            lang = 'fr';
        }

        Cookies.set(COOKIE_LANG_KEY, lang);

        i18next.init({
            debug: DEBUG,
            fallbackLng: false,
            lng: lang,
            resources: {
                fr: {
                    translation: translationFr
                },
                it: {
                    translation: translationIt
                }
            }
        }, function (err, translationFn) {

            jqueryI18next.init(i18next, $, {
                tName: 't', // --> appends $.t = i18next.t
                //i18nName: 'i18n', // --> appends $.i18n = i18next
                //handleName: 'localize', // --> appends $(selector).localize(opts);
                selectorAttr: 'data-i18n', // selector for translating elements
                targetAttr: 'i18n-target', // data-() attribute to grab target element to translate (if diffrent then itself)
                optionsAttr: 'i18n-options', // data-() attribute that contains options, will load/set if useOptionsAttr = true
                useOptionsAttr: false, // see optionsAttr
                parseDefaultValueFromContent: true // parses default values from content ele.val or ele.text
            });

            var $body = $('body');

            $('#changeLanguageIt').click(function () {
                i18next.changeLanguage('it', function (err, t) {
                    Cookies.set(COOKIE_LANG_KEY, 'it');
                    $body.localize();

                    var event = new CustomEvent(EVENT_NAME, { detail: 'it' });
                    document.dispatchEvent(event);
                });
                return false;
            });

            $('#changeLanguageFr').click(function () {
                i18next.changeLanguage('fr', function (err, t) {
                    Cookies.set(COOKIE_LANG_KEY, 'fr');
                    $body.localize();

                    var event = new CustomEvent(EVENT_NAME, { detail: 'fr' });
                    document.dispatchEvent(event);
                });
                return false;
            });

            $body.localize();

            Router.init(translationFn);
        });

    }

})($);

function animateLoadingText($element) {
    var howMany = 0;

    function addDot() {
        $element.text($element.text() + ".");
        howMany += 1;

        if (howMany > 3) {
            var value = $element.text();
            $element.text($element.text().substr(0, value.length - 4));
            howMany = 0;
        }

        setTimeout(addDot, 1000);
    }

    addDot();
}

(function toggleIEWarning($){
    function isIE() {
        if (/MSIE 10/i.test(navigator.userAgent)) {
            // This is internet explorer 10
            return true;
        }

        if (/MSIE 9/i.test(navigator.userAgent) || /rv:11.0/i.test(navigator.userAgent)) {
            // This is internet explorer 9 or 11
            return true;
        }

        if (/Edge\/\d./i.test(navigator.userAgent)){
            // This is Microsoft Edge
            return true;
        }

        return false;
    }

    if (isIE()) {
        $('#alert-ie').show();
    } else {
        $('#alert-ie').hide();
    }
})($);
