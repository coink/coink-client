define(['react', 'models/notification', 'collections/exchange_accounts', 'collections/meta_exchanges', 'collections/balances', 'models/exchange_account', 'foundation', 'components/loader'],
function(React, notification, ExchangeAccounts, MetaExchanges, Balances, ExchangeAccount, Foundation, Loader) {

    var AddAccountForm = React.createClass({
        displayName: "AddAccountForm",
        getInitialState: function() {
            return {nickname: ''};
        },
        setField: function(e) {
            var map = {};
            map[e.target.id] = e.target.value;
            this.setState(map);
        },
        handleSubmit: function(e) {
            e.preventDefault();

            //Fill map with the attributes to set in the model
            var map = {};
            map.exchangeName = this.props.meta_exchange.get('exchangeName');
            map.nickname = this.state.nickname;
            map.credentials = {};
            $.each(this.props.meta_exchange.get('requiredFields'), function(index, field) {
                map.credentials[field.machineName] = this.state[field.machineName];
            }.bind(this));

            //Only create and save the model if the input is valid
            if(this.validateAccount(map.credentials, map.nickname)) {
                e.target.reset();
                this.props.toggleAddAccount();
                var model = new ExchangeAccount(map);

                //This is where we save the entry on the server
                model.save({}, {
                    success: function(model, response, options) {
                        notification.success("Successfully added an exchange account " + model.get('nickname'));
                    },
                    error: function(model, response, options) {
                        notification.error("Unable to add exchange account " + model.get('nickname'));
                        this.props.removeModel(model);
                    }.bind(this)
                });

                //Optimistically add the entry to the view
                this.props.addModel(model);
            }
        },
        validateAccount: function(credentials, nickname) {
            var errorArray = [];

            $.each(credentials, function(key, value) {
                if(value === null || value.length === 0) {
                    errorArray.push(key);
                }
            });

            if(nickname === null || nickname.length === 0) {
                errorArray.push("nickname");
            }

            if(errorArray.length === 0) {
                return true;
            }
            else {
                notification.warning(this.validationError(errorArray));
                return false;
            }
        },
        validationError: function(errorArray) {
            var message = "Please enter your ";
            if(errorArray.length == 1) {
                return message.concat(errorArray[0]);
            }
            else if(errorArray.length == 2) {
                return message.concat(errorArray[0] + " and " + errorArray[1]);
            } else {
                var end = errorArray.pop();
                return message.concat(errorArray.join(', ') + ", and " + end);
            }
        },
        render: function() {
            var meta_exchange = this.props.meta_exchange;
            var fields = meta_exchange.get('requiredFields').map(function(field) {
                return React.DOM.label({key: field.machineName, htmlFor: field.machineName, className: "large-3 medium-3 small-6 columns"},
                    React.DOM.span({}, field.displayName),
                    React.DOM.input({
                        type: 'text',
                        id: field.machineName,
                        className: 'exchange-field',
                        onChange: this.setField
                    })
                );
            }.bind(this));

            return React.DOM.form({onSubmit: this.handleSubmit},
                fields,
                React.DOM.div({},
                    React.DOM.label({htmlFor: 'nickname'},
                        React.DOM.span({}, 'Nickname'),
                        React.DOM.input({
                            type: 'text',
                            id: 'nickname',
                            className: 'exchange-field',
                            onChange: this.setField
                        })
                    )
                ),
                React.DOM.div({},
                    React.DOM.label({htmlFor: 'submit'},
                        React.DOM.span(),
                        React.DOM.input({type: 'submit', value: "Add"})
                    )
                )
            );
        }
    });

    var AccountRow = React.createClass({
        displayName: "AccountRow",
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
            return React.DOM.tr({onClick: this.props.toggleCoins, className: "account-row"},
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

    var ExchangeTableBody = React.createClass({
        displayName: "ExchangeTableBody",
        getInitialState: function() {
            var balances = new Balances();
            return {balances: balances, collapsed: false};
        },
        componentWillMount: function() {
            var balances = new Balances([], {accountID: this.props.exchange_account.get('accountID')});
            balances.fetch({
                success: function(collection) {
                    if(this.isMounted()) {
                        this.setState({balances: collection, "loaded": true});
                    }
                }.bind(this),
                error: function(collection) {
                    if(this.isMounted()) {
                        this.setState({"loaded": true});
                        notification.error("AJAX error can't load exchange accounts");
                    }
                }.bind(this)
            });
        },
        toggleCoins: function(e) {
            e.preventDefault();
            this.setState({collapsed: !this.state.collapsed});
        },
        render: function() {
            var exchange_balances = this.state.balances;
            var exchange_account = this.props.exchange_account;
            var currency_rows = null;
            if( exchange_balances.length > 0) {
                var keyValues = exchange_balances.at(0).pairs();
                currency_rows  = _.map(keyValues, function(keyValue) {
                    return CurrencyRow({key: keyValue[0], currency: keyValue[0], balance: keyValue[1]});
                }.bind(this));
            }
            currency_rows = this.state.collapsed ? null : currency_rows;
            return React.DOM.tbody({className: "exchange-table-body"},
                AccountRow({exchange_account: exchange_account, toggleCoins: this.toggleCoins, addModel: this.props.addModel, removeModel: this.props.removeModel}),
                currency_rows
            );
        }
    });

    var ExchangeGroup = React.createClass({
        displayName: "ExchangeGroup",
        getInitialState: function() {
            return {collapsed: false, hideAddAccountForm: true};
        },
        handleAddAccount: function(e) {
            e.preventDefault();
            e.stopPropagation();
            this.setState({hideAddAccountForm: !this.state.hideAddAccountForm});
        },
        toggleAddAccount: function() {
            this.setState({hideAddAccountForm: !this.state.hideAddAccountForm});
        },
        toggleCollapse: function() {
            var collapsed = !_.isEmpty(this.props.exchange) && !this.state.collapsed;
            this.setState({collapsed: collapsed});
        },
        render: function() {
            var exchange = this.props.exchange;
            var exchangeTableBodies = _.map(this.props.exchange, function(exchange_account) {
                return ExchangeTableBody({exchange_account: exchange_account, addModel: this.props.addModel, removeModel: this.props.removeModel});
            }.bind(this));

            var addAccountForm = this.state.hideAddAccountForm ? null : AddAccountForm({meta_exchange: this.props.meta_exchange, addModel: this.props.addModel, exchangeName: this.props.exchangeName, toggleAddAccount: this.toggleAddAccount});

            var table = null;
            var className = this.state.collapsed ? "hide" : "";
            table = _.size(exchange) === 0 ? null :
                React.DOM.table({className: className, style: {width: "100%"}},
                    React.DOM.thead({},
                        React.DOM.tr({},
                            React.DOM.th({}, "Account Nickname"),
                            React.DOM.th({}, "Account ID"),
                            React.DOM.th({}, "Currency"),
                            React.DOM.th({}, "Balance"),
                            React.DOM.th({}, "Action")
                        )
                    ),
                    exchangeTableBodies
                );
            return React.DOM.div({className: "collapse-parent"},
                React.DOM.div({onClick: this.toggleCollapse, className: "collapse-header"},
                    this.props.exchangeName,
                    React.DOM.a({href: "#", onClick: this.handleAddAccount, style: {position: "absolute", right: 15}}, "Add Account")
                ),
                table,
                addAccountForm
            );
        }
    });

    var ExchangesView = React.createClass({
        displayName: "Exchanges",
        getInitialState: function() {
            var exchange_accounts = new ExchangeAccounts();
            var meta_exchanges = new MetaExchanges();
            return {"exchange_accounts" : exchange_accounts, "meta_exchanges": meta_exchanges, "loaded": false};
        },
        componentWillMount: function() {
            var exchange_accounts = new ExchangeAccounts();
            exchange_accounts.comparator = 'exchangeName';
            exchange_accounts.fetch({
                success: function(collection) {
                    if(this.isMounted()) {
                        this.setState({"exchange_accounts": collection, "loaded": true});
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
            }
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
                content = meta_exchanges.map(function(meta_exchange) {
                    return ExchangeGroup({
                        exchangeName: meta_exchange.get('exchangeName'),
                        exchange: [],
                        meta_exchange: meta_exchange,
                        addModel: this.addModel,
                        removeModel: this.removeModel
                    });
                }.bind(this));
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
                        meta_exchange: meta_exchanges.findWhere({exchangeName: exchangeName}),
                        addModel: this.addModel,
                        removeModel: this.removeModel
                    });
                }.bind(this));
            }

            return React.DOM.div({}, React.DOM.h1({}, "My Exchanges"),
                content);
        }
    });

    return ExchangesView;
});
