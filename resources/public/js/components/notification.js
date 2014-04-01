define(['react', 'models/notification'], function(React, notification) {

    var Notification = React.createClass({

        displayName: 'Notification',

        handleClose: function() {
            this.replaceState({});
        },

        getInitialState: function() {
            return {
                message : notification.get('message'),
                type : notification.get('type'),
                sticky : notification.get('sticky'),
            }
        },

        render: function() {
            if(!this.state.message)
                return React.DOM.div({id: 'notification'});
            return React.DOM.div({
                "data-alert": '',
                id: 'notification',
                className: 'alert-box ' + this.state.type
            }, this.state.message, React.DOM.a({
                href: '#',
                onClick: this.handleClose,
                className: 'close'
            }, 'x'));
        },

        componentDidMount: function() {
            notification.on('change', function() {
                this.setState({
                    message : notification.get('message'),
                    type : notification.get('type'),
                    sticky : notification.get('sticky'),
                });
            }.bind(this));
        },
    });

    return Notification;

});
