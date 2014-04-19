define(['react', 'underscore', 'components/header', 'components/footer',
        'components/sidebar', 'components/notification', 'models/notification', 'models/profile'],
function (React, _, Header, Footer, Sidebar, Notification, notification, profile) {

    var Application = React.createClass({
        displayName: 'Application',

        getInitialState: function() {
            return {logged_in : profile.getToken() != null};
        },

        render: function() {
            var mainContentWidth = 12;
            var sidebar = undefined;
            if(this.state.logged_in) {
                mainContentWidth = 9;
                sidebar = Sidebar({loggedIn: this.state.logged_in});
            }

            return React.DOM.div({id : 'wrapper'},
                Header({loggedIn: this.state.logged_in}),
                sidebar,
                React.DOM.div({id: 'content-wrapper', className: 'large-' + mainContentWidth + ' medium-' + mainContentWidth + ' columns'},
                    React.DOM.div({className: 'floatfix'},
                        React.DOM.div({className: 'wrap'},
                            Notification(),
                            React.DOM.div({id: 'main'})
                        ),
                        Footer()
                    )
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
                this.setState({logged_in : profile.getToken() != null});
            }.bind(this));
        },
        setView: function(requirements, getView, requiresLogin) {
            if(requiresLogin != null) {
                // Don't render views that require user login
                if(requiresLogin && !profile.get("logged_in")) {
                    this.navigate('login', {trigger: true});
                    return;
                // Don't render views that require user is not logged in
                } else if (!requiresLogin && profile.get("logged_in")) {
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
