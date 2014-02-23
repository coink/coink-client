define(['react', 'jquery', 'router', 'models/profile'], function(React, $, router, profile) {
    var Login = React.createClass({
        render: function() {
            var payload = {};
            payload.username = prompt("What is your username?");
            payload.password = prompt("What is your password? (Coink.io takes security seriously.)");

            $.post("http://private-d789-coink.apiary.io/v1/session", JSON.stringify(payload), function(data, textStatus, jqXHR) {
                if (textStatus == 'success') {
                    profile.setToken(data.token, data.expires);
                    router.navigate('wallets', {trigger: true});
                } else {
                    router.navigate('/', {trigger: true});
                }
            });
            return React.DOM.div({}, "");
        }
    });

    return Login;

});
