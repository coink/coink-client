define(['react', 'components/notification'], function(React, Notification) {

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
