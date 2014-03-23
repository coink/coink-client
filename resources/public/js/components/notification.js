define(['react', 'models/notification'], function(React, notification) {

    var Notification = React.createClass({
        getInitialState: function() {
            return {model : notification};
        },

        render: function() {
            if(this.state.model.get('message')) {
                return React.DOM.div({id : 'notification-' + this.state.model.get('type')},
                    React.DOM.h1({}, this.state.model.get('message')));
            } else {
                return React.DOM.div({id : 'notification'});
            }
        },

        componentDidMount: function() {
            this.state.model.on('change', function() {
                this.forceUpdate();
            }.bind(this));
        },
    });

    return Notification;

});
