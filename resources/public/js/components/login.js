define(['react', 'jquery', 'router', 'models/profile'], function(React, $, router, profile) {
    var Login = React.createClass({
        handleSubmit: function(e) {
            e.preventDefault();
            var payload = {};
            $.post("http://private-d789-coink.apiary.io/v1/session",
                    JSON.stringify(payload), function(data, textStatus, jqXHR) {
                        if (textStatus == 'success') {
                            profile.setToken(data.data.token, data.data.expires);
                            router.navigate('wallets', {trigger: true});
                        } else {
                            router.navigate('/', {trigger: true});
                        }
                    });
        },
        render: function() {
            return React.DOM.form({onSubmit: this.handleSubmit},
                React.DOM.label({htmlFor: 'username'}, "Username"),
                React.DOM.input({
                    type: 'text',
                    id: 'username',
                }),
                React.DOM.label({htmlFor: 'password'}, "Password"),
                React.DOM.input({
                    type: 'password',
                    id: 'password',
                }),
                React.DOM.input({type: 'submit', value: "Login"}));
        }
    });

    return Login;

});
