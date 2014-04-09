define(['backbone'], function(Backbone) {

    var Exchange = Backbone.Model.extend({
        urlRoot: urlRoot + "/v1/exchanges",
    });

    return Exchange;
});
