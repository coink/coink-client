define(['react', 'models/notification'], function(React, notification) {

    var Notification = React.createClass({
        displayName: 'Notification',
        getInitialState: function() {
            return {model: notification};
        },

        handleClose: function() {
            this.state.model.clearNotification();
        },

        render: function() {
            if(this.state.model.get('message')) {
                return React.DOM.div({"data-alert": '', id: 'notification', className: 'alert-box ' + this.state.model.get('type')},
                    this.state.model.get('message'),
                    React.DOM.a({href: '#', onClick: this.handleClose, className: 'close'}, 'x'));
            } else {
                return React.DOM.div({id: 'notification'});
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
