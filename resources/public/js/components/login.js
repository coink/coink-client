define(['react', 'token_store', 'jquery', 'router'], function(React, TokenStore, $, router) {
    var Login = React.createClass({
        render: function() {
            var payload = {};
            payload.username = prompt("What's your usename?");
            payload.password = prompt("What's your password? (Trust me it's safe.)");

            $.post("http://private-d789-coink.apiary.io/v1/login", JSON.stringify(payload), function(data, textStatue, jqXHR) {
                TokenStore.set(data.token, data.expires);
                router.navigate('wallets', {trigger: true});
            });
            return React.DOM.div({}, "login please");
        }
    });

    return Login;
});
