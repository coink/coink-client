define(['react', 'jquery', 'router', 'models/profile'], function(React, $, router, profile) {

    var Login = React.createClass({
        handleSubmit: function(e) {
            e.preventDefault();

            var payload = {
                "username" : this.refs.username.getDOMNode().value.trim(),
                "password" : this.refs.password.getDOMNode().value.trim()
            };

            $.post(router.url_root + "/v1/session", JSON.stringify(payload),
                function(data, textStatus, jqXHR) {
                    profile.setToken(data.data.token, data.data.expires);
                    router.navigate('wallets', {trigger: true});
                }).fail(
                function() {
                    console.log("login-error");
                    router.navigate('login', {trigger: true});
                });
        },

        render: function() {
            return React.DOM.form({onSubmit: this.handleSubmit},
                React.DOM.label({htmlFor: 'username'}),
                React.DOM.input({
                    placeholder: "Username",
                    type: 'text',
                    ref: 'username',
                }),
                React.DOM.br(),
                React.DOM.label({htmlFor: 'password'}),
                React.DOM.input({
                    placeholder: "Password",
                    type: 'password',
                    ref: 'password',
                }),
                React.DOM.br(),
                React.DOM.input({type: 'submit', value: "Login"}));
        }
    });

    return Login;

});
