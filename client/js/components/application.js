define(['react', 'underscore', 'components/header', 'components/footer',
        'components/sidebar', 'components/notification', 'models/notification', 'models/profile', 'collections/meta_exchanges'],
function (React, _, Header, Footer, Sidebar, Notification, notification, profile, MetaExchanges) {

    var Application = React.createClass({
        displayName: 'Application',

        getInitialState: function() {
            return {logged_in : profile.getToken() != null};
        },

        getDefaultProps: function() {
            return {meta_exchanges: new MetaExchanges()};
        },

        render: function() {
            return React.DOM.div({id : 'wrapper'},
                Header({loggedIn: this.state.logged_in}),
                Sidebar({loggedIn: this.state.logged_in, meta_exchanges: this.props.meta_exchanges}),
                React.DOM.div({id: 'content-wrapper', className: 'large-9 medium-9 columns'},
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
                if(this.props.meta_exchanges.isEmpty() && this.state.logged_in) {
                    this.props.meta_exchanges.fetch({
                        success: function(collection) {
                            console.log("ForceUpdate");
                            this.forceUpdate();
                            this.onRoute();
                        }.bind(this),
                        error: function() {
                            notification.error("AJAX meta_exchanges error");
                        }.bind(this)
                    });
                }
            }.bind(this));

            if(this.state.logged_in) {
                this.props.meta_exchanges.fetch({
                    success: function(collection) {
                        console.log("ForceUpdate");
                        this.forceUpdate();
                        this.onRoute();
                    }.bind(this),
                    error: function() {
                        notification.error("AJAX meta_exchanges error");
                    }.bind(this)
                });
            }
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

            if (this.props.router.current == "new_exchange") {
                this.setView(['components/new_exchange'], function(NewExchange){
                    return NewExchange({
                        meta_exchanges: this.props.meta_exchanges,
                        exchangeName: this.props.router.exchangeName
                    });
                }, this.props.router.requiresLogin);
            } else {
                this.setView(['components/' + this.props.router.current], function(NewView) {
                    return NewView();
                }, this.props.router.requiresLogin);
            }
        }

    });

    return Application;

});
