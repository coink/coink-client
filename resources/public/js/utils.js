define(['react', 'components/notification', 'router', 'models/profile'], function(React, Notification, router, profile) {

    var Utils = function() {};

    var node = document.getElementById('notification');

    Utils.updateNotification = function(message) {
        React.renderComponent(Notification({message: message}), node);
    };

    Utils.clearNotification = function() {
        React.unmountComponentAtNode(node);
    };

    Utils.login = function(username, password) {
        var payload = {
            "username" : username,
            "password" : password
        };

        $.post(router.url_root + "/v1/session", JSON.stringify(payload),
            function(data, textStatus, jqXHR) {
                profile.createSession(data.data.token, data.data.expires, username);
                this.clearNotification();
                router.navigate('wallets', {trigger: true});
            }.bind(this))
        .fail(
            function() {
                updateNotification("error: login-error");
                router.navigate('login', {trigger: true});
            }
        );
    };

    Utils.logout = function() {
        $.ajax({
            type: "DELETE",
            url: router.url_root + "/v1/session"
        })
        .done(
            function() {
                console.log("Logged Out");
            }
        );
    };

    return Utils;

});
