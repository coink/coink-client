define(['react', 'router', 'models/profile'], function(React, router, profile) {

    var LoginLink = React.createClass({
        displayName: 'LoginLink',
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
        displayName: 'RegisterLink',
        handleClick: function(e) {
            e.preventDefault();
            router.navigate('register', {trigger : true});
        },
        render: function() {
            return React.DOM.a({href: 'register', onClick: this.handleClick},
                "Register");
        }
    });

    var AboutLink = React.createClass({
        displayName: 'AboutLink',
        handleClick: function(e) {
            e.preventDefault();
            router.navigate('about', {trigger: true});
        },
        render: function() {
            return React.DOM.a({href: 'about', onClick: this.handleClick},
                "About Us");
        }
    })

    var LogoutLink = React.createClass({
        displayName: 'LogoutLink',
        handleClick: function(e) {
            e.preventDefault();
            var token = profile.getToken();
            if(token == null) {
                router.navigate('/', {trigger : true});
                return;
            }
            $.ajax({
                type: "POST",
                url: router.url_root + "/v1/logout",
                data: {"token" : token},
                success: function(msg) {
                    profile.destroySession();
                    router.setDefaultRoute("login");
                    router.navigate('/', {trigger : true});
                }
            });
        },
        render: function() {
            return React.DOM.a({href: 'logout', onClick: this.handleClick},
                "Logout " + profile.getUsername());
        }
    });

    var Header = React.createClass({
        displayName: 'Header',
        handleClick: function(e) {
            e.preventDefault();
            router.navigate('/', {trigger : true});
        },
        render: function() {
            var loginLink = profile.getToken() != null ?
                LogoutLink() :
                React.DOM.span({}, LoginLink(), " ", RegisterLink(), " ", AboutLink());

            return React.DOM.header({'className': 'clearfix'},
                React.DOM.a(
                    {href: '/', id: 'logo', onClick: this.handleClick},
                    React.DOM.img({
                        src: '/img/CoinkLogoSmall.svg',
                        alt: 'Coink.io Crypto services',
                        height: '50',
                        width: '50'
                    }),
                    "Coink.io",
                    React.DOM.span({id: 'tagline'}, " What's in your wallet?")
                ),
                React.DOM.div({id: 'header-nav'}, loginLink)
            );
        }
    });

    return Header;

});
