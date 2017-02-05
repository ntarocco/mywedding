var HomePage = (function ($) {
    var id = '#page-home';

    var VideoBkg = (function () {
        var $window = $(window),
            width = $window.width(),
            $videoBkg = $('#video-bg');

        function start() {
            if ($videoBkg.length && width >= 768 && SHOULD_PLAY_ANIMATIONS) {
                $videoBkg.get(0).play();
            }
        }

        function stop() {
            if ($videoBkg.length && width >= 768) {
                $videoBkg.get(0).pause();
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
            fullFlipClock,
            dayFlipClock,
            oneDay = 24 * 60 * 60 * 1000,
            weddingDate = new Date(2017, 6, 1, 16, 0, 0),
            todayDate = new Date(),
            diffDays = Math.round(Math.abs((weddingDate.getTime() - todayDate.getTime()) / (oneDay)));

        fullFlipClock = $countdownFull.FlipClock(
            weddingDate.getTime() / 1000 - todayDate.getTime() / 1000,
            {
                autoStart: SHOULD_PLAY_ANIMATIONS,
                clockFace: 'DailyCounter',
                countdown: true,
                onStart: function () {
                    console.log("Full FlipClock onStart");
                },
                onStop: function () {
                    console.log("Full FlipClock onStop");
                }
            }
        );

        dayFlipClock = $countdownDay.FlipClock(
            diffDays,
            {
                autoStart: false,
                clockFace: 'Counter',
                countdown: true,
                callbacks: {
                    create: function () {
                        setTimeout(function () {
                            $('<span class="flip-clock-divider days"><span class="flip-clock-label">Days</span></span>')
                                .hide()
                                .prependTo($countdownDay)
                                .fadeIn("slow");
                        }, 1000);
                    }
                },
                onStart: function () {
                    console.log("Day FlipClock onStart");
                },
                onStop: function () {
                    console.log("Day FlipClock onStop");
                }
            }
        );

        function start() {
            if (SHOULD_PLAY_ANIMATIONS) {
                fullFlipClock.start();
            }
        }

        function stop() {
            fullFlipClock.stop();
        }

        return {
            start: start,
            stop: stop
        }
    })();

    var Carousel = (function () {

        var carousel = new Flickity('#carousel', {
            autoPlay: SHOULD_PLAY_ANIMATIONS,
            pauseAutoPlayOnHover: false,
            imagesLoaded: true,
            percentPosition: false,
            setGallerySize: false
        });

        function start() {
            carousel.playPlayer();
        }

        function stop() {
            carousel.stopPlayer();
        }

        return {
            start: start,
            stop: stop
        }

    })();

    var Trip = (function () {

        var $trip = $('#trip'),
            $dashedLineSvg = $trip.find('.dashed-line'),
            $earth = $trip.find('.earth'),
            dashedLineSvg = $dashedLineSvg.get(0),
            pathDashedLineSvg = $dashedLineSvg.find('path').get(0),
            earthSize = {x: $earth[0].naturalWidth, y: $earth[0].naturalHeight},
            geneva = {x: 330, y: 160},
            bali = {x: 1460, y: 770};

        function resizeSvg() {
            var containerWidth = $trip.width(),
                containerHeight = $trip.height(),
                pathTop = Math.round(geneva.y * containerHeight / earthSize.y),
                pathLeft = Math.round(geneva.x * containerWidth / earthSize.x),
                pathBottom = Math.round(bali.y * containerHeight / earthSize.y),
                pathRight = Math.round(bali.x * containerWidth / earthSize.x),
                pathWidth = pathRight - pathLeft,
                pathHeight = pathBottom - pathTop;

            $dashedLineSvg.css('top', pathTop);
            $dashedLineSvg.css('left', pathLeft);
            dashedLineSvg.setAttribute('width', pathWidth + 'px');
            dashedLineSvg.setAttribute('height', pathHeight + 'px');

            var pathDashedLineSvgLength = Math.round(pathDashedLineSvg.getTotalLength());
            // Clear any previous transition
            dashedLineSvg.style.transition = dashedLineSvg.style.WebkitTransition = 'none';
            dashedLineSvg.style.strokeDasharray = pathDashedLineSvgLength + ' ' + pathDashedLineSvgLength;
            dashedLineSvg.style.strokeDashoffset = pathDashedLineSvgLength;
            // Trigger a layout so styles are calculated & the browser picks up the starting position before animating
            dashedLineSvg.getBoundingClientRect();

            setModalMaxHeight(containerHeight);
        }

        $(window).bind('resizeEnd', function () {
            resizeSvg();
        });

        resizeSvg();

        function setModalMaxHeight(maxHeight) {
            $trip.find('.modal').css('max-height', (maxHeight - 50) + 'px');
        }

        function openModal() {
            var $modal = $trip.find('.modal');

            if (!$modal.is(':visible')) {
                $modal.on('shown.bs.modal', function (e) {
                    // append modal background to the right container
                    $('.modal-backdrop').appendTo($trip);
                    // removing body classes to enable click events
                    $('body').removeClass();
                }).modal({
                    backdrop: 'static'
                });

                $modal.css('max-height', $trip.height() * 0.9);
                $modal.find('.modal-body').css('max-height', $trip.height() * 0.8);
            }
        }

        function startSvgAnimation() {
            $dashedLineSvg
                .addClass('dashed-line-animation')
                .one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function () {
                    openModal();
                });
        }

        function onInView() {
            $trip.on('inview', function (event, isInView) {
                if (isInView) {
                    startSvgAnimation();
                }
            });
        }

        function offInView() {
            $trip.off('inview');
        }

        return {
            start: onInView,
            stop: offInView
        }

    })();

    function start() {
        VideoBkg.start();
        Countdowns.start();
        Carousel.start();
        Trip.start();
    }

    function stop() {
        VideoBkg.stop();
        Countdowns.stop();
        Carousel.stop();
        Trip.stop();
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

var VisitPage = (function () {
    var id = '#page-visit';

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
        mapsAlreadyLoaded = false,
        iframe = '<iframe id="map" src="https://www.google.com/maps/d/embed?mid=13Ps-1AMEFv7h6VeEg5DklpLfdmg" allowfullscreen></iframe>';

    function loadPopoverMap(translationFn) {

        var $menu = $id.find('.menu-popover'),
            $fullscreen = $id.find('.fullscreen-popover'),
            cookiePopoverShownKey = 'popoverAlreadyShown',
            popoverAlreadyShown = Cookies.get(cookiePopoverShownKey);

        if ($menu.length && $fullscreen.length) {
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

    return {
        id: id,
        start: function () {
            if (!mapsAlreadyLoaded) {
                loadPopoverMap(translationFn);
                animateLoadingText($loadingLabel);

                $id.append(iframe);
                mapsAlreadyLoaded = true;
            }
        },
        stop: function () {
        }
    }

});

var RsvpPage = (function ($) {
    var id = '#page-rsvp',
        $id = $(id),
        $loadingLabel = $id.find('.loading-rsvp'),
        currentIframe,
        iframeIt = '<iframe id="iframe-rsvp" src="https://docs.google.com/forms/d/e/1FAIpQLSdh64EMQAYw0r8_mtEGTxW2lzm3lMxyJSk2Oz9qG4QW0Tbr4Q/viewform?embedded=true" width="760" height="500" frameborder="0" marginheight="0" marginwidth="0"></iframe>',
        iframeFr = '<iframe id="iframe-rsvp" src="https://docs.google.com/forms/d/e/1FAIpQLSf2G-jXQu4kTiyYPaRrmQpG9qwkrWfN2LHutCesUHAujWuDUg/viewform?embedded=true" width="760" height="500" frameborder="0" marginheight="0" marginwidth="0"></iframe>';

    animateLoadingText($loadingLabel);

    function replaceIframe(language) {
        var currentLng = Cookies.get(COOKIE_LANG_KEY);

        if (currentIframe != currentLng) {
            $('#iframe-rsvp').first().remove();
            var iframe = language == 'it' ? iframeIt : iframeFr;
            $id.append(iframe);
            currentIframe = currentLng;
        }
    }

    function onLanguageChanged(e) {
        replaceIframe(e.detail);
    }

    function start() {
        var currentLng = Cookies.get(COOKIE_LANG_KEY);
        replaceIframe(currentLng);
        document.addEventListener(EVENT_NAME, onLanguageChanged);
    }

    function stop() {
        document.removeEventListener(EVENT_NAME, onLanguageChanged);
    }

    return {
        id: id,
        start: start,
        stop: stop
    }

});