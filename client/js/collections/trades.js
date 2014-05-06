define(['backbone', 'models/trade'], function(Backbone, Trade) {

    var Trades = Backbone.Collection.extend({

        model: Trade,

        initialize: function(models, options) {
            if(options) {
                this.accountID = options.accountID;
            }
        },

        urlRoot: urlRoot + "/v1/exchanges/",

        parse: function(response) {
            return response.data;
        },

        url: function() {
            return this.urlRoot + this.accountID + "/trades";
        }
    });

    return Trades;
});
