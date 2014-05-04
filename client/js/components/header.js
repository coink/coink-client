define(['react', 'router', 'models/notification', 'models/profile'],
    function(React, router, notification, profile) {

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
            return React.DOM.a({
                href: 'register',
                onClick: this.handleClick
            }, "Register");
        }
    });

    var LogoutLink = React.createClass({
        displayName: 'LogoutLink',

        handleClick: function(e) {
            e.preventDefault();
            var token = profile.getToken();
            if(token === null) {
                router.navigate('/', {trigger : true});
                return;
            }
            $.ajax({
                type: "POST",
                url: router.url_root + "/v1/logout",
                data: {"token" : token},
                success: function(msg) {
                    var name = profile.getUsername();
                    profile.destroySession();
                    notification.success("See you later " + name + "! Oink oink.");
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

        render: function() {
            var loginLink = profile.getToken() !== null ?
                React.DOM.header({'className': 'clearfix'},
                    React.DOM.div({id: 'header-nav'},
                        React.DOM.span({}, LogoutLink(), " ")
                    )
                ) : React.DOM.div({});
            return loginLink;
        }
    });

    return Header;
});
