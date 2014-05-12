define(['backbone'], function(Backbone) {

    var Coin = Backbone.Model.extend({
        defaults: {
            "ticker": "XXX",
            "name": "nullCoin",
            "price": 0,
            "quantity": 0,
            "gain": 0,
            "gainPercent": 0,
            "totalCost": 0,
            "marketValue": 0
        },

        mergeCoins: function(coin) {
            this.set("quantity", this.get("quantity") + coin.get("quantity"));
            this.set("gain", this.get("gain") + coin.get("gain"));
            this.set("gainPercent", this.get("gainPercent") + coin.get("gainPercent"));
            this.set("totalCost", this.get("totalCost") + coin.get("totalCost"));
            this.set("price", this.get("totalCost")/this.get("quantity"));
            this.set("marketValue", coin.get("marketValue"));
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

        getPrice: function() {
            return this.get("price");
        },

        totalCost: function() {
            return this.get("totalCost");
        }
    });

    return Coin;
});
