define(['react', 'collections/wallets', 'models/wallet', 'components/loader'], function(React, Wallets, Wallet, Loader) {

    var AddWalletForm = React.createClass({
        displayName: 'AddWalletForm',

        getInitialState: function() {
            return {address: ''};
        },

        setAddress: function(e) {
            this.setState({address: e.target.value});
        },

        handleSubmit: function(e) {
            e.preventDefault();
            var model = new Wallet();
            model.save({address: this.state.address}, {
                success: function() {
                    /* TODO: the API should return a representation of new object. It Doesn't */
                    alert("Successfully added a wallet!");
                    this.props.wallets.fetch();
                }.bind(this)});
        },

        render: function() {
            return React.DOM.form({onSubmit: this.handleSubmit},
                React.DOM.label({htmlFor: 'new-address'}, "New Address"),
                React.DOM.input({
                    type: 'text',
                    id: 'new-address',
                    value: this.state.address,
                    onChange: this.setAddress
                }),
                React.DOM.input({type: 'submit', value: "Add"}));
       }
    });

    var WalletRow = React.createClass({
        displayName: 'WalletRow',

        handleDelete: function(e) {
            e.preventDefault();

            if (!confirm("Are you sure you want to delete address " +
                this.props.wallet.get('address') + "?"))
                return;

            this.props.wallet.destroy({
                success: function() {
                    this.props.onDelete();
                }.bind(this)
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

        handleDelete: function() {
            this.props.wallets.fetch();
        },

        render: function() {
            var wallets = this.props.wallets;
            var wallet_rows = wallets.map(function(model) {
                return WalletRow({
                    key: model.cid,
                    wallet: model,
                    onDelete: this.handleDelete
                });
            }.bind(this));
            return React.DOM.table({id: 'wallet-table'},
                React.DOM.tr({},
                    React.DOM.th({}, "Currency"),
                    React.DOM.th({}, "Address"),
                    React.DOM.th({}, "Balance"),
                    React.DOM.th({}, "Action")),
                wallet_rows);
        }
    });

    return React.createClass({
        displayName: 'Wallet',

        getInitialState: function() {
            return {"wallets" : null};
        },

        componentDidMount: function() {
            var wallets = new Wallets();
            wallets.on("sync", this.updateWallets);
            wallets.fetch();
        },

        updateWallets: function(wallets) {
            if(this.isMounted()) {
                this.setState({"wallets" : wallets});
            }
        },

        render: function() {
            var wallets = this.state.wallets;
            if (!wallets)
                return React.DOM.div({}, React.DOM.h1({}, "My Wallets"), new Loader());
            else if (wallets.isEmpty())
                content = React.DOM.div({}, "No wallets");
            else
                content = WalletTable({wallets: wallets});
            return React.DOM.div({id: 'wallet_container'}, React.DOM.h1({}, "My Wallets"),
                AddWalletForm({wallets: wallets}), content);
        }
    });
});
