var DEBUG = DEBUG___VALUE,
    AUTOSTART_COUNTDOWN = !DEBUG,
    AUTOSTART_CAROUSEL = !DEBUG,
    AUTOSTART_VIDEO_BG = !DEBUG;

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
        }, function (err, t) {
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

            animateMapLoading();
            loadPopoverMap(t);
        });

    }

})($);

(function initCarousel($) {

    $('#carousel').flickity({
        autoPlay: AUTOSTART_CAROUSEL,
        imagesLoaded: true,
        percentPosition: false,
        setGallerySize: false
    });

})($);

(function responsiveFlipClock($) {

    var oneDay = 24 * 60 * 60 * 1000,
        weddingDate = new Date(2017, 6, 1, 16, 0, 0),
        todayDate = new Date(),
        diffDays = Math.round(Math.abs((weddingDate.getTime() - todayDate.getTime()) / (oneDay)));

    $('#countdown-full').FlipClock(
        weddingDate.getTime() / 1000 - todayDate.getTime() / 1000,
        {
            autoStart: AUTOSTART_COUNTDOWN,
            clockFace: 'DailyCounter',
            countdown: true
        }
    );

    var $countdownDay = $('#countdown-day');
    $countdownDay.FlipClock(
        diffDays,
        {
            autoStart: AUTOSTART_COUNTDOWN,
            clockFace: 'Counter',
            countdown: false,
            callbacks: {
                create: function () {
                    setTimeout(function () {
                        $('<span class="flip-clock-divider days"><span class="flip-clock-label">Days</span></span>')
                            .hide()
                            .prependTo($countdownDay)
                            .fadeIn("slow");
                    }, 1000);
                }
            }
        }
    );

})($);

(function animateNav($) {

    $('nav').find('.navbar-nav').find('a').click(function () {
        var hrefValue = $.attr(this, 'href'),
            splitAnchor = hrefValue.split('#');

        if (isSamePage(hrefValue) && anchorExists(splitAnchor)) {
            animateToOffset(splitAnchor[1]);
            return false;
        }
        return true;
    });

    function isSamePage(hrefValue) {
        var path = hrefValue.split('.html')[0];
        return window.location.pathname.indexOf(path) !== -1;
    }

    function anchorExists(splitAnchor) {
        return splitAnchor.length == 2;
    }

    function animateToOffset(anchor) {
        $('html, body').animate({
            scrollTop: anchor === "top" ? 0 : $('#' + anchor).offset().top
        }, 500);
    }

})($);

(function videoBackgroundAutoplay($) {
    var $window = $(window),
        width = $window.width(),
        $video = $('#video-bg');

    if ($video && width >= 768) {
        $video.attr('autoplay', AUTOSTART_VIDEO_BG);
    }
})($);

function animateMapLoading() {
    var $loadingMap = $('#loading-map'),
        howMany = 0;

    function addDot() {
        $loadingMap.text($loadingMap.text() + ".");
        howMany += 1;

        if (howMany > 3) {
            var value = $loadingMap.text();
            $loadingMap.text($loadingMap.text().substr(0, value.length - 4));
            howMany = 0;
        }

        setTimeout(addDot, 1000);
    }

    addDot();
}

function loadPopoverMap(translationFunction) {

    var $menu = $('#menu-popover'),
        $fullscreen = $('#fullscreen-popover'),
        cookiePopoverShownKey = 'popoverAlreadyShown',
        popoverAlreadyShown = Cookies.get(cookiePopoverShownKey);

    if ($menu && $fullscreen) {
        var menuPopover = $menu.popover({
            placement: 'top',
            title: '',
            content: translationFunction('map.tooltip.menu')
        });

        var fullscreenPopover = $fullscreen.popover({
            placement: 'top',
            title: '',
            content: translationFunction('map.tooltip.fullscreen')
        });

        function hide() {
            setTimeout(function () {
                menuPopover.popover('hide');
                fullscreenPopover.popover('hide');
            }, 8000)
        }

        function show() {
            setTimeout(function () {
                Cookies.set(cookiePopoverShownKey, 1, {expires: 14});
                menuPopover.popover('show');
                fullscreenPopover.popover('show');

                hide();
            }, 3000);
        }


        if (!popoverAlreadyShown || popoverAlreadyShown !== "1") {
            show();
        }
    }
}