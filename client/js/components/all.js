define(['react', 'collections/exchange_accounts', 'components/loader',
        'models/notification', 'models/coin', 'collections/coins'],
function(React, ExchangeAccounts, Loader, notification, Coin, Coins) {

    var CoinRow = React.createClass({
        displayName: "CoinRow",
        render: function() {
            return React.DOM.tr({},
                React.DOM.td({}, this.props.coin.get("ticker")),
                React.DOM.td({}, this.props.coin.get("name")),
                React.DOM.td({}, this.props.coin.get("quantity")),
                React.DOM.td({}, this.props.coin.get("price")),
                React.DOM.td({}, this.props.coin.get("totalCost")),
                React.DOM.td({}, this.props.coin.get("marketValue")),
                React.DOM.td({}, this.props.coin.get("marketValue")/this.props.coin.get("quantity")))
        }
    });

    var AllView = React.createClass({

        displayName: "AllView",

        getInitialState: function() {
            return {
                loading: true,
                coins: new Coins()
            };
        },

        coinExists: function(data) {
            var model = this.state.coins.findWhere({name: data})
            if(model !== undefined) {
                return true;
            }
            return false;
        },

        constructCoin: function(data) {
            var quantity = 0;
            var adjustedGain = 0;
            var adjustedGainPercent = 0;
            var adjustedCost = 0;
            _.reduce((_.map(data['trades'], function(n) { return n['quantity'];})), function(m, n) {quantity = +m + +n});
            _.reduce((_.map(data['trades'], function(n) { return n['adjustedGain'];})), function(m, n) {adjustedGain = +m + +n});
            _.reduce((_.map(data['trades'], function(n) { return n['adjustedGainPercent'];})), function(m, n) {adjustedGainPercent = +m + +n});
            _.reduce((_.map(data['trades'], function(n) { return n['adjustedCost'];})), function(m, n) {adjustedCost = +m + +n});
            var adjustedPrice = adjustedCost / quantity;
            var coin = new Coin({
                name: data['baseCurrency'],
                quantity: quantity,
                price: adjustedPrice,
                totalCost: adjustedCost,
                gain: adjustedGain,
                gainPercent: adjustedGainPercent
            });
            return coin;
        },

        mergeCoins: function(coin) {
            var model = this.state.coins.findWhere({name: coin.get("name")});
            model.mergeCoins(coin);
        },

        retrieveBalances: function(exchangeAccounts) {
            exchangeAccounts.map(function(account) {
                $.ajax(urlRoot + "/v1/exchanges/" +
                    account.get('accountID') + "/profits", {
                    type: 'GET',
                    contentType: 'application/json'
                })
                .done(function(data) {
                    this.setState({loading: false});
                    _.each(data['data'], function(data){
                        var coin = this.constructCoin(data);
                        if(this.coinExists(data['baseCurrency'])) {
                            this.mergeCoins(coin)
                        } else {
                            this.state.coins.add(coin);
                        }
                    }.bind(this))
                }.bind(this))
                .fail(function() {
                    console.log("balance retrieval error");
                });
            }.bind(this))
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
            if(loading) {
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
            debugger;
            var rows = _.map(this.props.coins.models, function(coin) {
                return CoinRow({coin: coin});
            });
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
