define(['backbone'], function(Backbone) {

    var Notification = Backbone.Model.extend({

        initialize: function() {
            this.set({
                    message: null,
                    type: '',
                    sticky: false
                }
            );
        },
        updateNotification: function(message, type) {
            if(type) {
                this.set({message: message, type: type});
            } else {
                this.set({message: message, type: 'info'});
            }
        },
        clearNotification: function() {
            this.set({message: null});
        }

    });

    return new Notification;

});
