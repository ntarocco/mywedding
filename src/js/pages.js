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
                onStart: function() {
                    console.log("Full FlipClock onStart");
                },
                onStop: function() {
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
                onStart: function() {
                    console.log("Day FlipClock onStart");
                },
                onStop: function() {
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

        var $trip = $('#trip');

        function fixSvgSize() {
            var $earth = $trip.find('.earth'),
                $dashedLineSvg = $trip.find('.dashed-line'),
                dashedLineSvg = $dashedLineSvg.get(0),
                pathDashedLineSvg = $dashedLineSvg.find('path').get(0),
                earthSize = { x: $earth[0].naturalWidth, y: $earth[0].naturalHeight },
                geneva = { x: 330, y: 160 },
                bali = { x: 1460, y: 770 };

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

                var pathDashedLineSvgLength = pathDashedLineSvg.getTotalLength();
                $dashedLineSvg.css('stroke-dasharray', pathDashedLineSvgLength);
                $dashedLineSvg.css('stroke-dashoffset', pathDashedLineSvgLength);

                setModalMaxHeight(containerHeight);
            }

            $(window).bind('resizeEnd', function() {
                resizeSvg();
            });

            resizeSvg();
        }

        function setModalMaxHeight(maxHeight) {
            $trip.find('.modal').css('max-height', (maxHeight - 50) + 'px');
        }

        function openModal() {
            var $modal = $trip.find('.modal');
            $modal.on('shown.bs.modal', function (e) {
                // append modal background to the right container
                $('.modal-backdrop').appendTo($trip);
                // removing body classes to enable click events
                $('body').removeClass();
            }).modal();

            $modal.css('max-height', $trip.height() * 0.9);
            $modal.find('.modal-body').css('max-height', $trip.height() * 0.8);
        }

        function addSvg() {
            var $path = '<svg class="dashed-line" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none" viewBox="0 0 279.65 150.88">' +
                '<defs><style>.cls-1{fill:none;stroke:#f25353;stroke-linecap:round;stroke-linejoin:round;stroke-width:2px;}</style></defs>' +
                '<path class="cls-1" d="M1.18,1.36A125.54,125.54,0,0,0,9.71,42.85c3.42,8.71,7.45,18.88,16.77,29.27,5.7,6.36,13.6,15.17,27.28,19.32,14.16,4.3,30.68,2.44,38.93-3.69,2.07-1.54,8.9-7.27,13.64-11.37,1.42-1.23,2.37-2.06,3.54-3.16a90.06,90.06,0,0,0,9.53-10.48c4.69-6.07,5.62-9,6-10.23,0.61-2.22,2.21-8-.85-13.93a16.94,16.94,0,0,0-10.23-8.53,16.49,16.49,0,0,0-15.35,3.69,15.83,15.83,0,0,0-3.69,5.12,13.33,13.33,0,0,0-3.41-5.68c-5-4.82-12-3.6-13.07-3.41C72.29,31,67.68,36.2,66,41.43,64.17,47,65.9,51.9,66.83,54.5c1.43,4,3.81,6.81,8.53,12.22A115.58,115.58,0,0,0,86.44,77.81,197.07,197.07,0,0,0,105.19,92.3c8.57,5.76,16.26,10.93,27.28,15.06,7.34,2.75,22.19,8.13,40.64,5.68,5.43-.72,13.92-1.93,22.45-7.39a81.64,81.64,0,0,0,10.52-8.53c6-5.47,7.72-8.26,8.53-9.66,1.83-3.2,3.64-6.36,3.13-10.52-0.11-.93-1-7-6.25-9.38-0.33-.15-5.71-2.47-9.95.85a9.58,9.58,0,0,0-3.41,6.25A9.82,9.82,0,0,0,193.86,69a10.16,10.16,0,0,0-8.53-.57,11.29,11.29,0,0,0-6.25,5.4,11.69,11.69,0,0,0-.85,7.67c0.16,0.89.78,3.72,4.55,8.24,2.56,3.07,5.6,5.73,11.08,9.38a80.62,80.62,0,0,0,13.36,7.67,62.28,62.28,0,0,0,15.91,4.83c12,1.81,14.1-2.18,23-.57,10.5,1.89,17.34,9.18,20.46,12.5a47.23,47.23,0,0,1,12.22,26.68" transform="translate(-0.18 -0.36)"></path>' +
                '</svg>';

            $trip.append($path);

            $trip.find('.dashed-line').one("animationend webkitAnimationEnd oAnimationEnd MSAnimationEnd", function(){
                openModal();
            });

            fixSvgSize();
        }

        function onInView() {
            $trip.on('inview', function(event, isInView) {
                if (isInView && !$trip.find('.dashed-line').length) {
                    addSvg();
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