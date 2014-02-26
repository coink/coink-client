define(['backbone'], function(Backbone) {

    var Notification = Backbone.Model.extend({

        initialize: function() {
            var node = document.getElementById('notification');
            this.set({message: 'default', type: 'warn', sticky: false});
        },
        getType: function() {
            return this.get('type');
        },
        getSticky: function() {
            return this.get('sticky');
        },
        getMessage: function() {
            return this.get('message');
        },
        updateNotification: function() {
            React.renderComponent(Notification({message: message}), node);
        },
        clearNotification: function() {
            React.unmountComponentAtNode(node);
        }

    });

    return Notification;

});
