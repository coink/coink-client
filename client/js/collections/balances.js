define(['backbone', 'models/balance'], function(Backbone, Balance) {

    var Balances = Backbone.Collection.extend({

        model: Balance,

        initialize: function(models, options) {
            this.accountID = options.accountID;
        },

        urlRoot: urlRoot + "/v1/exchanges/" + this.accountID + "/balances",

        parse: function(response) {
            return response.data;
        },

        url: function() {
            return this.urlRoot;
        }
    });

    return Balances;
});
