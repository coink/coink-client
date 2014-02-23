define(['backbone', 'react'], function(Backbone, React) {
    var Router = Backbone.Router.extend({
        routes: {
            '': 'handleDefaultRoute',
            'login': 'login',
            'register': 'register',
            'wallets': 'wallets'
        },

        setDefaultRoute: function(route) {
            this.defaultRoute = route;
        },

        handleDefaultRoute: function() {
            this.navigate(this.defaultRoute, {trigger: true, replace: true});
        },

        setView: function(requirements, getView) {
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
            });
        },

        register: function() {
            this.setView(['components/register'], function(Register) {
                return Register();
            });
        },

        wallets: function() {
            this.setView(['components/wallets'], function(Wallets) {
                return Wallets();
            });
        }
    });

    return new Router();
});
