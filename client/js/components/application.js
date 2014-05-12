define(['react', 'underscore', 'components/header', 'components/footer',
        'components/sidebar', 'components/notification', 'models/notification', 'models/profile'],
function (React, _, Header, Footer, Sidebar, Notification, notification, profile) {

    var Application = React.createClass({
        displayName: 'Application',
        getInitialState: function() {
            return {loggedIn: profile.isLoggedIn()};
        },

        render: function() {
            var loggedIn = this.state.loggedIn;
            var mainContentWidth = loggedIn ? 9 : 12;
            return React.DOM.div({id : 'coink'},
                Header({
                    handleLogout: this.handleLogout,
                    loggedIn: loggedIn,
                    username: profile.getUsername()
                }),
                Sidebar({loggedIn: loggedIn}),
                React.DOM.div({ className:
                        'large-' + mainContentWidth +
                        ' medium-' + mainContentWidth + ' columns'
                },
                    Notification(),
                    React.DOM.div({id: 'main'}),
                    Footer()
                )
            );
        },

        componentWillMount: function() {
            this.props.router.on("route", this.onRoute);
        },

        componentWillUnmount: function() {
            this.props.router.off("route", this.onRoute);
        },

        componentDidMount: function () {
            profile.on('change:logged_in', function() {
                this.setState({loggedIn : profile.isLoggedIn()});
            }.bind(this));
        },

        handleLogout: function() {
            if(profile.isLoggedIn()) {
                var router = this.props.router;
                $.ajax({
                    type: "POST",
                    url: router.url_root + "/v1/logout",
                    data: {"token" : profile.getToken()},
                    success: function() {
                        var name = profile.getUsername();
                        profile.destroySession();
                        notification.success("Oink oink. See you later " +
                            name + "!");
                    }
                });
            }
            router.navigate(router.defaultRoute, {trigger : true});
        },

        setView: function(requirements, getView, requiresLogin) {
            if(requiresLogin !== null) {
                // Don't render views that require user login
                if(requiresLogin && !profile.isLoggedIn()) {
                    this.navigate('login', {trigger: true});
                    return;
                // Don't render views that require user is not logged in
                } else if (!requiresLogin && profile.isLoggedIn()) {
                    return;
                }
            }
            var node = document.getElementById('main');
            var loading = React.DOM.div({className: 'loading'});
            React.renderComponent(loading, node);
            require(requirements, function() {
                var modules = arguments;
                React.renderComponent(getView.apply(this, modules), node);
            }.bind(this));
        },

        onRoute: function() {
            console.log("Route current changed to: " + this.props.router.current);
            this.setView(['components/' + this.props.router.current], function(NewView) {
                return NewView();
            }, this.props.router.requiresLogin);
        }

    });

    return Application;

});
