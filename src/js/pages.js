var HomePage = (function ($) {
    var id = '#page-home';

    var VideoBkg = (function () {
        var $window = $(window),
            width = $window.width(),
            $videoBkg = $('#video-bg');

        function start() {
            if ($videoBkg && width >= 768) {
                $videoBkg.attr('autoplay', SHOULD_PLAY_ANIMATIONS);
            }
        }

        start();

        function stop() {
            if ($videoBkg) {
                $videoBkg.stop();
            }
        }

        return {
            start: start,
            stop: stop
        }
    })();

    var Countdowns = (function () {

        var $countdownFull = $('#countdown-full'),
            $countdownDay = $('#countdown-day'),
            oneDay = 24 * 60 * 60 * 1000,
            weddingDate = new Date(2017, 6, 1, 16, 0, 0),
            todayDate = new Date(),
            diffDays = Math.round(Math.abs((weddingDate.getTime() - todayDate.getTime()) / (oneDay)));

        $countdownFull.FlipClock(
            weddingDate.getTime() / 1000 - todayDate.getTime() / 1000,
            {
                autoStart: SHOULD_PLAY_ANIMATIONS,
                clockFace: 'DailyCounter',
                countdown: true
            }
        );

        $countdownDay.FlipClock(
            diffDays,
            {
                autoStart: SHOULD_PLAY_ANIMATIONS,
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

        function start() {
            if (SHOULD_PLAY_ANIMATIONS) {
                // $countdownFull.play();
                // $countdownDay.play();
            }
        }

        function stop() {
            if (SHOULD_PLAY_ANIMATIONS) {
                // $countdownFull.play();
                // $countdownDay.play();
            }
        }

        return {
            start: start,
            stop: stop
        }
    })();

    var Carousel = (function () {

        var $carousel = $('#carousel');

        $carousel.flickity({
            autoPlay: false,
            imagesLoaded: true,
            percentPosition: false,
            setGallerySize: false
        });

        function start() {
            // $carousel.start();
        }

        function stop() {
            // $carousel.stop();
        }

        return {
            start: start,
            stop: stop
        }

    })();

    function start() {
        VideoBkg.start();
        Countdowns.start();
        Carousel.start();
    }

    function stop() {
        VideoBkg.stop();
        Countdowns.stop();
        Carousel.stop();
    }

    return {
        id: id,
        start: start,
        stop: stop
    }

});

var AccessPage = (function () {
    var id = '#page-access';

    return {
        id: id,
        start: function () {
        },
        stop: function () {
        }
    }

});

var AccomodationPage = (function () {
    var id = '#page-accommodation';

    return {
        id: id,
        start: function () {
        },
        stop: function () {
        }
    }

});

var MapPage = (function ($, Cookies, translationFn) {
    var id = '#page-map',
        $id = $(id),
        $loadingLabel = $id.find('.loading-map'),
        iframe = '<iframe id="map" src="https://www.google.com/maps/d/embed?mid=13Ps-1AMEFv7h6VeEg5DklpLfdmg" allowfullscreen></iframe>';

    function loadPopoverMap(translationFn) {

        var $menu = $('#menu-popover'),
            $fullscreen = $('#fullscreen-popover'),
            cookiePopoverShownKey = 'popoverAlreadyShown',
            popoverAlreadyShown = Cookies.get(cookiePopoverShownKey);

        if ($menu && $fullscreen) {
            var menuPopover = $menu.popover({
                placement: 'top',
                title: '',
                content: translationFn('map.tooltip.menu')
            });

            var fullscreenPopover = $fullscreen.popover({
                placement: 'top',
                title: '',
                content: translationFn('map.tooltip.fullscreen')
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

    $id.append(iframe);
    loadPopoverMap(translationFn);
    animateLoadingText($loadingLabel);

    return {
        id: id,
        start: function () {
        },
        stop: function () {
        }
    }

});

var RsvpPage = (function ($) {
    var id = '#page-rsvp',
        $id = $(id),
        iframe = '<iframe id="rsvp" src="https://docs.google.com/forms/d/e/1FAIpQLSdh64EMQAYw0r8_mtEGTxW2lzm3lMxyJSk2Oz9qG4QW0Tbr4Q/viewform?embedded=true" width="760" height="500" frameborder="0" marginheight="0" marginwidth="0"></iframe>';

    $id.append(iframe);

    return {
        id: id,
        start: function () {
        },
        stop: function () {
        }
    }

});