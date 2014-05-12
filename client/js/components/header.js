define(['react', 'router', 'models/notification', 'models/profile', 'scripts/md5'],
function(React, router, notification, profile, hash) {

    var LoginLink = React.createClass({
        displayName: 'LoginLink',

        handleClick: function(e) {
            e.preventDefault();
            router.navigate('landing', {trigger : true});
        },

        render: function() {
            return React.DOM.a({
                href: 'landing',
                onClick: this.handleClick
            }, "Login");
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
            if(profile.isLoggedIn()) {
                $.ajax({
                    type: "POST",
                    url: router.url_root + "/v1/logout",
                    data: {"token" : profile.getToken()},
                    success: function(msg) {
                        notification.success("See you later " +
                            profile.getUsername() + "! Oink oink.");
                        profile.destroySession();
                    }
                });
            }
            router.navigate(router.defaultRoute, {trigger : true});
        },

        render: function() {
            return React.DOM.a({
                href: 'logout',
                onClick: this.handleClick
            }, "Logout " + profile.getUsername());
        }
    });

    var Header = React.createClass({
        displayName: 'Header',

        render: function() {
            var links = React.DOM.li({}, LoginLink(),
                    React.DOM.li({}, RegisterLink()));
            if(profile.isLoggedIn()) {
                var hash = md5(profile.getUsername());
                var src = 'http://www.gravatar.com/avatar/' +
                    hash + '?d=identicon';

                links = React.DOM.li({}, React.DOM.img({
                    'id': 'avatar',
                    'src': src
                }),
                React.DOM.li({}, LogoutLink()));
            }
            return React.DOM.nav({'className': 'top-bar'},
                React.DOM.ul({'className': 'title-area'},
                    React.DOM.li({'className': 'name'},
                        React.DOM.h1(React.DOM.a({'href' : '#'}, "Coink")))),
                React.DOM.section({'className': 'top-bar-section'},
                    React.DOM.ul({'className': 'right'}, links)))
        }

    });

    return Header;
});
