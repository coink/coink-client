define(['react', 'coins'], function(React, Coins) {

    var Landing = React.createClass({
        displayName: 'Landing',

        render: function() {
            return React.DOM.div({id: "landing"},
                React.DOM.h1({}, "COINK!!!!!!",
                    React.DOM.br({},
                        React.DOM.p({},
                            "CRYPTO CURRENCY HOLDINGS VALUE AGGREGATION MADE SIMPLE"
                        )
                    )
                )
            );
        }
    });

    return Landing;
});
