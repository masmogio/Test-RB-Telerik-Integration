'use strict';

app.dataListView = kendo.observable({
    onShow: function() {}
});
(function(parent) {
    var dataProvider = app.data.craBackend;
    var dataSource = new kendo.data.DataSource({
        type: 'everlive',
        transport: {
            typeName: 'References',
            dataProvider: dataProvider
        },
        schema: {
            model: {
                fields: {
                    Product: {
                        field: 'Product',
                        defaultValue: ''
                    },
                    Description: {
                        field: 'Description',
                        defaultValue: ''
                    },
                }
            }
        },
    });

    var dataListViewModel = kendo.observable({
        dataSource: dataSource,
        itemClick: function(e) {
            app.mobileApp.navigate('#dataListView/details.html?uid=' + e.dataItem.uid);
        },
        detailsShow: function(e) {
            var item = e.view.params.uid,
                itemModel = dataSource.getByUid(item);
            dataListViewModel.set('currentItem', itemModel);
        },
        currentItem: null
    });

    parent.set('dataListViewModel', dataListViewModel);
})(app.dataListView);