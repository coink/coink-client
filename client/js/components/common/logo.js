define(['react', 'router'], function(React, router) {

    var Logo = React.createClass({
        displayName: "Logo",

        handleClick: function(e) {
            e.preventDefault();
            router.navigate(router.defaultRoute, {trigger : true});
        },

        render: function() {
            return React.DOM.a({
                href: router.defaultRoute,
                id: 'logo',
                onClick: this.handleClick
            }, React.DOM.h1({}, "Coink"));
        }
    });

    return Logo;
});
