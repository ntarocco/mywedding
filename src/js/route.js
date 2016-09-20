// https://github.com/mtrpcic/pathjs/wiki/
var Router = (function ($, Cookies) {
    var currentVisiblePageId;

    function init(translationFn) {
        var $pages = [
                new HomePage($),
                new AccessPage(),
                new AccomodationPage(),
                new MapPage($, Cookies, translationFn),
                new RsvpPage($)
            ];

        currentVisiblePageId = $pages[0].id;

        Path.map("#/home").to(function () {
            togglePage($pages[0].id, function () {
                animateToOffset('top');
            });
        }).enter(function () {
            $pages[0].start();
        }).exit(function () {
            $pages[0].stop();
        });

        Path.map("#/info").to(function () {
            togglePage($pages[0].id, function () {
                animateToOffset('info');
            });
        }).enter(function () {
            $pages[0].start();
        }).exit(function () {
            $pages[0].stop();
        });

        Path.map("#/access").to(function () {
            togglePage($pages[1].id, function () {
                animateToOffset('top');
            });
        }).enter(function () {
            $pages[1].start();
        }).exit(function () {
            $pages[1].stop();
        });

        Path.map("#/accommodation").to(function () {
            togglePage($pages[2].id, function () {
                animateToOffset('top');
            });
        }).enter(function () {
            $pages[2].start();
        }).exit(function () {
            $pages[2].stop();
        });

        Path.map("#/map").to(function () {
            togglePage($pages[3].id, function () {
                animateToOffset('top');
            });
        }).enter(function () {
            $pages[3].start();
        }).exit(function () {
            $pages[3].stop();
        });

        Path.map("#/rsvp").to(function () {
            togglePage($pages[4].id, function () {
                animateToOffset('top');
            });
        }).enter(function () {
            $pages[4].start();
        }).exit(function () {
            $pages[4].stop();
        });

        Path.listen();
    }

    function togglePage(pageId, callback) {
        if (pageId === currentVisiblePageId) {
            if (callback && typeof callback == "function") {
                callback.apply(this);
            }
            return;
        }

        $(currentVisiblePageId).animate({width: 'toggle'}, 350, 'swing', function () {
            currentVisiblePageId = pageId;
            $(pageId).animate({width: 'toggle'}, 350, function () {
                if (callback && typeof callback == "function") {
                    callback.apply(this);
                }
            });
        });
    }

    function animateToOffset(anchor) {
        $('html, body').animate({
            scrollTop: anchor === "top" ? 0 : $('#' + anchor).offset().top
        }, 500);
    }

    return {
        init: init
    }

}) ($, Cookies);