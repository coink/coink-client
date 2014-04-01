define(['react', 'jquery', 'router', 'models/notification', 'models/profile'],
function(React, $, router, notification, profile) {

    var Login = React.createClass({
        DisplayName: 'Login',
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
                    notification.success("Successfully logged in " + profile.getUsername());
                    router.setDefaultRoute('wallets');
                    router.navigate('wallets', {trigger: true});
                })
                .fail(function() {
                    notification.error("error: login-error");
                    router.setDefaultRoute('login');
                    router.navigate('login', {trigger: true});
                });
            }
        },

        validateLogin: function(username, password) {
            if ((username + password).length == 0)
                notification.warning("Please enter your email address and password");
            else if (username.length == 0)
                notification.warning("Please enter your email address");
            else if (password.length == 0)
                notification.warning("Please enter your password");
            else
                return true;
            return false;
        },

        render: function() {
            return React.DOM.form({onSubmit: this.handleSubmit},
                React.DOM.h1({}, "Login"),
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
