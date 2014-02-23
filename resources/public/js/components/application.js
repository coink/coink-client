define(['react', 'underscore', 'components/header', 'components/footer',
        'components/sidebar', 'token_store'],
function (React, _, Header, Footer, Sidebar, TokenStore) {

    var Application = React.createClass({
        render: function() {
            var loggedIn = TokenStore.get() != null;
            return React.DOM.div({},
                Header({loggedIn: loggedIn}),
                Sidebar({loggedIn: loggedIn}),
                React.DOM.div({id: 'main'}),
                Footer()
            );
        }
    });

    return Application;

});
