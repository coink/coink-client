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
                        notification.error("error: ajax-registration-error");
                        router.navigate('/', {trigger: true});
                    }
                );
            }

        },

        validateRegistration: function(username, password, confirm) {
            if ((username + password + confirm).length == 0)
                notification.warning("Please fill out the form");
            else if (username.length == 0)
                notification.warning("Please enter a username");
            else if (password.length == 0)
                notification.warning("Please enter a password");
            else if (password.length < 6)
                notification.warning("Password must be at least six characters");
            else if (confirm.length == 0)
                notification.warning("Please confirm your password");
            else if (password != confirm)
                notification.warning("Passwords do not match");
            else
                return true;
            return false;
        },

        loginAfterRegistration: function(payload) {
            $.post(router.url_root + "/v1/login", JSON.stringify(payload),
                function(data, textStatus, jqXHR) {
                    profile.createSession(data.data.token, data.data.expires, payload['username']);
                    router.navigate('wallets', {trigger: true});
                    notification.success("Successfully registered username " + profile.getUsername());
                }).fail(
                function() {
                    notification.error("error: ajax-login-error");
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
