define ['react', 'coins'], (React, Coins) ->

    React.createClass
        displayName: 'Landing'
        render: ->
            Coins()
            React.DOM.div({id: "landing"},
                React.DOM.div({id: "background"}),
                React.DOM.div({className: "row"},
                    React.DOM.div({className: "large-12 columns"},
                        React.DOM.h1({id: "logo"}, "COINK"),
                        React.DOM.h2("Coink breathes insight into your cryptocurrency portfolio")
                    )
                ),
                React.DOM.div({className: "row small-centered"},
                    React.DOM.div({className: "large-2 medium-3 small-6 medium-push-3 large-push-4 columns"},
                        React.DOM.a({className: "button radius expand large primary", href: "#register"}, "Register")
                    ),
                    React.DOM.div({className: "large-2 medium-3 small-6 medium-pull-3 large-pull-4 columns"},
                        React.DOM.a({className: "button radius expand large secondary", href: "#login"}, "Log In")
                    )
                )
            )
