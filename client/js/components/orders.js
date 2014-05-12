define(['react', 'models/notification', 'collections/exchange_accounts', 'collections/meta_exchanges', 'collections/orders', 'foundation', 'components/loader'],
function(React, notification, ExchangeAccounts, MetaExchanges, Orders, Foundation, Loader) {

    var ExchangeSelector = React.createClass({
        render: function() {
            var exchangeOptions = this.props.exchange_accounts.map( function(exchange_account) {
                var nickname = exchange_account.get('nickname') || "no nickname";
                return React.DOM.option({value: exchange_account.get('accountID')}, exchange_account.get('exchangeName') + ": " + nickname);
            });
            return React.DOM.select({onChange: this.props.onChange}, exchangeOptions);
        }
    });

    var OrderRow = React.createClass({
        displayName: "OrderRow",
        render: function() {
            var order = this.props.order;
            return React.DOM.tr({},
                React.DOM.td({}, order.get('tradeType') + " " + order.get('baseCurrency')
                    + "/" + order.get('counterCurrency')),
                React.DOM.td({}, order.get('price') + " " + order.get('counterCurrency')),
                React.DOM.td({}, order.get('quantity') + " " + order.get('baseCurrency'))
            );
        }
    });

    var ExchangeAccountTableBody = React.createClass({
        displayName: "ExchangeAccountTableBody",
        getInitialState: function() {
            var orders = new Orders();
            return {orders: orders};
        },
        componentWillMount: function() {
            var orders = new Orders([], {accountID: this.props.exchange_account.get('accountID')});
            orders.fetch({
                success: function(collection) {
                    if(this.isMounted()) {
                        this.setState({orders: collection});
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
            var orders = this.state.orders;
            var exchange_account = this.props.exchange_account;
            var className = this.props.isCurrent ? "" : "hide";

            var orderRows = orders.map( function(order) {
                return OrderRow({order: order});
            }.bind(this));
            return React.DOM.tbody({className: className},
                orderRows
            );
        }
    });

    var OrderTable = React.createClass({
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
                        React.DOM.th({}, "Quantity")
                    )
                ),
                exchange_account_table_bodies
            );
        }
    });

    var OrdersView = React.createClass({
        displayName: "Orders",
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
                var orderTable = OrderTable({current_account: this.state.current_account, exchange_accounts: exchange_accounts});

                content = React.DOM.div({},
                    React.DOM.div({}, "Order history for: "),
                    exchangeSelector,
                    orderTable
                );
            }

            return React.DOM.div({}, React.DOM.h1({}, "My Orders"),
                content);
        }
    });

    return OrdersView;
});
