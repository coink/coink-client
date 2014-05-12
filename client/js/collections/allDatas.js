define(['backbone', 'models/allData'], function(Backbone, AllData) {

    var AllDatas = Backbone.Collection.extend({
        model: AllData,
    });

    return AllDatas;
});
