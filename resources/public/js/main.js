require.config({
    baseUrl: 'js',
    paths: {
        /* TODO: use minified versions in production */
        'jquery': '//cdnjs.cloudflare.com/ajax/libs/jquery/2.1.0/jquery',
        'backbone': '//cdnjs.cloudflare.com/ajax/libs/backbone.js/1.1.0/backbone-min',
        'underscore': '//cdnjs.cloudflare.com/ajax/libs/underscore.js/1.4.3/underscore-min',
        'react': '//cdnjs.cloudflare.com/ajax/libs/react/0.8.0/react',
        'fastclick': '/js/scripts/fastclick',
        'modernizr': '/js/scripts/modernizr-latest'

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

require(['jquery', 'backbone', 'react', 'components/application', 'router', 
    'token_store'], function($, Backbone, React, Application, router, 
    TokenStore) {

    $(document).ready(function() {
        var app = Application();
        React.renderComponent(app, document.getElementById('coink'));
    });

    /* WITHOUT JQUERY
    document.addEventListener("DOMContentLoaded", function() {
        var app = Application();
        React.renderComponent(app, document.getElementById('coink'));
    });
    */

    var auth_token = TokenStore.get();
    if (!auth_token)
        router.setDefaultRoute('login');
    else
        router.setDefaultRoute("wallets");

    Backbone.history.start({
        pushState: false, // False until compojure routing is figured out
        root: "/"
    });
});
