define(['react', 'collections/wallets'], function(React, Wallets) {

    var Wallet = React.createClass({
        render: function() {
            var wallet = this.props.wallet;
            return React.DOM.li({key: wallet.get('address')}, wallet.get('address'),
                React.DOM.ul({} , React.DOM.li({},
                    wallet.get('type'), " ", wallet.get('value'))));
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
                content = React.DOM.div({}, "No wallets");
            else {
                var wallet_items = wallets.map(function(model) {
                    return Wallet({ "wallet" : model });
                });
                content = React.DOM.ul({id: 'wallet-list'}, wallet_items);
            }

            return React.DOM.div({}, React.DOM.h1({}, "My Wallets"),
                content);
        }
    });
    return WalletsList;
});
