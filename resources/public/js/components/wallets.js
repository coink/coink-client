define(['react', 'collections/wallets', 'models/wallet'], function(React, Wallets, Wallet) {

    var WalletListItem = React.createClass({
        render: function() {
            var wallet = this.props.wallet;
            return React.DOM.li({key: wallet.get('address')}, wallet.get('address'),
                React.DOM.ul({} , React.DOM.li({},
                    wallet.get('type'), " ", wallet.get('value'))));
        }
    });

    var AddWalletForm = React.createClass({
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

    var WalletsList = React.createClass({

        getInitialState: function() {
            return {"wallets" : null};
        },

        componentDidMount: function() {
            var wallets = new Wallets();
            wallets.on("sync", this.updateWallets);
            wallets.fetch();
        },

        updateWallets: function(wallets) {
            this.setState({"wallets" : wallets});
        },

        render: function() {
            var content, wallets = this.state.wallets;

            if (!wallets)
                content = React.DOM.p({}, "Loading");
            else if (wallets.isEmpty())
                content = [AddWalletForm({wallets: wallets}), 
                    React.DOM.div({}, "No wallets")];
            else {
                var wallet_items = wallets.map(function(model) {
                    return WalletListItem({ "wallet" : model });
                });
                content = [AddWalletForm({wallets: wallets}), 
                    React.DOM.ul({id: 'wallet-list'}, wallet_items)];
            }

            return React.DOM.div({}, React.DOM.h1({}, "My Wallets"),
                content);
        }
    });
    return WalletsList;
});
