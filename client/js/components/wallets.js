define(['react', 'collections/wallets', 'models/wallet', 'components/loader', 'models/notification'], function(React, Wallets, Wallet, Loader, notification) {

    var AddWalletForm = React.createClass({
        displayName: 'AddWalletForm',

        handleSubmit: function(e) {
            e.preventDefault();
            var wallets = this.props.wallets;
            var address = this.refs.address.getDOMNode().value.trim();
            // MIGHT BE REDUNDANT WHEN SERVER IS WORKING
            wallets.add({address: address});
            wallets.create({address: address}, {
                wait: true,
                success: function(wallet, q) {
                    notification.success("Successfully added address: " + address + ".");
                },
                fail: function() {
                    notification.error("Error could not add address: " + address + ".");
                }
            });
        },

        render: function() {
            return React.DOM.form({onSubmit: this.handleSubmit, onEnter: this.handleSubmit},
                React.DOM.label({}, "New Address",
                React.DOM.input({
                    placeholder: 'Address',
                    type: 'text',
                    ref: 'address'
                })),
                React.DOM.button({className: 'radius primary'},
                "Add"));
       }
    });

    var WalletRow = React.createClass({
        displayName: 'WalletRow',

        handleDelete: function(e) {
            e.preventDefault();

            var address = this.props.wallet.get('address');
            if (!confirm("Are you sure you want to delete address: " + address + " ?"))
                return;

            this.props.wallet.destroy({
                wait: true,
                success: function() {
                    notification.success("Successfully removed address: " + address + ".");
                },
                fail: function() {
                    notification.error("Error could not add address: " + address + ".");
                }
            });
        },

        render: function() {
            var wallet = this.props.wallet;
            return React.DOM.tr({},
                React.DOM.td({}, wallet.get('type')),
                React.DOM.td({}, wallet.get('address')),
                React.DOM.td({}, wallet.get('value')),
                React.DOM.td({}, React.DOM.a({
                    href: '#',
                    onClick: this.handleDelete
                }, "Delete")));
        }
    });

    var WalletTable = React.createClass({
        displayName: 'WalletTable',

        render: function() {
            var wallets = this.props.wallets;
            if (wallets) {
            var wallet_rows = wallets.map(function(wallet) {
                return WalletRow({
                    key: wallet.cid,
                    wallet: wallet
                });
            });
            return React.DOM.table({id: 'wallet-table'},
                React.DOM.tr({},
                    React.DOM.th({}, "Currency"),
                    React.DOM.th({}, "Address"),
                    React.DOM.th({}, "Balance"),
                    React.DOM.th({}, "Action")),
                wallet_rows);
            }
            return React.DOM.div({}, "No wallets");
        }
    });

    var Wallet = React.createClass({
        displayName: 'Wallet',

        getInitialState: function() {
            return {"wallets" : []};
        },

        componentWillMount: function() {
            var wallets = new Wallets();
            wallets.on("sync", this.updateWallets.bind(this,null));
            wallets.on("add destroy", this.updateWallets);
            wallets.fetch();
        },

        updateWallets: function(wallet, wallets) {
            console.log(wallet);
            if(this.isMounted()) {
                if(wallets.length > 0) {
                    this.replaceState({"wallets" : wallets});
                } else {
                    this.replaceState({"wallets" : null});
                }
            }
        },

        render: function() {
            var wallets = this.state.wallets;
            return React.DOM.div({id: 'wallet_container'},
                React.DOM.h1({}, "My Wallets"),
                AddWalletForm({wallets: wallets}),
                WalletTable({wallets: wallets}));
        }
    });

    return Wallet;
});
