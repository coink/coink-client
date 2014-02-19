define(['backbone', 'react'], function(Backbone, React) {
    var Router = Backbone.Router.extend({
        routes: {
            '': 'handleDefaultRoute',
            'wallets': 'wallets',
            'dashboard': 'dashboard'
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

        wallets: function() {
            this.setView(['components/wallets'], function(Wallets) {
                return Wallets();
            });
        },

        dashboard: function() {
            this.setView(['components/dashboard'], function(Dashboard) {
                return Dashboard();
            });
        }
    });

    return new Router();
});
