define(['react', 'underscore', 'components/header', 'components/footer',
        'components/sidebar', 'models/profile'],
function (React, _, Header, Footer, Sidebar, profile) {

    var Application = React.createClass({

        getInitialState: function () {
            return {'profile' : profile};
        },

        render: function() {
            var loggedIn = profile.getToken() != null;
            return React.DOM.div({},
                Header({loggedIn: loggedIn}),
                Sidebar({loggedIn: loggedIn}),
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
