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

        setView: function(requirements, getView, requiresLogin) {
            if(requiresLogin != null) {
                // Don't render views that require user login
                if(requiresLogin && !profile.get("logged_in")) {
                    this.navigate('login', {trigger: true});
                    return;
                // Don't render views that require user is not logged in
                } else if (!requiresLogin && profile.get("logged_in")) {
                    return;
                }
            }
            var node = document.getElementById('main');
            var loading = React.DOM.div({className: 'loading'});
            React.renderComponent(loading, node);
            require(requirements, function() {
                var modules = arguments;
                React.renderComponent(getView.apply(this, modules), node);
            }.bind(this));
        },

        landing: function() {
            this.setView(['components/landing'], function(Landing) {
                return Landing();
            }, false);
        },

        login: function() {
            this.setView(['components/login'], function(Login) {
                return Login();
            }, false);
        },

        register: function() {
            this.setView(['components/register'], function(Register) {
                return Register();
            }, false);
        },

        wallets: function() {
            this.setView(['components/wallets'], function(Wallets) {
                return Wallets();
            }, true);
        },

        exchanges: function() {
            this.setView(['components/exchange_accounts'], function(ExchangeAccounts) {
                return ExchangeAccounts();
            }, true);
        },

        help: function() {
            this.setView(['components/help'], function(Help) {
                return Help();
            }, null);
        },

        about: function() {
            this.setView(['components/about'], function(About) {
                return About();
            }, null);
        },

        contact: function() {
            this.setView(['components/contact'], function(Contact) {
                return Contact();
            }, null);
        },

        faq: function() {
            this.setView(['components/faq'], function(Faq) {
                return Faq();
            }, null);
        }
    });

    return new Router();
});
