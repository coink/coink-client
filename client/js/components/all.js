define(['react', 'collections/exchange_accounts', 'collections/balances', 'components/loader', 'models/notification'], function(React, ExchangeAccounts, Balances, Loader, notification) {
    
    var DataTable = React.createClass({
        displayName: "DataTable",
        render: function() {
            /*
            var rows = ___.map(function(coin) {
                return CoinRow({});
            });
            */
            var rows = React.DOM.tr({});
            return React.DOM.table({}, 
                React.DOM.thead({},
                    React.DOM.tr({},
                        React.DOM.td({}, "Ticker"),
                        React.DOM.td({}, "Name"),
                        React.DOM.td({}, "Quantity"),
                        React.DOM.td({}, "Cost per coin (bitcoin)"),
                        React.DOM.td({}, "Total cost"),
                        React.DOM.td({}, "Current sell value"),
                        React.DOM.td({}, "Last price per coin")
                    )
                ),
                React.DOM.tbody({},
                    rows
                )
            );
        }
    });

    // exchange accounts --> balances
    var allBalances = {};

    var AllView = React.createClass({
        displayName: "AllView",
        retrieveBalances: function(exchangeAccounts) {
            exchangeAccounts.forEach( function(exchangeAccount) {
                var balances = new Balances([], {accountID: exchangeAccount.get('accountID')});
                balances.fetch({
                    success: function(collection) {
                        if(this.isMounted()) {
                            collection.forEach( function(d) {
                                console.log(d);
                            });
                        }
                    }.bind(this)
                });
            }.bind(this));
        },
        componentWillMount: function() {
            var exchangeAccounts = new ExchangeAccounts();
            exchangeAccounts.fetch({
                success: function(collection) {
                    if(this.isMounted()) {
                        console.log("Go and retrieve balances");
                        this.retrieveBalances(collection);
                        this.setState({exchangeAccounts: collection});
                    }
                }.bind(this),
                error: function(collection) {
                    notification.error("AJAX error: Can't load account data");
                }
            });
        },
        render: function() {

            var loaded = true;
            var content = React.DOM.div({}, "HI");
           if(!loaded) {
               return React.DOM.div({}, React.DOM.h1({}, "All"), new Loader());
           }
           else {
                return DataTable({});
           }
        }
    });

    return AllView;
});
