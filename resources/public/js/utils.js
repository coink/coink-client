define(['react', 'components/notification', 'router', 'models/profile'], function(React, Notification, router, profile) {

    var Utils = function() {};

    var node = document.getElementById('notification');

    Utils.updateNotification = function(message) {
        React.renderComponent(Notification({message: message}), node);
    };

    Utils.clearNotification = function() {
        React.unmountComponentAtNode(node);
    };

    return Utils;

});
