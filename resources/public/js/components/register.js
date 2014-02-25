define(['react', 'jquery', 'router', 'models/profile'], function(React, $, router, profile) {

    var Register = React.createClass({
        handleSubmit: function(e) {
            e.preventDefault();
            var username = this.refs.username.getDOMNode().value.trim();
            var password = this.refs.password.getDOMNode().value.trim();
            var confirm = this.refs.confirm.getDOMNode().value.trim();

            if (!this.validateRegistration(username, password, confirm)){
                return;
            }

            var payload = {
                "username" : username,
                "password" : password
            };

            $.post(router.url_root + "/v1/account", JSON.stringify(payload),
                function(data, textStatus, jqXHR) {
                    this.loginAfterRegistration(payload);
                }.bind(this)).fail(
                function() {
                    console.log("error: ajax registration-error");
                    router.navigate('/', {trigger: true});
                });

        },

        loginAfterRegistration: function(payload) {
            $.post(router.url_root + "/v1/session", JSON.stringify(payload),
                function(data, textStatus, jqXHR) {
                    profile.setToken(data.data.token, data.data.expires);
                    router.navigate('wallets', {trigger: true});
                }).fail(
                function() {
                    console.log("error: ajax login-error");
                    router.navigate('login', {trigger: true});
                });
        },

        validateRegistration: function(username, password, confirm) {
            if (password != confirm) {
                console.log("error: different passwords");
                return false;
            } else if (password.length < 6) {
                console.log("error: length less than 6");
                return false;
            }
            return true;
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
