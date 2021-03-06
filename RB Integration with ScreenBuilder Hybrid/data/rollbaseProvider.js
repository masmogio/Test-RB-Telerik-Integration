'use strict';

(function (global) {
  var app = global.app = global.app || {};
  var RollbaseProvider = function() {
      
  };
  RollbaseProvider.prototype = {
    init: function () {
    
    },
      /*
    currentUser: function()
    {
        var promise = new Promise(function (resolve,reject){
            if (app.settingsService.getSessionId()!="")
                resolve(true);
            else reject(false);


        });
    },
    */
    login: function(username, password, success, error) {
      var data = { 
          "loginName" : username , 
          "password" : password,
     //     "custId"   : app.config.rollbase.custId,
           "output"  : "json"
      };
      console.debug("pasa");

      this._ajaxCall("POST", "login", data, success, error).then(function (result) {
          // code depending on result
          console.debug("pasote");
          console.debug(error);
      }).catch(function () {
          // an error occurred
      });
    
    },

      
    getClaims: function(success, error) {
      var data = { 
          "objName"  : "tl_claims",
          "sessionId": app.settingsService.getSessionId(),
          "viewId" : "123733537",
          "output"   : "json",
          "composite": "1"
      };
      this._ajaxCall("GET", "getPage", data, success, error);
    },
    isOnline: function(){
        return true;
    },
      
    getClaimById:function(claimId, success, error){
      var data = { 
          "objName"  : "tl_claims",
          "sessionId": app.settingsService.getSessionId(),
          "composite" : "1",
          "id": claimId,
          "output": "json"
      };
        
      this._ajaxCall("GET","getRecord", data, success, error);
    },
  
    createNewClaim: function(data, success, error) {
      var newClaim = {
          objName       : 'tl_claims',
          sessionId     : app.settingsService.getSessionId(),
          name          : data.Title,
          tl_Amount     : data.Amount,
          tl_Descrption : data.Description,
          status        : data.Status,
          city          : data.City,
          streetAddr1   : data.Address,
          zip           : data.Zip,
          country       : data.Country,
          output        : "json"
      }

      this._ajaxCall('POST', 'createRecord', newClaim, success, error); 
    },
    
    attachPhoto: function (claimId, url, success, error) {
       var that = this;
        
        window.resolveLocalFileSystemURI(url, function(fileEntry) {
            fileEntry.file(function(file) { 
                var reader = new FileReader();
                reader.onloadend = function(e){ 
                    var uint = String.fromCharCode.apply(null, new Uint8Array(e.target.result));
                    var base64String = btoa(uint);
                    
                    var data = {
                      objName       : 'attachment14',
                      sessionId     : app.settingsService.getSessionId(),
                      contentType   : "Image",
                      R123755107    : claimId,
                      output        : 'json'
                    };

                    that._ajaxCall('POST', 'createRecord', data, function(data){

                      var attachment = {
                        objName       : 'attachment14',
                        sessionId     : app.settingsService.getSessionId(),
                        contentType   : "image/png",
                        id            : data.id,
                        fieldName     : 'Image',
                        value         :  base64String,
                        fileName      : 'img_' + data.id + '.png',
                        output        : 'json'
                      
                      };

                      var options = {
                          url :app.config.rollbase.baseUrl + 'setDataField',
                           headers :{
                              'Content-Type' : 'application/x-www-form-urlencoded'
                          },
                          type : 'POST',
                          data : attachment,
                          success: success
                      };
                     
                      $.ajax(options).fail(function(err){
                          error(JSON.parse(err.responseText));
                      }); 

                    }, function(err){
                         error(JSON.parse(err.responseText));
                    });
                }
                reader.readAsArrayBuffer(file);
            });
        });
    },
      
    getImageUrl: function(id, success, error){
       var that = this;
        
       var data = {
           sessionId : app.settingsService.getSessionId(),
           objName   : 'attachment14',
           id        : id,
           fieldName : 'Image'
       } ;
       return app.config.rollbase.baseUrl +  'getBinaryData?' + $.param(data);
    },

    updateClaim: function(id, status, success, error) {
       var data = { 
          "objName"  : "tl_claims",
          "sessionId": app.settingsService.getSessionId(),
          "useIds" : "false",
          "id": id,
          "status":status,
          "output": "json"
      };
      this._ajaxCall("PUT","updateRecord", data, success, error);
    },
   
    _ajaxCall: function (type, method, data, success, error) {
        return  Promise (function(resolve,rejected){
            var rollbaseUrl = app.config.rollbase.baseUrl + method + '?' + $.param(data);
            var proxy = '';
            var proxy = 'https://platform.telerik.com/bs-api/v1/gbuoz9tjJuLIhImK/Functions/Rollbase?url=';
            //var proxy = 'https://platform.telerik.com/bs-api/v1/X7AydmbmdnQDlB5c/Functions/Rollbase?url=';
            var url = proxy + escape (rollbaseUrl) + '&method=' + type;
            console.debug(url);
            var options = {
                url: url,
                contentType: 'application/json',
                success: function (rsp) {
                   /* console.debug("kkkkk");
                    console.debug(rsp.body);
                    console.debug(JSON.parse(rsp.body));
                     console.log(rsp.body);*/
                    //  resolve(success(JSON.parse(rsp.body)));
                    //  resolve((JSON.parse(rsp.body)));
                    resolve(rsp.body);
         
                }
            }
        
            $.ajax(options).fail(function (err) {
                console.log("jjj");
                console.log(err.responseText);
                error(JSON.parse(err.responseText));
            }); 
        });
    }
  };

  app.data.rollbaseProvider = new RollbaseProvider();

})(window);

