define(['react', 'underscore', 'components/header', 'components/footer',
        'components/sidebar', 'components/notification', 'models/profile'],
function (React, _, Header, Footer, Sidebar, Notification, profile) {

    var Application = React.createClass({
        displayName: 'Application',

        getInitialState: function() {
            return {logged_in : profile.getToken() != null};
        },

        render: function() {
            return React.DOM.div({id : 'wrapper'},
                Header({loggedIn: this.state.logged_in}),
                Sidebar({loggedIn: this.state.logged_in}),
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

        componentDidMount: function () {
            profile.on('change:logged_in', function() {
                this.setState({logged_in : profile.getToken() != null});
            }.bind(this));
        }
    });

    return Application;

});
