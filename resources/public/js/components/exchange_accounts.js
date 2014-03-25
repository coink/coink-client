define(['react', 'collections/exchange_accounts', 'models/exchange_account', 'collections/meta_exchanges'],
function(React, ExchangeAccounts, ExchangeAccount, MetaExchanges) {

    var AddExchangeAccountFormFields = React.createClass({
        getInitialState: function() {
            return {nickname: ''}
        },
        componentWillReceiveProps: function(nextProps) {
            $('input.exchange-field').each(function() {
                this.value = '';
            });
            var map = {};
            map.nickname = '';
            $.each(nextProps.currentExchange.get('requiredFields'), function(index, field) {
                map[field.machineName] = '';
            });
            this.replaceState(map);
        },
        setField: function(e) {
            var map = {};
            map[e.target.id] = e.target.value;
            this.setState(map);
        },
        handleSubmit: function(e) {
            e.preventDefault();
            var model = new ExchangeAccount();
            var map = {};
            map.exchangeName = this.props.currentExchange.get('exchangeName');
            map.nickname = this.state.nickname;
            $.each(this.props.currentExchange.get('requiredFields'), function(index, field) {
                map[field.machineName] = this.state[field.machineName];
            }.bind(this));

            model.save(map, {
                success: function() {
                    alert("Successfully added an exchange account!");
                }.bind(this)
            });
        },
        render: function() {
            var currentExchange = this.props.currentExchange;
            var exchangeName = currentExchange.get('exchangeName');
            var fields = currentExchange.get('requiredFields').map(function(field) {
                return React.DOM.div({},
                        React.DOM.label({htmlFor: field.machineName}, field.displayName),
                        React.DOM.input({
                            type: 'text',
                            id: field.machineName,
                            className: 'exchange-field',
                            onChange: this.setField
                        }));
            }.bind(this));

            return React.DOM.form({onSubmit: this.handleSubmit},
                fields,
                React.DOM.label({htmlFor: 'nickname'}, 'Nickname'),
                React.DOM.input({
                    type: 'text',
                    id: 'nickname',
                    className: 'exchange-field',
                    onChange: this.setField
                }),
                React.DOM.input({type: 'submit', value: "Add"}));
        }
    });

    var AddExchangeAccountForm = React.createClass({
        getInitialState: function() {
            return {meta_exchanges: null, currentExchange: null};
        },
        componentWillMount: function() {
            var meta_exchanges = new MetaExchanges();
            meta_exchanges.fetch({
                success: function(collection) {
                    var currentExchange = collection.at(0);
                    this.setState({"meta_exchanges": collection, "currentExchange": currentExchange});
                }.bind(this)
            });
        },
        setExchange: function(e) {
            var exchangeName = e.target.value;
            var currentExchange = this.state.meta_exchanges.findWhere({exchangeName: exchangeName})
            this.setState({"currentExchange": currentExchange});
        },
        render: function() {
            var exchanges = null, fields = null;
            if(this.state.meta_exchanges) {
                exchanges = this.state.meta_exchanges.map(function(model) {
                    return React.DOM.option({value: model.get('exchangeName')}, model.get('exchangeName'));
                }.bind(this));
                fields = AddExchangeAccountFormFields({currentExchange: this.state.currentExchange});
            } else {
                exchanges = React.DOM.p({}, "Loading");
            }

            return React.DOM.div({},
                React.DOM.span({}, "New Exchange Account: "),
                React.DOM.select({onChange: this.setExchange}, exchanges),
                fields);
       }
    });

    var ExchangeAccountRow = React.createClass({
        handleDelete: function(e) {
            e.preventDefault();

            if (!confirm("Are you sure you want to delete account " +
                this.props.exchange_account.get('accountID') + "?"))
                return;

            this.props.exchange_account.destroy({success: function() {
                this.props.onDelete();
            }.bind(this)});
        },
        render: function() {
            var exchange_account = this.props.exchange_account;
            return React.DOM.tr({},
                React.DOM.td({}, exchange_account.get('exchangeName')),
                React.DOM.td({}, exchange_account.get('nickname')),
                React.DOM.td({}, exchange_account.get('accountID')),
                React.DOM.td({}, React.DOM.a({
                    href: '#',
                    onClick: this.handleDelete
                }, "Delete")));
        }
    });

    var ExchangeAccountTable = React.createClass({
        handleDelete: function() {
            this.props.exchange_accounts.fetch();
        },
        render: function() {
            var exchange_accounts = this.props.exchange_accounts;

            var exchange_account_rows = exchange_accounts.map(function(model) {
                return ExchangeAccountRow({exchange_account: model, onDelete: this.handleDelete});
            }.bind(this));

            return React.DOM.table({id: 'exchange_account-table'},
                React.DOM.tr({},
                    React.DOM.th({}, "Exchange"),
                    React.DOM.th({}, "Nickname"),
                    React.DOM.th({}, "Account ID"),
                    React.DOM.th({}, "Action")),
                exchange_account_rows);
        }
    });        

    var ExchangeAccountsView = React.createClass({

        getInitialState: function() {
            return {"exchange_accounts" : null};
        },
        componentWillMount: function() {
            var exchange_accounts = new ExchangeAccounts();
            exchange_accounts.fetch({
                success: function(collection) {
                    this.setState({"exchange_accounts": collection})
                }.bind(this)
            });
        },
        render: function() {
            var content, exchange_accounts = this.state.exchange_accounts;

            if (!exchange_accounts) {
                content = React.DOM.p({}, "Loading");
            }
            else if (exchange_accounts.isEmpty()) {
                content = [AddExchangeAccountForm({exchange_accounts: exchange_accounts}),
                    React.DOM.div({}, "No exchange accounts")];
            }
            else {
                content = [AddExchangeAccountForm({exchange_accounts: exchange_accounts}),
                    ExchangeAccountTable({exchange_accounts: exchange_accounts})];
            }

            return React.DOM.div({}, React.DOM.h1({}, "My Exchange Accounts"),
                content);
        }
    });

    return ExchangeAccountsView;
});
