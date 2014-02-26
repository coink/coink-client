define(['react'], function(React) {

    var Notification = React.createClass({
        render: function() {
            return React.DOM.h1({}, this.props.message);
        }
    });

    return Notification;

});
