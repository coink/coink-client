define(['react', 'jquery', 'utils'],
function(React, $, Utils) {

    var Login = React.createClass({
        handleSubmit: function(e) {
            e.preventDefault();

            var username = this.refs.username.getDOMNode().value.trim();
            var password = this.refs.password.getDOMNode().value.trim();

            if ((username + password).length == 0)
                Utils.updateNotification("error: please enter your email address and password");
            else if (username.length == 0)
                Utils.updateNotification("error: please enter your email address");
            else if (password.length == 0)
                Utils.updateNotification("error: please enter your password");
            else
                Utils.login(username, password);
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
