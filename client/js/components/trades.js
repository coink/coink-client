define(['react', 'models/notification', 'collections/exchange_accounts', 'collections/meta_exchanges', 'collections/trades', 'foundation', 'components/loader'],
function(React, notification, ExchangeAccounts, MetaExchanges, Trades, Foundation, Loader) {

    var ExchangeSelector = React.createClass({
        render: function() {
            var exchangeOptions = this.props.exchange_accounts.map( function(exchange_account) {
                var nickname = exchange_account.get('nickname') || "no nickname";
                return React.DOM.option({value: exchange_account.get('accountID')}, exchange_account.get('exchangeName') + ": " + nickname);
            });
            return React.DOM.select({onChange: this.props.onChange}, exchangeOptions);
        }
    });

    var TradeRow = React.createClass({
        displayName: "TradeRow",
        render: function() {
            var trade = this.props.trade;
            return React.DOM.tr({},
                React.DOM.td({}, trade.get('tradeType') + " " + trade.get('baseCurrency')
                    + "/" + trade.get('counterCurrency')),
                React.DOM.td({}, trade.get('price') + " " + trade.get('counterCurrency')),
                React.DOM.td({}, trade.get('quantity') + " " + trade.get('baseCurrency')),
                React.DOM.td({}, trade.get('fee') + " " + trade.get('counterCurrency'))
            );
        }
    });

    var ExchangeAccountTableBody = React.createClass({
        displayName: "ExchangeAccountTableBody",
        getInitialState: function() {
            var trades = new Trades();
            return {trades: trades};
        },
        componentWillMount: function() {
            var trades = new Trades([], {accountID: this.props.exchange_account.get('accountID')});
            trades.fetch({
                success: function(collection) {
                    if(this.isMounted()) {
                        this.setState({trades: collection});
                    }
                }.bind(this),
                error: function(collection) {
                    if(this.isMounted()) {
                        notification.error("AJAX error can't load exchange accounts");
                    }
                }.bind(this)
            });
        },
        render: function() {
            var trades = this.state.trades;
            var exchange_account = this.props.exchange_account;
            var className = this.props.isCurrent ? "" : "hide";

            var tradeRows = trades.map( function(trade) {
                return TradeRow({trade: trade});
            }.bind(this));
            return React.DOM.tbody({className: className},
                tradeRows
            );
        }
    });

    var TradeTable = React.createClass({
        render: function() {
            var exchange_accounts = this.props.exchange_accounts;
            var exchange_account_table_bodies = exchange_accounts.map( function(exchange_account) {
                var isCurrent = exchange_account.get('accountID') === this.props.current_account.get('accountID');
                return ExchangeAccountTableBody({exchange_account: exchange_account, isCurrent: isCurrent});
            }.bind(this));
            return React.DOM.table({style: {width: "100%"}},
                React.DOM.thead({},
                    React.DOM.tr({},
                        React.DOM.th({}, "Action"),
                        React.DOM.th({}, "Price"),
                        React.DOM.th({}, "Quantity"),
                        React.DOM.th({}, "Fee")
                    )
                ),
                exchange_account_table_bodies
            );
        }
    });

    var TradesView = React.createClass({
        displayName: "Trades",
        changeAccount: function(e) {
            var current_account = this.state.exchange_accounts.findWhere({accountID: parseInt(e.target.value, 10)});
            this.setState({current_account: current_account});
        },
        getInitialState: function() {
            var exchange_accounts = new ExchangeAccounts();
            var meta_exchanges = new MetaExchanges();
            return {"exchange_accounts" : exchange_accounts, "meta_exchanges": meta_exchanges, "loaded": false, "current_account": null};
        },
        componentWillMount: function() {
            var exchange_accounts = new ExchangeAccounts();
            exchange_accounts.comparator = 'exchangeName';
            exchange_accounts.fetch({
                success: function(collection) {
                    if(this.isMounted()) {
                        this.setState({"exchange_accounts": collection, "loaded": true, "current_account": collection.at(0)});
                    }
                }.bind(this),
                error: function(collection) {
                    if(this.isMounted()) {
                        this.setState({"loaded": true});
                        notification.error("AJAX error can't load exchange accounts");
                    }
                }.bind(this)
            });

            var meta_exchanges = new MetaExchanges();
            meta_exchanges.comparator = 'exchangeName';
            meta_exchanges.fetch({
                success: function(collection) {
                    if(this.isMounted()) {
                        this.setState({"meta_exchanges": collection});
                    }
                }.bind(this),
                error: function(collection) {
                    if(this.isMounted()) {
                        notification.error("AJAX error can't load exchange information");
                    }
                }.bind(this)
            });
        },
        render: function() {
            var content;
            var loaded = this.state.loaded;
            var exchange_accounts = this.state.exchange_accounts;
            var meta_exchanges = this.state.meta_exchanges;

            if (!loaded) {
                content = new Loader();
            }
            else if (exchange_accounts.isEmpty()) {
                content = React.DOM.h3({}, "Please add an account. Oink oink");
            }
            else {
                var exchangeSelector = ExchangeSelector({exchange_accounts: exchange_accounts, onChange: this.changeAccount});
                var tradeTable = TradeTable({current_account: this.state.current_account, exchange_accounts: exchange_accounts});

                content = React.DOM.div({},
                    React.DOM.div({}, "Trade history for: "),
                    exchangeSelector,
                    tradeTable
                );
            }

            return React.DOM.div({}, React.DOM.h1({}, "My Trades"),
                content);
        }
    });

    return TradesView;
});
