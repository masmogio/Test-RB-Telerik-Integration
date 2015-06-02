'use strict';

app.signInView = kendo.observable({
    onShow: function() {}
});
(function(parent) {
    var provider = app.data.rollbaseProvider,
        signinSuccess =
        function(data) {
            app.user = data.result;
            app.mobileApp.navigate('dataListView/view.html');
        },
        signinInit =
        function() {
            if (!app.isOnline()) {
                $('.signin-view').hide().siblings().show();
            } else {
                $('.signin-view').show().siblings().hide();
            }
        },
        signInViewModel = kendo.observable({
            username: '',
            password: '',
            signin: function() {
                provider.login(signInViewModel.username, signInViewModel.password,
                    function (data) {
                        alert("tu madree");
                        if (data && data.result) {
                            signinSuccess(data);
                        } else {
                            signinInit();
                        }
                    },
                    signinInit);
            }
        });

    parent.set('signInViewModel', signInViewModel);
   parent.set('onShow', function() {
        provider.then(
            function(data) {
                if (data && data.result) {
                    signinSuccess(data);
        } else {
                    signinInit();
        }
        },
            signinInit
        );
    });
})(app.signInView);