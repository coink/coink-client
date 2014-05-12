define(['react', 'collections/wallets', 'models/wallet', 'components/loader', 'models/notification'], function(React, Wallets, Wallet, Loader, notification) {

    var AddWalletForm = React.createClass({
        displayName: 'AddWalletForm',

        handleSubmit: function(e) {
            e.preventDefault();
            var address = this.refs.address.getDOMNode().value.trim();
            this.props.handleAdd(address);
        },

        render: function() {
            return React.DOM.form({
                onSubmit: this.handleSubmit,
                onEnter: this.handleSubmit
            }, React.DOM.label({}, "New Address",
                React.DOM.input({
                    placeholder: 'Address',
                    type: 'text',
                    ref: 'address'
                })
            ), React.DOM.button({className: 'radius primary'}, "Add"));
       }
    });

    var WalletRow = React.createClass({
        displayName: 'WalletRow',

        handleClick: function(e) {
            e.preventDefault();
            this.props.handleDelete(this.props.wallet);
        },

        render: function() {
            var wallet = this.props.wallet;
            return React.DOM.tr({},
                React.DOM.td({}, wallet.get('type')),
                React.DOM.td({}, wallet.get('address')),
                React.DOM.td({}, wallet.get('value')),
                React.DOM.td({}, React.DOM.a({
                    href: '#',
                    onClick: this.handleClick
                }, "Delete")));
        }
    });

    var WalletTable = React.createClass({
        displayName: 'WalletTable',

        render: function() {
            var wallets = this.props.wallets;
            if (wallets && wallets.length) {
                var wallet_rows = wallets.map(function(wallet) {
                    return WalletRow({
                        handleDelete: this.props.handleDelete,
                        key: wallet.cid,
                        wallet: wallet
                    });
                }.bind(this));
                return React.DOM.table({id: 'wallet-table'},
                    React.DOM.thead({},
                        React.DOM.tr({},
                            React.DOM.th({}, "Currency"),
                            React.DOM.th({}, "Address"),
                            React.DOM.th({}, "Balance"),
                            React.DOM.th({}, "Action"))),
                    React.DOM.tbody({}, wallet_rows));
            }
            return React.DOM.div({}, "No wallets");
        }
    });

    var Wallet = React.createClass({
        displayName: 'Wallet',

        getInitialState: function() {
            return {
                "wallets" : new Wallets(),
                "loading" : true
            };
        },

        handleDelete: function(model) {
            var address = model.get('address');
            if (!confirm("Are you sure you want to delete address: " + address + " ?"))
                return;

            model.destroy({
                wait: true,
                success: function() {
                    notification.success("Successfully removed address: " + address + ".");
                    this.setState({"wallets" : this.state.wallets});
                }.bind(this),
                fail: function() {
                    notification.error("Error could not add address: " + address + ".");
                }
            });
        },

        handleAdd: function(address) {
            this.state.wallets.create({address: address}, {
                success: function() {
                    notification.success("Successfully added address: " + address + ".");
                    this.setState({"wallets" : this.state.wallets});
                }.bind(this),
                fail: function() {
                    notification.error("Error could not add address: " + address + ".");
                }
            });
        },

        componentWillMount: function() {
            var wallets = new Wallets();
            wallets.fetch({success: function(wallets) {
                this.setState({wallets: wallets});
            }.bind(this)});
        },

        render: function() {
            var wallets = this.state.wallets;
            return React.DOM.div({id: 'wallet_container'},
                React.DOM.h1({}, "My Wallets"),
                AddWalletForm({handleAdd: this.handleAdd, wallets: wallets}),
                WalletTable({handleDelete: this.handleDelete, wallets: wallets}));
        }
    });

    return Wallet;
});
