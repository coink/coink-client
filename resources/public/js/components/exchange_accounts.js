define(['react', 'collections/exchange_accounts', 'models/exchange_account', 'collections/meta_exchanges'],
function(React, ExchangeAccounts, ExchangeAccount, MetaExchanges) {

    var AddExchangeAccountForm = React.createClass({
        getInitialState: function() {
            var meta_exchanges = new MetaExchanges();
            meta_exchanges.on("sync", this.updateMetaExchanges);
            meta_exchanges.fetch();

            return {meta_exchanges: null, exchangeName: ''};
        },
        render: function() {
            var exchanges = null;
            if(this.state.meta_exchanges) {
                exchanges = this.state.meta_exchanges.map(function(model) {
                    return React.DOM.option({value: model.get('exchangeName')}, model.get('exchangeName'));
                }.bind(this));
            } else {
                exchanges = React.DOM.p({}, "Loading");
            }

            return React.DOM.select({}, exchanges);
       },
       updateMetaExchanges: function(meta_exchanges) {
            this.setState({"meta_exchanges" : meta_exchanges});
        },
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
        componentDidMount: function() {
            var exchange_accounts = new ExchangeAccounts();
            exchange_accounts.on("sync", this.updateExchangeAccounts);
            exchange_accounts.fetch();
        },
        updateExchangeAccounts: function(exchange_accounts) {
            this.setState({"exchange_accounts" : exchange_accounts});
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
