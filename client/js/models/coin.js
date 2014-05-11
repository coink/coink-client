define(['backbone'], function(Backbone) {

    var Coin = Backbone.Model.extend({
        defaults: {
            "ticker": "XXX",
            "name": "nullCoin",
            "quantity": 0,
            "costPer": 0,
            "totalCost": 0
        },

        addCoins: function(coins) {
            this.set("quantity", this.get("quantity") + coins);
        },

        currencyTicker: function() {
            return this.get("ticker");
        },

        currencyName: function() {
            return this.get("name");
        },

        quantity: function() {
            return this.get("quantity");
        },

        costPerCoin: function() {
            return this.get("costPer");
        },

        totalCost: function() {
            return this.get("totalCost");
        }
    });

    return Coin;
});
