define(['react', 'router', 'models/notification', 'models/profile'], function(React, router, notification, profile) {

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
                    notification.success("Successfully logged out " + profile.getUsername());
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
                React.DOM.span({}, LogoutLink(), " ", AboutLink()) :
                React.DOM.span({}, LoginLink(), " ", RegisterLink(), " ", AboutLink());

            return React.DOM.header({'className': 'clearfix'},
                React.DOM.div({id: 'header-nav'}, loginLink)
            );
        }
    });

    return Header;

});
