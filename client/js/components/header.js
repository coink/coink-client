define(['react', 'router', 'models/notification', 'scripts/md5'],
function(React, router, notification, hash) {

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
            this.props.handleLogout();
        },

        render: function() {
            return React.DOM.a({
                href: 'logout',
                onClick: this.handleClick
            }, "Logout " + this.props.username);
        }
    });

    var Header = React.createClass({
        displayName: 'Header',

        render: function() {
            var links = React.DOM.li({}, LoginLink(),
                    React.DOM.li({}, RegisterLink()));
            if(this.props.loggedIn) {
                var hash = md5(this.props.username);
                var src = 'http://www.gravatar.com/avatar/' +
                    hash + '?d=identicon';

                links = React.DOM.li({}, React.DOM.img({
                    'id': 'avatar',
                    'src': src
                }),
                React.DOM.li({}, LogoutLink({
                    handleLogout: this.props.handleLogout,
                    username: this.props.username
                })));
            }
            return React.DOM.nav({className: 'show-for-medium-up top-bar'},
                React.DOM.ul({className: 'title-area'},
                    React.DOM.li({className: 'name'},
                        React.DOM.h1(React.DOM.a({'href' : '#'}, "Coink")))),
                React.DOM.section({className: 'top-bar-section'},
                    React.DOM.ul({className: 'right'}, links)));
        }

    });

    return Header;
});
