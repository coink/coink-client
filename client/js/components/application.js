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

        componentWillMount: function () {
            profile.on('change:logged_in', function() {
                this.setState({logged_in : profile.getToken() != null});
            }.bind(this));

            if(this.state.logged_in) {
                this.props.meta_exchanges.fetch({
                    success: function(collection) {
                        this.forceUpdate();
                    }.bind(this),
                    error: function() {
                        notification.error("AJAX meta_exchanges error");
                    }.bind(this)
                });
            }
        }
    });

    return Application;

});
