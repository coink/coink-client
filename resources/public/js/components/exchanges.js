define(['react', 'models/notification', 'collections/exchanges'],
function(React, notification, Exchanges) {

    var ExchangeRow = React.createClass({
        displayName: "ExchangeRow",
        handleDelete: function(e) {
            e.preventDefault();

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

    var ExchangeTable = React.createClass({
        displayName: "ExchangeTable",
        handleDelete: function() {
            this.props.exchange_accounts.fetch();
        },
        render: function() {
            var exchange_accounts = this.props.exchange_accounts;

            var exchange_account_rows = exchange_accounts.map(function(model) {
                return ExchangeRow({key: model.get('exchangeName'), exchange_account: model, addModel: this.props.addModel, removeModel: this.props.removeModel});
            }.bind(this));

            return React.DOM.table({id: 'exchange_account-table'},
                React.DOM.tbody({},
                    React.DOM.tr({},
                        React.DOM.th({}, "Exchange"),
                        React.DOM.th({}, "Nickname"),
                        React.DOM.th({}, "Account ID"),
                        React.DOM.th({}, "Action")),
                    exchange_account_rows));
        }
    });        

    var ExchangesView = React.createClass({
        displayName: "Exchanges",
        getInitialState: function() {
            var exchange_accounts = new Exchanges();
            return {"exchange_accounts" : exchange_accounts, "loaded": false};
        },
        componentWillMount: function() {
            var exchange_accounts = new Exchanges();
            exchange_accounts.fetch({
                success: function(collection) {
                    if(this.isMounted()) {
                        this.setState({"exchange_accounts": collection, "loaded": true});
                    }
                }.bind(this),
                error: function(collection) {
                    if(this.isMounted()) {
                        this.setState({"loaded": true});
                        notification.error("AJAX error can't load exchanges");
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

            if (!loaded) {
                content = React.DOM.p({}, "Loading");
            }
            else if (exchange_accounts.isEmpty()) {
                content = React.DOM.div({}, "No exchange accounts");
            }
            else {
                content = React.DOM.div({},
                    ExchangeTable({exchange_accounts: exchange_accounts, addModel: this.addModel, removeModel: this.removeModel}));
            }

            return React.DOM.div({}, React.DOM.h1({}, "My Exchange Accounts"),
                content);
        }
    });

    return ExchangesView;
});
