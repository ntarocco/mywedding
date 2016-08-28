var DEBUG = false,
    AUTOSTART_COUNTDOWN = !DEBUG,
    AUTOSTART_CAROUSEL = !DEBUG,
    AUTOSTART_VIDEO_BG = !DEBUG;

var i18nextInstance = i18next
    .init({
        debug: DEBUG,
        fallbackLng: false,
        lng: 'fr',
        resources: {
            fr: {
                translation: translationFr
            },
            it: {
                translation: translationIt
            }
        }
    }, function (err, t) {
    });


(function ($) {

    jqueryI18next.init(i18nextInstance, $, {
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
        i18nextInstance.changeLanguage('it', function (err, t) {
            $body.localize();
        });
    });

    $('#changeLanguageFr').click(function () {
        i18nextInstance.changeLanguage('fr', function (err, t) {
            $body.localize();
        });
    });

    $body.localize();

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
        diffDays = Math.round(Math.abs((weddingDate.getTime() - todayDate.getTime())/(oneDay)));

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
                    setTimeout(function() {
                        $('<span class="flip-clock-divider days"><span class="flip-clock-label">Days</span></span>')
                            .hide()
                            .prependTo($countdownDay)
                            .fadeIn("slow");
                    }, 1000);
                }
            }
        }
    );

}) ($);

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
}) ($);