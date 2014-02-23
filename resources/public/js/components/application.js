define(['react', 'underscore', 'components/header', 'components/footer',
        'components/sidebar', 'models/profile', 'token_store'],
function (React, _, Header, Footer, Sidebar, profile, TokenStore) {

    var Application = React.createClass({
        getInitialState: function () {
            console.log(profile);
            return {'profile' : profile};
        },

        render: function() {
            var loggedIn = TokenStore.get() != null;
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
