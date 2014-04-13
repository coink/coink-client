define(['backbone', 'underscore', 'react', 'models/profile'],
function(Backbone, _, React, profile) {

    var Router = Backbone.Router.extend({
        routes: {
            '': 'handleDefaultRoute',
            'landing': 'landing',
            'login': 'login',
            'register': 'register',
            'wallets': 'wallets',
            'exchanges': 'exchanges',
            'help': 'help',
            'about': 'about',
            'about/contact': 'contact',
            'about/faq': 'faq',
        },

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

        wallets: function() {
            this.current = "wallets";
            this.requiresLogin = true;
        },

        exchanges: function() {
            this.current = "exchanges";
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
