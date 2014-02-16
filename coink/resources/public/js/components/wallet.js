define(['react', 'collections/wallets'], function(React, Wallets) {
    var Wallet = React.createClass({

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
            if (this.state.wallets == null) {
                return React.DOM.h1({}, "Loading");
            }
            var wallets = this.state.wallets;

            console.log(wallets);
            //_.each(wallets, console.log(wallets.models.attributes.address));

            var wallet_items = wallets.map(function(model) {
                return React.DOM.li({}, model.get('address'),
                    React.DOM.ul({} , React.DOM.li({},
                        model.get('type'), " ", model.get('value'))));
            });

            if (wallet_items.length)
                return React.DOM.ul({id: 'wallet-list'}, wallet_items);
            else
                return React.DOM.div({}, "No wallets");

        }
    });
    return Wallet;
});
