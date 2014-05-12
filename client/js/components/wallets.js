define(['react', 'collections/wallets', 'models/wallet', 'components/loader',
        'models/notification', 'components/common/glyphicon'],
function(React, Wallets, Wallet, Loader, notification, Glyphicon) {

    var AddWalletForm = React.createClass({
        displayName: 'AddWalletForm',

        handleSubmit: function(e) {
            e.preventDefault();
            var address = this.refs.address.getDOMNode().value.trim();
            if(address.length < 27 || address.length > 35) {
                notification.warning("Oink.. Valid Crypto Addresses are" +
                    " between 27 and 35 characters long. Enter a" +
                    " valid address.");
                return;
            }
            this.props.handleAdd(address);
            this.refs.address.getDOMNode().value = "";
        },

        render: function() {
            return React.DOM.div({className: 'panel'},
                React.DOM.p({},
                    "Add a new wallet by entering a crypto currency address:"),
                React.DOM.form({
                    id: "address",
                    onSubmit: this.handleSubmit,
                    onEnter: this.handleSubmit
                },
                React.DOM.div({className: 'row collapse'},
                    React.DOM.div({
                        className: 'medium-7 medium-offset-2 columns'
                    }, React.DOM.input({
                        placeholder: 'Address',
                        type: 'text',
                        ref: 'address'
                    })),
                    React.DOM.div({className: 'medium-1 columns end'},
                        React.DOM.button({
                            className: 'radius button success postfix',
                            title: 'Add New Address'
                            }, Glyphicon({name: "plus"}))))));
       }
    });

    var WalletRow = React.createClass({
        displayName: 'WalletRow',

        handleClick: function(e) {
            e.preventDefault();
            this.props.handleDelete(this.props.wallet);
        },

        handleRefresh: function(e) {
            e.preventDefault();
            this.props.handleRefresh();
        },

        render: function() {
            var wallet = this.props.wallet;
            return React.DOM.tr({},
                React.DOM.td({}, wallet.get('type')),
                React.DOM.td({}, wallet.get('address')),
                React.DOM.td({}, wallet.get('value')),
                React.DOM.td({},
                    React.DOM.button({
                        className: 'button radius tiny secondary',
                        title: 'Refresh Address',
                        onClick: this.handleRefresh
                    }, Glyphicon({name: "refresh"})), " ",
                    React.DOM.button({
                        className: 'button radius tiny alert',
                        title: 'Remove Address',
                        onClick: this.handleClick
                    }, Glyphicon({name: "trash"}))));
        }
    });

    var WalletTable = React.createClass({
        displayName: 'WalletTable',

        render: function() {
            var wallets = this.props.wallets;
            var wallet_rows = wallets.map(function(wallet) {
                return WalletRow({
                    key: wallet.cid,
                    handleDelete: this.props.handleDelete,
                    handleRefresh: this.props.handleRefresh,
                    wallet: wallet
                });
            }.bind(this));
            return React.DOM.div({className: 'row'},
                React.DOM.div({
                    className: 'medium-12 medium-centered columns'
                }, React.DOM.table({id: 'wallet-table'},
                        React.DOM.thead({},
                            React.DOM.tr({},
                                React.DOM.th({}, "Currency"),
                                React.DOM.th({}, "Address"),
                                React.DOM.th({}, "Balance"),
                                React.DOM.th({}, "Actions"))),
                        React.DOM.tbody({}, wallet_rows))));
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
                    notification.success(
                        "Successfully removed address: " + address + ".");
                    this.setState({"wallets" : this.state.wallets});
                }.bind(this),
                fail: function() {
                    notification.error(
                        "Error: could not remove address: " + address + ".");
                }
            });
        },

        handleAdd: function(address) {
            this.state.wallets.create({address: address}, {
                success: function() {
                    notification.success(
                        "Successfully added address: " + address + ".");
                    this.setState({"wallets" : this.state.wallets});
                }.bind(this),
                fail: function() {
                    notification.error(
                        "Error: could not add address: " + address + ".");
                }
            });
        },

        handleRefresh: function(address) {
            this.state.wallets.fetch({
                success: function() {
                    notification.success(
                        "Oinkers, here's some fresh account data as of " +
                            new Date() + ".");
                },
                fail: function() {
                    notification.error("Error: could not refresh data. :(");
                }
            });
        },

        componentWillMount: function() {
            this.state.wallets.fetch({
                success: function(wallets) {
                    this.setState({
                        wallets: wallets,
                        loading: false
                    });
                }.bind(this)
            });
        },

        render: function() {
            var content;
            if(this.state.loading) {
                content = new Loader();
            } else if(this.state.wallets) {
                content = [
                    React.DOM.div({className: 'row'},
                        React.DOM.div({
                            className: 'medium-6 medium-centered columns'
                        }, AddWalletForm({handleAdd: this.handleAdd})))
                ];

                if(this.state.wallets.length) {
                    content.push(
                        WalletTable({
                            handleDelete: this.handleDelete,
                            handleRefresh: this.handleRefresh,
                            wallets: this.state.wallets
                        }));
                } else {
                    var str = "No wallet addresses are being tracked yet. " +
                        "Add one by entering the wallet address above!";
                    content.push(React.DOM.div({}, str));
                }
            }
            return React.DOM.div({id: 'wallet_container'},
                React.DOM.h1({}, "My Wallets"), content);
        }
    });

    return Wallet;
});
