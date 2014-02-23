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

    var LogoutLink = React.createClass({
        handleClick: function(e) {
            profile.tokenDestroy();
        },
        render: function() {
            return React.DOM.a({href: '/', onClick: this.handleClick},
                "Logout " + profile.getToken());
        }
    });

    var Header = React.createClass({
        render: function() {

            var loginLink = this.props.loggedIn ? LogoutLink() : LoginLink();

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
