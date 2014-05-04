define(['backbone'], function(Backbone) {

    var Notification = Backbone.Model.extend({
        initialize: function() {
            this.set({
                message: null,
                type: '',
                sticky: false
            });
        },

        warning: function(message) {
            this.set({message: message, type: "warning"});
        },

        error: function(message) {
            this.set({message: message, type: "error"});
        },

        success: function(message) {
            this.set({message: message, type: "success"});
        },

        info: function(message) {
            this.set({message: message, type: "info"});
        },

        toggleSticky: function() {
            this.set({sticky: !this.get("sticky")});
        },

        clearNotification: function() {
            this.set({message: null});
        }
    });

    return new Notification();
});
