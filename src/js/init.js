var DEBUG = DEBUG___VALUE,
    SHOULD_PLAY_ANIMATIONS = !DEBUG;

(function initLanguage() {
    var cookieLangKey = 'language',
        cookieLangValue = Cookies.get(cookieLangKey);

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

        Cookies.set(cookieLangKey, lang);

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
                    Cookies.set(cookieLangKey, 'it');
                    $body.localize();
                });
            });

            $('#changeLanguageFr').click(function () {
                i18next.changeLanguage('fr', function (err, t) {
                    Cookies.set(cookieLangKey, 'fr');
                    $body.localize();
                });
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