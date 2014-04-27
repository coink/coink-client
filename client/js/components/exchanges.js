define(['react', 'models/notification', 'collections/exchanges', 'collections/meta_exchanges'],
function(React, notification, Exchanges, MetaExchanges) {

    var ExchangeRow = React.createClass({
        displayName: "ExchangeRow",
        toggleCoins: function(e) {
            e.preventDefault();
            alert("Toggle Coins");
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
            var exchange_account = this.props.exchange_account;
            return React.DOM.tr({onClick: this.toggleCoins, className: "exchange-row"},
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
            );
        }
    });

    var ExchangeGroup = React.createClass({
        displayName: "ExchangeGroup",
        getInitialState: function() {
            return {collapsed: false};
        },

        toggleCollapse: function() {
            this.setState({collapsed: !this.state.collapsed});
        },
        render: function() {
            var exchange = this.props.exchange;
            var exchange_rows = _.map(this.props.exchange, function(exchange_account) {
                return ExchangeRow({exchange_account: exchange_account, addModel: this.props.addModel, removeModel: this.props.removeModel});
            }.bind(this));

            if(this.state.collapsed) {
                return React.DOM.div({className: "collapse-parent"},
                    React.DOM.div({onClick: this.toggleCollapse, className: "collapse-header"},
                        this.props.exchangeName,
                        React.DOM.span({style: {position: "absolute", right: 15}}, "Add")));
            } else {
                return React.DOM.div({className: "collapse-parent"},
                    React.DOM.div({onClick: this.toggleCollapse, className: "collapse-header"},
                        this.props.exchangeName,
                        React.DOM.span({style: {position: "absolute", right: 15}}, "Add")),
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
                        React.DOM.tbody({}, exchange_rows)
                    )
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
                console.log("exchange_groups is: " + JSON.stringify(exchange_groups));

                content = _.map(exchange_groups, function(exchange, exchangeName) {
                    console.log("Group for " + exchangeName + " is " + JSON.stringify(exchange));
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
