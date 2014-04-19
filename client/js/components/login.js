define(['react', 'jquery', 'router', 'models/notification', 'models/profile'],
function(React, $, router, notification, profile) {

    var Login = React.createClass({
        displayName: 'Login',

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
                    notification.success("Oink! Welcome back " + profile.getUsername() + "!");
                })
                .fail(function() {
                    notification.error("error: login-error");
                    router.navigate(router.getDefault, {trigger: true});
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
            return React.DOM.div({id: "landing", className: "small"},

                React.DOM.div({className: "row"},
                    React.DOM.div({className: "large-12 columns"},
                        React.DOM.h1({id: "logo"}, "COINK"),
                        React.DOM.h2({}, "Log in to Coink")
                    )
                ),

                React.DOM.div({className: "row"},
                    React.DOM.div({className: "small-centered large-6 medium-8 small-12 columns"},
                        React.DOM.form({onSubmit: this.handleSubmit, onEnter: this.handleSubmit},
                            React.DOM.div({className: "row"},
                                React.DOM.div({className: "large-12 columns"},
                                    React.DOM.label({}, "Username", React.DOM.input({placeholder: "Username", type: 'text', ref: 'username'}))
                                )
                            ),
                            React.DOM.div({className: "row"},
                                React.DOM.div({className: "large-7 medium-7 columns"},
                                    React.DOM.label({}, "Password", React.DOM.input({placeholder: "Password", type: 'password', ref: 'password'}))
                                ),
                                React.DOM.div({className: "medium-5 large-5 columns"},
                                    React.DOM.button({className: "radius primary large expand"}, "Login")
                                )
                            )
                        )
                    )
                )
            
            );
        }
    });

    return Login;
});
