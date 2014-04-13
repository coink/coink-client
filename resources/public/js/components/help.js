define(['react'], function(React) {

        var Help = React.createClass({
            displayName: 'Help',

            render: function() {
                return React.DOM.div({},
                    React.DOM.h1({}, "Help"),
                    React.DOM.p({}, "Use the side navigation to switch between viewing your wallet balances and exchange balances.")
                );
            }
        });

    return Help;
});
