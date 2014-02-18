define(['react', 'underscore', 'components/footer'],
function (React, _, Footer) {

    var Application = React.createClass({
        render: function() {
            return React.DOM.div({},
                React.DOM.div({id: 'main'}),
                Footer()
            );
        }
    });

    return Application;
});
