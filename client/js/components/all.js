define(['react', 'collections/exchange_accounts', 'collections/coins',
        'components/loader', 'models/notification', 'models/coin'],
function(React, ExchangeAccounts, Coins, Loader, notification, Coin) {

    var AllView = React.createClass({

        displayName: "AllView",

        getInitialState: function() {
            return {coins : new Coins()};
        },

        retrieveBalances: function(exchangeAccounts) {
            exchangeAccounts.map(function(account) {

                $.ajax(urlRoot + "/v1/exchanges/" +
                    account.get('accountID') + "/balances", {
                    type: 'GET',
                    contentType: 'application/json'
                })
                .done(function(data) {
                    _.each(data['data'], function(n,c){console.log(n + c);})
                })
                .fail(function() {
                    console.log("balance retrieval error");
                });
            })
        },

        componentWillMount: function() {
            var exchangeAccounts = new ExchangeAccounts();
            exchangeAccounts.fetch({
                wait: true,
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
            var content = DataTable({});
            if(!loaded) {
                content = React.DOM.div({}, React.DOM.h1({}, "All"), new Loader());
            }
            return content;
        }
});

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

    return AllView;
});
