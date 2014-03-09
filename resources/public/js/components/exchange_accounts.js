define(['react', 'collections/exchange_accounts'],
    function(React, ExchangeAccounts, Wallet) {

    var ExchangeAccounts = React.createClass({
        render: function() {
            return React.DOM.div({}, React.DOM.h1({}, "Exchanges"));
        }
    });

    return ExchangeAccounts;
});

