define(['react', 'underscore', 'components/header', 'components/footer',
        'components/sidebar', 'components/notification', 'models/profile'],
function (React, _, Header, Footer, Sidebar, Notification, profile) {

    var Application = React.createClass({

        displayName: 'Application',

        getInitialState: function () {
            return {profile: profile};
        },

        render: function() {
            var loggedIn = profile.getToken() != null;
            return React.DOM.div({id : 'wrapper'},
                Header({loggedIn: loggedIn}),
                Sidebar({loggedIn: loggedIn}),
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
            this.state.profile.on('change', function() {
              this.forceUpdate();
            }.bind(this));
        }
    });

    return Application;

});
