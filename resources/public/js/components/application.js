define(['react', 'underscore', 'components/header', 'components/logo', 'components/footer',
        'components/sidebar', 'components/notification', 'models/profile'],
function (React, _, Header, Logo, Footer, Sidebar, Notification, profile) {

    var Application = React.createClass({

        displayName: 'Application',

        getInitialState: function () {
            return {profile: profile};
        },

        render: function() {
            var loggedIn = profile.getToken() != null;
            return React.DOM.div({id : 'wrapper'},
                Header({loggedIn: loggedIn}),
                React.DOM.div({className: "row left"},
                    Sidebar({loggedIn: loggedIn, header: Logo()}),
                    React.DOM.div({className: 'large-9 medium-9 columns'},
                        Notification(),
                        React.DOM.div({id: 'main'})
                    ),
                    Footer()
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
