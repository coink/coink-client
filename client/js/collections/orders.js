define(['backbone', 'models/order'], function(Backbone, Order) {

    var Orders = Backbone.Collection.extend({

        model: Order,

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
            return this.urlRoot + this.accountID + "/orders";
        }
    });

    return Orders;
});
