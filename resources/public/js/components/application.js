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
                Notification(),
                React.DOM.div({id: 'main'}),
                Footer()
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
