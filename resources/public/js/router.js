define(['backbone', 'react', 'models/profile'],
function(Backbone, React, profile) {


    var Router = Backbone.Router.extend({

        routes: {
            '': 'handleDefaultRoute',
            'login': 'login',
            'register': 'register',
            'wallets': 'wallets'
        },

        url_root: "http://private-d789-coink.apiary.io",

        setDefaultRoute: function(route) {
            this.defaultRoute = route;
        },

        handleDefaultRoute: function() {
            this.navigate(this.defaultRoute, {trigger: true, replace: true});
        },

        setView: function(requirements, getView, requiresLogin) {
            if(requiresLogin && !profile.get("logged_in")) {
                this.navigate('login', {trigger: true});
                return;
            }
            var node = document.getElementById('main');
            var loading = React.DOM.div({className: 'loading'});
            React.renderComponent(loading, node);
            require(requirements, function() {
                var modules = arguments;
                React.renderComponent(getView.apply(this, modules), node);
            }.bind(this));
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
        }
    });

    return new Router();
});