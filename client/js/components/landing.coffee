define ['react', 'jquery', 'router', 'models/notification', 'models/profile', 'coins'],
(React, $, router, notification, profile, Coins) ->

    React.createClass
        displayName: 'Landing'

        handleSubmit: (e) ->
            e.preventDefault();
            username = this.refs.username.getDOMNode().value.trim()
            password = this.refs.password.getDOMNode().value.trim()

            if this.validateLogin username, password
                payload = {username, password}

                $.ajax "#{router.url_root}/v1/login",
                    type: 'POST',
                    data: JSON.stringify(payload),
                    processData: false,
                    contentType: 'application/json'

                .done (data) ->
                    profile.createSession data.data.token, data.data.expires, username
                    notification.success "Oink! Welcome back #{profile.getUsername()}!"

                .fail ->
                    notification.error "error: login-error"
                    router.navigate router.getDefault, trigger: true

        validateLogin: (username, password) ->
            if username.length + password.length is 0
                notification.warning "Please enter your email address and password"
            else if username.length is 0
                notification.warning "Please enter your email address"
            else if password.length is 0
                notification.warning "Please enter your password"
            else
                return true
            false

        render: ->
            Coins()
            React.DOM.div({id: "landing", className: "small"},
                React.DOM.div({id: "background"}),
                React.DOM.div({className: "row"},
                    React.DOM.div({className: "large-6 medium-8 small-12 small-centered columns"},
                        React.DOM.h1({id: "logo"}, "COINK"),
                        React.DOM.h2({}, "Coink breathes insight into your cryptocurrency portfolio")
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
                                React.DOM.div({className: "large-8 medium-7 columns"},
                                    React.DOM.label({}, "Password", React.DOM.input({placeholder: "Password", type: 'password', ref: 'password'}))
                                ),
                                React.DOM.div({className: "large-4 medium-5 columns"},
                                    React.DOM.label({className: "button-label"}, ".", React.DOM.button({className: "radius primary small expand"}, "Login"))
                                )
                            )
                        )
                    )
                ),
                React.DOM.div({className: "row"},
                    React.DOM.div({className: "large-6 medium-8 small-12 small-centered columns"},
                        React.DOM.hr()
                    )
                ),
                React.DOM.div({className: "row"},
                    React.DOM.div({className: "large-3 medium-4 small-8 small-centered columns"},
                        React.DOM.a({className: "button radius expand secondary", href: "#register"}, "Register for Coink!")
                    )
                )
            )