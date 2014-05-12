define(['react'], function(React) {

    var Loader = React.createClass({
        displayName: 'Loader',

        render: function() {
            return React.DOM.div({id: "loader-container"},
                React.DOM.div({id: "loader"}),
                React.DOM.br(),
                React.DOM.h2({id: "loader-caption"}, "Loading.. Oink"))
        }
    });

    return Loader;
});
