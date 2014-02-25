define(['react', 'jquery', 'router', 'models/profile'], function(React, $, router, profile) {

    var Register = React.createClass({
        handleSubmit: function(e) {
            e.preventDefault();
            var username = this.refs.username.getDOMNode().value.trim();
            var passOriginal = this.refs.password.getDOMNode().value.trim();
            var passConfirm = this.refs.confirm.getDOMNode().value.trim();

            var payload = {
                "username" : username,
                "password" : passOriginal
            };

            $.post(router.url_root + "/v1/account", JSON.stringify(payload),
                function(data, textStatus, jqXHR) {
                    router.navigate('wallets', {trigger: true});
                }).fail(
                function() {
                    console.log("registration-error");
                    router.navigate('/', {trigger: true});
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
