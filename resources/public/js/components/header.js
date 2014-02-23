define(['react', 'models/profile', 'router'], function(React, profile, router) {

    var LoginLink = React.createClass({
        handleClick: function(e) {
            e.preventDefault();
            router.navigate('login', {trigger : true});
        },
        render: function() {
            return React.DOM.a({href: 'login', onClick: this.handleClick},
                "Login");
        }
    });

    var RegisterLink = React.createClass({
        handleClick: function(e) {
            e.preventDefault();
            router.navigate('register', {trigger : true});
        },
        render: function() {
            return React.DOM.a({href: 'register', onClick: this.handleClick},
                "Register");
        }
    });

    var LogoutLink = React.createClass({
        handleClick: function(e) {
            e.preventDefault();
            profile.destroyToken();
            router.navigate('/', {trigger : true});
        },
        render: function() {
            return React.DOM.a({href: 'logout', onClick: this.handleClick},
                "Logout " + profile.getToken());
        }
    });

    var Header = React.createClass({
        render: function() {

            var loginLink = profile.getToken() != null ?
                LogoutLink() :
                React.DOM.span({}, LoginLink(), " ", RegisterLink());

            return React.DOM.header({'className': 'clearfix'},
                React.DOM.a(
                    {href: '/', id: 'logo'},
                    React.DOM.img({
                        src: '/resources/images/mini_logo.png',
                        alt: 'Coink.io Crypto services',
                        height: '30',
                        width: '30'
                    }),
                    "Coink.io",
                    React.DOM.span({id: 'tagline'}, " Your Crypto Portfolio")
                ),
                React.DOM.div({id: 'header-nav'}, loginLink)
            );
        }
    });

    return Header;

});
