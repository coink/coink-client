define(['backbone', 'models/exchange_account'], function(Backbone, ExchangeAccount) {

    var ExchangeAccounts = Backbone.Collection.extend({
        model: ExchangeAccount,
        url: function() {
            return "http://private-d789-coink.apiary.io/v1/exchanges";
        }
    });

    return ExchangeAccounts;

});
