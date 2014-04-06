require.config({
    baseUrl: 'js',
    paths: {
        'jquery': ['//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.0/jquery', jsPaths['scripts/jquery']],
        'backbone': ['//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.0/backbone-min', jsPaths['scripts/backbone']],
        'underscore': ['//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.3/underscore-min', jsPaths['scripts/underscore']],
        'react': ['//cdnjs.cloudflare.com/ajax/libs/react/0.10.0/react', jsPaths['scripts/react']],
        'fastclick': ['//cdnjs.cloudflare.com/ajax/libs/fastclick/1.0.0/fastclick.min', jsPaths['scripts/fastclick']],
        'modernizr': ['//cdnjs.cloudflare.com/ajax/libs/modernizr/2.7.1/modernizr.min', jsPaths['scripts/modernizr']],
        'foundation': ['//cdnjs.cloudflare.com/ajax/libs/foundation/5.2.1/js/foundation.min', jsPaths['scripts/foundation']],
        'idle': [jsPaths['scripts/idle']]
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

    // Auth setup, if not doesn't set request header token if not logged in
    $.ajaxSetup({
        beforeSend: function (request) {
            if(profile.getToken() != null) {
                request.setRequestHeader("Authorization", profile.getToken());
            }
        }
    });

    // setup default routes
    router.setDefaultRoute((profile.getToken() != null) ? 'wallets':'landing');

    profile.on("change:logged_in", function() {
        router.setDefaultRoute((profile.getToken() != null) ? 'wallets':'landing');
        router.navigate(router.defaultRoute, {trigger: true});
    });

    // auth idling and timing functions
    profile.on("change:logged_in", function() {
        if (profile.getToken() == null) clearTimeout(idleTimer);
    });

    // reset the logout timer if we aren't already logged out.
    var awayCallback = function(){
        console.log(new Date().toTimeString() + ": away");
        if (profile.getToken() != null) resetTimer();
    };

    // stop logout timer when we return from idle.
    var awayBackCallback = function(){
        console.log(new Date().toTimeString() + ": back");
        clearTimeout(idleTimer);
    };

    // no good use for this yet
    var visible = function(){
        console.log(new Date().toTimeString() + ": now looking at page");
    };

    // no good use for this yet
    var hidden = function(){
        console.log(new Date().toTimeString() + ": not looking at page");
    };

    var timer = new Idle();
    timer.setAwayTimeout(60000); // change this for longer idle time
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
    function resetTimer(){
        var timeout = 5000;
        console.log("Logging out in " + timeout + "ms");
        clearTimeout(idleTimer);
        idleTimer = setTimeout(whenUserIdle, timeout);
    }

    function whenUserIdle(){
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
        $("#expand-btn").on("click", function(){
            $("#sidebar").toggleClass("expanded")
        });
    });
});
