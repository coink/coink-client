define(['react', 'jquery', 'router', 'models/notification', 'models/profile'],
function(React, $, router, notification, profile) {

    var Login = React.createClass({
        handleSubmit: function(e) {
            e.preventDefault();
            var username = this.refs.username.getDOMNode().value.trim();
            var password = this.refs.password.getDOMNode().value.trim();

            if(this.validateLogin(username, password)) {
                var payload = {
                    "username" : username,
                    "password" : password
                };

                $.ajax(router.url_root + "/v1/login", {
                    type: 'POST',
                    data: JSON.stringify(payload),
                    processData: false,
                    contentType: 'application/json'
                })
                .done(function(data) {
                    profile.createSession(data.data.token, data.data.expires, username);
                    notification.clearNotification();
                    router.navigate('wallets', {trigger: true});
                })
                .fail(function() {
                    notification.updateNotification("error: login-error", "error");
                    router.navigate('login', {trigger: true});
                });
            }
        },

        validateLogin: function(username, password) {
            if ((username + password).length == 0)
                notification.updateNotification("Please enter your email address and password", "warn");
            else if (username.length == 0)
                notification.updateNotification("Please enter your email address", "warn");
            else if (password.length == 0)
                notification.updateNotification("Please enter your password", "warn");
            else
                return true;
            return false;
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
