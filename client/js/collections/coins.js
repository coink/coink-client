define(['backbone', 'models/coin'], function(Backbone, Coin) {

    var Coins = Backbone.Collection.extend({
        model: Coin,
    });

    return Coins;
});
