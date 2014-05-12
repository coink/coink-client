define(['react', 'collections/exchange_accounts', 'components/loader',
        'models/notification', 'models/coin', 'collections/coins'],
function(React, ExchangeAccounts, Loader, notification, Coin, Coins) {

    var AllView = React.createClass({

        displayName: "AllView",

        getInitialState: function() {
            return {
                loading: true,
                coins: new Coins()
            };
        },

        retrieveBalances: function(exchangeAccounts) {
            exchangeAccounts.map(function(account) {
                $.ajax(urlRoot + "/v1/exchanges/" +
                    account.get('accountID') + "/profits", {
                    type: 'GET',
                    contentType: 'application/json'
                })
                .done(function(data) {
                    _.each(data['data'], function(n){console.log(_.map(n, function(m) { return m;}));})
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
            var loading = this.state.loading;
            var content;
            if(!loading) {
                content = new Loader();
            } else {
                content = new DataTable({coins: this.state.coins});
            }
            return React.DOM.div({}, React.DOM.h1({}, "All Coins"), content);
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
