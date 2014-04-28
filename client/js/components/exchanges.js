define(['react', 'models/notification', 'collections/exchanges', 'collections/meta_exchanges', 'collections/balances'],
function(React, notification, Exchanges, MetaExchanges, Balances) {

    var CurrencyRow = React.createClass({
        displayName: "CurrencyRow",
        render: function() {
            return React.DOM.tr({className: "currency-row"},
                React.DOM.td({}),
                React.DOM.td({}),
                React.DOM.td({}, this.props.currency),
                React.DOM.td({}, this.props.balance),
                React.DOM.td({})
            );
        }
    });

    var ExchangeTable = React.createClass({
        displayName: "ExchangeTable",
        getInitialState: function() {
            var balances = new Balances([], {accountID: "fakeURL"});
            return {balances: balances, collapsed: false};
        },
        toggleCoins: function(e) {
            e.preventDefault();
            this.setState({collapsed: !this.state.collapsed});
        },
        handleDelete: function(e) {
            e.preventDefault();
            e.stopPropagation();

            if (!confirm("Are you sure you want to delete account " +
                this.props.exchange_account.get('accountID') + "?"))
                return;

            //This is where we destroy the entry on the server
            this.props.exchange_account.destroy({
                success: function(model, response, options) {
                    notification.success("Successfully removed exchange account " + model.get('nickname'));
                },
                error: function(model, response, options) {
                    notification.error("Unable to remove exchange account" + model.get('nickname'));
                    this.props.addModel(model);
                }.bind(this)
            });

            //Optimistically remove the row from the view
            this.props.removeModel(this.props.exchange_account);
        },
        render: function() {
            var exchange_balances = {bitcoin:"1.23000000", litecoin: "30.12344500", feathercoin: "0.00200000"};
            var exchange_account = this.props.exchange_account;
            var currency_rows  = _.map(exchange_balances, function(balance, currency) {
                return CurrencyRow({key: currency, currency: currency, balance: balance});
            }.bind(this));
            currency_rows = this.state.collapsed ? null : currency_rows;
            return React.DOM.tbody({className: "exchange-table"},
                React.DOM.tr({onClick: this.toggleCoins, className: "exchange-row"},
                    React.DOM.td({}, exchange_account.get('nickname')),
                    React.DOM.td({}, exchange_account.get('accountID')),
                    React.DOM.td({}),
                    React.DOM.td({}),
                    React.DOM.td({},
                        React.DOM.a({
                            href: '#',
                            onClick: this.handleDelete,
                        }, "Delete")
                    )
                ), currency_rows
            );
        }
    });

    var ExchangeGroup = React.createClass({
        displayName: "ExchangeGroup",
        getInitialState: function() {
            return {collapsed: false};
        },
        addAccount: function(e) {
            e.preventDefault();
            e.stopPropagation();
            alert("Added account");
        },
        toggleCollapse: function() {
            this.setState({collapsed: !this.state.collapsed});
        },
        render: function() {
            var exchange = this.props.exchange;
            console.log("this.props.exchange: " + JSON.stringify(exchange));
            var exchange_tables = _.map(this.props.exchange, function(exchange_account) {
                return ExchangeTable({exchange_account: exchange_account, addModel: this.props.addModel, removeModel: this.props.removeModel});
            }.bind(this));

            if(this.state.collapsed) {
                return React.DOM.div({className: "collapse-parent"},
                    React.DOM.div({onClick: this.toggleCollapse, className: "collapse-header"},
                        this.props.exchangeName,
                        React.DOM.a({href: "#", onClick: this.addAccount, style: {position: "absolute", right: 15}}, "Add Account")));
            } else {
                var table = _.size(exchange) == 0 ? null :
                    React.DOM.table({style: {width: "100%"}},
                        React.DOM.thead({},
                            React.DOM.tr({},
                                React.DOM.th({}, "Account Nickname"),
                                React.DOM.th({}, "Account ID"),
                                React.DOM.th({}, "Currency"),
                                React.DOM.th({}, "Balance"),
                                React.DOM.th({}, "Action")
                            )
                        ),
                        React.DOM.tbody({}, exchange_tables)
                    );
                return React.DOM.div({className: "collapse-parent"},
                    React.DOM.div({onClick: this.toggleCollapse, className: "collapse-header"},
                        this.props.exchangeName,
                        React.DOM.a({href: "#", onClick: this.addAccount, style: {position: "absolute", right: 15}}, "Add Account")),
                        table
                );
            }
        }
    });

    var ExchangesView = React.createClass({
        displayName: "Exchanges",
        getInitialState: function() {
            var exchange_accounts = new Exchanges();
            var meta_exchanges = new MetaExchanges();
            return {"exchange_accounts" : exchange_accounts, "meta_exchanges": meta_exchanges, "loaded": false};
        },
        componentWillMount: function() {
            var exchange_accounts = new Exchanges();
            exchange_accounts.comparator = 'exchangeName';
            exchange_accounts.fetch({
                success: function(collection) {
                    if(this.isMounted()) {
                        this.setState({"exchange_accounts": collection, "loaded": true});
                        console.log("Exchange accounts is " + JSON.stringify(collection));
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
                        console.log("Meta exchanges is " + JSON.stringify(collection));
                    }
                }.bind(this),
                error: function(collection) {
                    if(this.isMounted()) {
                        notification.error("AJAX error can't load exchange information");
                    }
                }.bind(this)
            });
        },
        addModel: function(model) {
            var exchange_accounts = this.state.exchange_accounts;
            exchange_accounts.add(model);
            if(this.isMounted()) {
                this.setState({"exchange_accounts": exchange_accounts});
            }
        },
        removeModel: function(model) {
            var exchange_accounts = this.state.exchange_accounts;
            exchange_accounts.remove(model);
            if(this.isMounted()) {
                this.setState({"exchange_accounts": exchange_accounts});
                console.log("Render!");
            }
        },
        render: function() {
            var content;
            var loaded = this.state.loaded;
            var exchange_accounts = this.state.exchange_accounts;
            var meta_exchanges = this.state.meta_exchanges;

            if (!loaded) {
                content = React.DOM.p({}, "Loading");
            }
            else if (exchange_accounts.isEmpty()) {
                content = React.DOM.div({}, "No exchange accounts");
            }
            else {
                var exchange_groups = exchange_accounts.groupBy('exchangeName');

                meta_exchanges.each(function(meta_exchange) {
                    var exchangesSignedUpFor = _.keys(exchange_groups);
                    if( ! _.contains(exchangesSignedUpFor, meta_exchange.get('exchangeName')) ) {
                        exchange_groups[meta_exchange.get('exchangeName')] = [];
                    }
                });

                content = _.map(exchange_groups, function(exchange, exchangeName) {
                    return ExchangeGroup({
                        exchangeName: exchangeName,
                        exchange: exchange,
                        addModel: this.addModel,
                        removeModel: this.removeModel
                    });
                }.bind(this));
            }

            return React.DOM.div({}, React.DOM.h1({}, "My Exchange Accounts"),
                content);
        }
    });

    return ExchangesView;
});
