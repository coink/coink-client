define(['backbone', 'underscore', 'react'],
function(Backbone, _, React) {

    var Router = Backbone.Router.extend({
        routes: {
            '': 'handleDefaultRoute',
            'landing': 'landing',
            'login': 'login',
            'register': 'register',
            'wallets': 'wallets',
            'exchanges': 'exchanges',
            'all': 'all',
            'exchanges/trades': 'trades',
            'exchanges/orders': 'orders',
            'help': 'help',
            'about': 'about',
            'about/contact': 'contact',
            'about/faq': 'faq',
        },

        // Helper function for loading sidebar submenus
        getRouteMap: function() {
            return _.invert(this.routes);
        },

        url_root: urlRoot,

        setDefaultRoute: function(route) {
            this.defaultRoute = route;
        },

        handleDefaultRoute: function() {
            this.navigate(this.defaultRoute, {trigger: true, replace: true});
        },

        landing: function() {
            this.current = "landing";
            this.requiresLogin = false;
        },

        login: function() {
            this.current = "login";
            this.requiresLogin = false;
        },

        register: function() {
            this.current = "register";
            this.requiresLogin = false;
        },

        all: function() {
            this.current = "all";
            this.requiresLogin = true;
        },

        wallets: function() {
            this.current = "wallets";
            this.requiresLogin = true;
        },

        exchanges: function() {
            this.current = "exchanges";
            this.requiresLogin = true;
        },

        trades: function() {
            this.current = 'trades';
            this.requiresLogin = true;
        },

        orders: function() {
            this.current = 'orders';
            this.requiresLogin = true;
        },

        help: function() {
            this.current = "help";
            this.requiresLogin = null;
        },

        about: function() {
            this.current = "about";
            this.requiresLogin = null;
        },

        contact: function() {
            this.current = "contact";
            this.requiresLogin = null;
        },

        faq: function() {
            this.current = "faq";
            this.requiresLogin = null;
        }
    });

    return new Router();
});
