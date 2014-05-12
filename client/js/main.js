var cdnRoot = '//cdnjs.cloudflare.com/ajax/libs/';
require.config({
    baseUrl: 'js',
    paths: {
        'jquery': [cdnRoot + 'jquery/2.1.0/jquery.min', 'vendor/jquery'],
        'backbone': [cdnRoot + 'backbone.js/1.1.0/backbone-min', 'vendor/backbone'],
        'underscore': [cdnRoot + 'underscore.js/1.4.3/underscore-min', 'vendor/underscore'],
        'react': [cdnRoot + 'react/0.10.0/react', 'vendor/react'],
        'fastclick': [cdnRoot + 'fastclick/1.0.0/fastclick.min', 'vendor/fastclick'],
        'modernizr': [cdnRoot + 'modernizr/2.7.1/modernizr.min', 'vendor/modernizr'],
        'foundation': [cdnRoot + 'foundation/5.2.1/js/foundation.min', 'vendor/foundation'],
        'idle': ['vendor/idle'],
        'md5': ['scripts/md5']
    },
    shim: {
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        underscore: {
            exports: '_'
        },
        foundation: {
            deps: ['jquery']
        }
    }
});

require(['jquery', 'react', 'components/application', 'router',
    'models/profile', 'fastclick', 'modernizr', 'idle',
    "models/notification"],
function($, React, Application, router, profile, fastclick,
    modernizr, idle, notification) {

    var authToken = (profile.isLoggedIn()) ? "token " + profile.getToken() : null;
    var loggedInRoute = 'all';
    var loggedOutRoute = 'landing';

    // on page load setup default route
    var defaultRoute = (profile.isLoggedIn()) ? loggedInRoute : loggedOutRoute;
    router.setDefaultRoute(defaultRoute);

    // on page load setup request header auth token
    if (profile.isLoggedIn()) {
        $.ajaxSetup({
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", authToken);
            }
        });
    }

    // auth event handler
    profile.on("change:logged_in", function() {
        authToken = (profile.isLoggedIn()) ? "token " + profile.getToken() : null;
        // change stuff when logged in
        if (profile.isLoggedIn()) {
            // ad auth heading
            $.ajaxSetup({
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", authToken);
                }
            });
            defaultRoute = loggedInRoute;
        // change stuff when logged out
        } else {
            // remove auth heading
            $.ajaxSetup({
                beforeSend: function (request) {
                }
            });
            clearTimeout(idleTimer);
            defaultRoute = loggedOutRoute;
        }
        router.setDefaultRoute(defaultRoute);
        router.navigate(router.defaultRoute, {trigger: true});
    });

    // reset the logout timer if we aren't already logged out.
    function awayCallback() {
        console.log(new Date().toTimeString() + ": away");
        if (profile.isLoggedIn()) resetTimer();
    }

    // stop logout timer when we return from idle.
    function awayBackCallback() {
        console.log(new Date().toTimeString() + ": back");
        clearTimeout(idleTimer);
    }

    // no good use for this yet
    function visible() {
        console.log(new Date().toTimeString() + ": now looking at page");
    }

    // no good use for this yet
    function hidden() {
        console.log(new Date().toTimeString() + ": not looking at page");
    }

    var timer = new Idle();
    var idleTime = 10 * 60 * 1000;
    timer.setAwayTimeout(idleTime); // change this for longer idle time
    timer.onAway = awayCallback;
    timer.onAwayBack = awayBackCallback;
    timer.onVisible = visible;
    timer.onHidden = hidden;
    timer.start();

    router.on("route", onPageRoute);

    function onPageRoute() {
        awayBackCallback();
        notification.clearNotification();
    }

    var idleTimer;
    function resetTimer() {
        var timeout = 5000;
        console.log("Logging out in " + timeout + "ms");
        clearTimeout(idleTimer);
        idleTimer = setTimeout(whenUserIdle, timeout);
    }

    function whenUserIdle() {
        console.log("Logging out " + profile.getUsername());
        profile.destroySession();
    }

    // Begin rendering the webapp with the main react component 'Application'
    $(document).ready(function() {
        var app = Application({router : router});
        React.renderComponent(app, document.getElementById('coink'));

        // Single page webapp routing made nice for browser navigation
        Backbone.history.start({
            pushState: false,
            root: "/"
        });

        // Handle responsive navigation for mobile
        $("#coink").on("click", "#expand-btn", function() {
            $("#sidebar").toggleClass("expanded");
        });

        $("#coink").on("click", "#sidebar.expanded a", function() {
            $("#sidebar").removeClass("expanded");
        });
    });
});
