define(['backbone', 'models/exchange_account'], function(Backbone, ExchangeAccount) {

    var ExchangeAccounts = Backbone.Collection.extend({
        model: ExchangeAccount,
        urlRoot: urlRoot + "/v1/exchanges",
        url: function() {
            return this.urlRoot;
        }
    });

    return ExchangeAccounts;

});
