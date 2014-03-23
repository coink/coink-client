define(['react', 'jquery', 'router', 'models/notification', 'models/profile'],
function(React, $, router, notification, profile) {

    var Register = React.createClass({
        DisplayName: 'Register',
        handleSubmit: function(e) {
            e.preventDefault();
            var username = this.refs.username.getDOMNode().value.trim();
            var password = this.refs.password.getDOMNode().value.trim();
            var email = this.refs.email.getDOMNode().value.trim();
            var confirm = this.refs.confirm.getDOMNode().value.trim();

            if (this.validateRegistration(username, password, confirm)){
                var payload = {
                    'username' : username,
                    'email' : email,
                    'password' : password
                };

                $.ajax(router.url_root + "/v1/account", {
                    type: 'POST',
                    data: JSON.stringify(payload),
                    processData: false,
                    contentType: 'application/json'
                }).done(function(data, textStatus, jqXHR) {
                    this.loginAfterRegistration(payload);
                }.bind(this))
                .fail(
                    function() {
                        notification.updateNotification("error: ajax-registration-error", "error");
                        router.navigate('/', {trigger: true});
                    }
                );
            }

        },

        validateRegistration: function(username, password, confirm) {
            if ((username + password + confirm).length == 0)
                notification.updateNotification("error: please fill out the form", "warn");
            else if (username.length == 0)
                notification.updateNotification("error: please enter a username", "warn");
            else if (password.length == 0)
                notification.updateNotification("error: please enter a password", "warn");
            else if (password.length < 6)
                notification.updateNotification("error: password must be at least six characters", "warn");
            else if (confirm.length == 0)
                notification.updateNotification("error: please confirm your password", "warn");
            else if (password != confirm)
                notification.updateNotification("error: passwords do not match", "warn");
            else
                return true;
            return false;
        },

        loginAfterRegistration: function(payload) {
            $.post(router.url_root + "/v1/login", JSON.stringify(payload),
                function(data, textStatus, jqXHR) {
                    profile.createSession(data.data.token, data.data.expires, payload['username']);
                    notification.clearNotification();
                    router.navigate('wallets', {trigger: true});
                }).fail(
                function() {
                    notification.updateNotification("error: ajax-login-error", "error");
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
                React.DOM.label({htmlFor: 'email'}),
                React.DOM.input({
                    placeholder: "Email",
                    type: 'email',
                    ref: 'email',
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
