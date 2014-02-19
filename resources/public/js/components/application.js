define(['react', 'underscore', 'components/header', 'components/footer'],
function (React, _, Header, Footer) {

    var Application = React.createClass({
        render: function() {
            return React.DOM.div({},
                Header(),
                React.DOM.div({id: 'main'}),
                Footer()
            );
        }
    });

    return Application;
});
