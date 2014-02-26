define(['react', 'jquery', 'router', 'models/profile', 'utils'],
function(React, $, router, profile, Utils) {

    var Login = React.createClass({
        handleSubmit: function(e) {
            e.preventDefault();

            var username = this.refs.username.getDOMNode().value.trim();
            var password = this.refs.password.getDOMNode().value.trim();

            var payload = {
                "username" : username,
                "password" : password
            };

            if (this.validateLogin(username, password)){
                $.post(router.url_root + "/v1/session", JSON.stringify(payload),
                    function(data, textStatus, jqXHR) {
                        profile.createSession(data.data.token, data.data.expires, username);
                        Utils.clearNotification();
                        router.navigate('wallets', {trigger: true});
                    }).fail(
                    function() {
                        Utils.updateNotification("error: login-error");
                        router.navigate('login', {trigger: true});
                    });
            }
        },

        validateLogin: function(username, password) {
            if ((username + password).length == 0)
              Utils.updateNotification("error: please enter your email address and password");
            else if (username.length == 0)
              Utils.updateNotification("error: please enter your email address");
            else if (password.length == 0)
              Utils.updateNotification("error: please enter your password");
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
