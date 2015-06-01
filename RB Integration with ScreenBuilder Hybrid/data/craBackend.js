'use strict';

(function() {
    app.data.craBackend = new Everlive({
        offlineStorage: true,
        apiKey: 'y2N9tck0qZLw2NdJ',
        url: '//platform.telerik.com/bs-api/v1/',
        scheme: 'https'
    });

    document.addEventListener("online", function() {
        app.data.craBackend.offline(false);
        app.data.craBackend.sync();
    });

    document.addEventListener("offline", function() {
        app.data.craBackend.offline(true);
    });

}());