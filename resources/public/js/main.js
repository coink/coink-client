require.config({
    baseUrl: 'js',
    paths: {
        /* TODO: use minified versions in production */
        'jquery': '//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.0/jquery',
        'backbone': '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.0/backbone-min',
        'underscore': '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.3/underscore-min',
        'react': '//cdnjs.cloudflare.com/ajax/libs/react/0.10.0/react',

    },
    shim: {
        backbone: {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone'
        },
        underscore: {
            exports: '_'
        },
    }
});

require(['jquery', 'backbone', 'react', 'components/application', 'router', 'models/profile'], function($, Backbone, React, Application, router, profile) {


    // Auth setup, if not doesn't set request header token if not logged in
    $.ajaxSetup({
        beforeSend: function (request) {
            if(profile.getToken() != null) {
                request.setRequestHeader("Authorization", profile.getToken());
            }
        }
    });

    // Begin rendering the webapp with the main react component 'Application'
    $(document).ready(function() {
        var app = Application();
        React.renderComponent(app, document.getElementById('coink'));
    });

    // Default route if logged in
    if (profile.getToken() != null)
        router.setDefaultRoute('wallets');
    else
        router.setDefaultRoute("login");

    // Single page webapp routing made nice for browser navigation
    Backbone.history.start({
        pushState: false, // False until compojure routing is figured out
        root: "/"
    });

});
