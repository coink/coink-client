var cdnRoot = '//cdnjs.cloudflare.com/ajax/libs/';
require.config({
    baseUrl: 'js',
    paths: {
        'jquery': [cdnRoot + '/jquery/2.1.0/jquery', '/js/scripts/jquery-min'],
        'backbone': [cdnRoot + '/backbone.js/1.1.0/backbone-min', '/js/scripts/backbone-min'],
        'underscore': [cdnRoot + '/underscore.js/1.4.3/underscore-min', '/js/scripts/underscore-min'],
        'react': [cdnRoot + '/react/0.10.0/react', '/js/scripts/react-min'],
        'fastclick': [cdnRoot + '/fastclick/1.0.0/fastclick.min', '/js/scripts/fastclick-min'],
        'modernizr': [cdnRoot + '/modernizr/2.7.1/modernizr.min', '/js/scripts/modernizr-min'],
        'foundation': [cdnRoot + '/foundation/5.2.1/js/foundation.min', '/js/scripts/foundation-min'],
        'idle': ['/js/scripts/idle-min']
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
        },

    }
});

require(['jquery', 'backbone', 'react', 'components/application', 'router',
    'models/profile', 'fastclick', 'modernizr', 'foundation', 'idle',
    "models/notification"],
function($, Backbone, React, Application, router, profile, fastclick,
    modernizr, foundation, idle, notification) {

    // setup default routes
    router.setDefaultRoute((profile.getToken() != null) ? 'wallets':'landing');

    // setup request header token if t logged in
    if(profile.getToken() != null) {
        $.ajaxSetup({
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", profile.getToken());
            }
        });
    }

    // auth idling and timing functions
    profile.on("change:logged_in", function() {
        if (profile.getToken() == null) clearTimeout(idleTimer);
    });

    // reset the logout timer if we aren't already logged out.
    function awayCallback() {
        console.log(new Date().toTimeString() + ": away");
        if (profile.getToken() != null) resetTimer();
    };

    // stop logout timer when we return from idle.
    function awayBackCallback() {
        console.log(new Date().toTimeString() + ": back");
        clearTimeout(idleTimer);
    };

    // no good use for this yet
    function visible() {
        console.log(new Date().toTimeString() + ": now looking at page");
    };

    // no good use for this yet
    function hidden() {
        console.log(new Date().toTimeString() + ": not looking at page");
    };

    var timer = new Idle();
    timer.setAwayTimeout(10 * 60 * 1000); // change this for longer idle time
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
        var app = Application();
        React.renderComponent(app, document.getElementById('coink'));

        // Single page webapp routing made nice for browser navigation
        Backbone.history.start({
            pushState: false, // False until compojure routing is figured out
            root: "/"
        });

        // Handle responsive navigation
        $("#expand-btn").on("click", function() {
            $("#sidebar").toggleClass("expanded")
        });
    });
});
