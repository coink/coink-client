define(['react'], function(React) {

    var Notification = React.createClass({
        render: function() {
            return React.DOM.div({id: 'notification'},
                React.DOM.h1({}, this.props.message)
            );
        }
    });

    return Notification;

});
