define(['react', 'jquery', 'router', 'utils', 'models/profile'],
function(React, $, router, Utils, profile) {

    var Register = React.createClass({
        handleSubmit: function(e) {
            e.preventDefault();
            var username = this.refs.username.getDOMNode().value.trim();
            var password = this.refs.password.getDOMNode().value.trim();
            var confirm = this.refs.confirm.getDOMNode().value.trim();

            if (this.validateRegistration(username, password, confirm)){
                var payload = {
                    "username" : username,
                    "password" : password
                };

                $.post(router.url_root + "/v1/account", JSON.stringify(payload),
                    function(data, textStatus, jqXHR) {
                        this.loginAfterRegistration(payload);
                    }.bind(this)).fail(
                    function() {
                        Utils.updateNotification("error: ajax-registration-error");
                        router.navigate('/', {trigger: true});
                    }
                );
            }

        },

        validateRegistration: function(username, password, confirm) {
            if ((username + password + confirm).length == 0)
              Utils.updateNotification("error: please fill out the form");
            else if (username.length == 0)
              Utils.updateNotification("error: please enter a username");
            else if (password.length == 0)
              Utils.updateNotification("error: please enter a password");
            else if (password.length < 6)
              Utils.updateNotification("error: password must be at least six characters");
            else if (confirm.length == 0)
              Utils.updateNotification("error: please confirm your password");
            else if (password != confirm)
              Utils.updateNotification("error: passwords do not match");
            else
                return true;
            return false;
        },

        loginAfterRegistration: function(payload) {
            $.post(router.url_root + "/v1/session", JSON.stringify(payload),
                function(data, textStatus, jqXHR) {
                    profile.setToken(data.data.token, data.data.expires);
                    Utils.clearNotification();
                    router.navigate('wallets', {trigger: true});
                }).fail(
                function() {
                    Utils.updateNotification("error: ajax-login-error");
                    router.navigate('login', {trigger: true});
                });
        },


        render: function() {
            return React.DOM.form({
                    onEnter: this.handleSubmit,
                    onSubmit: this.handleSubmit
                },
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
                React.DOM.label({htmlFor: 'confirm'}),
                React.DOM.input({
                    placeholder: "Confirm",
                    type: 'password',
                    ref: 'confirm',
                }),
                React.DOM.br(),
                React.DOM.input({type: 'submit', value: "Login"}));
        }
    });

    return Register;

});
