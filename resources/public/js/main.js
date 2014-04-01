require.config({
    baseUrl: 'js',
    paths: {
        'jquery': ['//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.0/jquery', '/js/scripts/jquery-min'],
        'backbone': ['//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.0/backbone-min', '/js/scripts/backbone-min'],
        'underscore': ['//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.3/underscore-min', '/js/scripts/underscore-min'],
        'react': ['//cdnjs.cloudflare.com/ajax/libs/react/0.10.0/react', '/js/scripts/react-min'],
        'fastclick': ['//cdnjs.cloudflare.com/ajax/libs/fastclick/1.0.0/fastclick.min', '/js/scripts/fastclick-min'],
        'modernizr': ['//cdnjs.cloudflare.com/ajax/libs/modernizr/2.7.1/modernizr.min', '/js/scripts/modernizr-min'],
        'foundation': ['//cdnjs.cloudflare.com/ajax/libs/foundation/5.2.1/js/foundation.min', '/js/scripts/foundation-min'],

        'jquery.cookie': '/js/scripts/jquery.cookie-min'
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
        'models/profile', 'fastclick', 'modernizr', 'foundation'],
function($, Backbone, React, Application, router, profile, fastclick, modernizr, foundation) {

    // Auth setup, if not doesn't set request header token if not logged in
    $.ajaxSetup({
        beforeSend: function (request) {
            if(profile.getToken() != null) {
                request.setRequestHeader("Authorization", profile.getToken());
            }
        }
    });

    profile.on("change:logged_in", function() {
        if (profile.getToken() != null) {
            router.setDefaultRoute('wallets');
        } else {
            router.setDefaultRoute("login");
        }
    });

    $(function (){
        var idleTimer;
        function resetTimer(){
            console.log("timer reset");
            clearTimeout(idleTimer);
            idleTimer = setTimeout(whenUserIdle, 5000);
        }
        router.on("route",resetTimer);
        resetTimer(); // Start the timer when the page loads
    })

    function whenUserIdle(){
        console.log("logging out" + profile.getUsername());
        profile.destroySession();
        console.log(router.defaultRoute);
        router.navigate(router.defaultRoute, {trigger: true});
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
