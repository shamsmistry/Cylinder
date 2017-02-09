var http = require('http');
var request = require('request');

//sort array in ascending order
exports.sortStringsArray = function (array) {
    return new Promise(function (resolvePromise) {
        resolvePromise(array.sort(function (a, b) {
            return a - b
        }));
    })
        .then(function (promiseResult) {
            return promiseResult;
        });
};

//remove duplicates from array
exports.removeDuplicates = function (arr) {
    var temparr = [];
    for (var i = 0; i < arr.length; i++) {
        if (temparr.length == 0)
            temparr.push(arr[i]);

        else {
            var flag = 0;
            for (var j = 0; j < temparr.length; j++) {
                if (arr[i] == temparr[j]) {
                    flag = 1;
                    break;
                }
            }
            if (flag == 0)
                temparr.push(arr[i]);
        }
    }
    return temparr;
}

//remove duplicate conversation ids from array
exports.removeDuplicateConversationIds = function (arr) {
    var temparr = [];
    for (var i = 0; i < arr.length; i++) {
        if (temparr.length == 0) {
            temparr.push(arr[i]['conversationsId']);
        }
        else {
            var flag = 0;
            for (var j = 0; j < temparr.length; j++) {
                if ('' + arr[i]['conversationsId'] + '' === '' + temparr[j] + '') {
                    flag = 1;
                    break;
                }
            }
            if (flag == 0) {
                temparr.push(arr[i]['conversationsId']);
            } else {

            }
        }
    }
    return temparr;
};

//requesting network server old function
exports.requestServer_old = function (host, port, path, requestMethod, dataArray, version) {
    return new Promise(function (resolve) {
        var options = {
            host: host,
            port: port,
            path: path,
            method: requestMethod,
            headers: {
                'x-api-version': version
            },
            body: {
                uid: dataArray.uid
            }
        };
        var req = http.request(options, function (resp) {
            resp.setEncoding('utf8');
            resp.on('data', function (result, res) {
                if (result) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        }).on("error", function (e) {
            resolve(false);
        });
        req.end();
    })
        .then(function (result) {
            return result;
        });
};

//requesting network server
exports.requestServer = function (url, requestMethod, contentType, dataObj, apiVersion) {
    return new Promise(function (resolve) {
        request(
            {
                method: requestMethod
                , uri: url
                , headers: {
                'x-api-version': apiVersion,
                'content-type': contentType
            }
                , json: dataObj
            }
            , function (error, response, body) {
                if (error) {
                    resolve('FALSE');
                } else {
                    resolve('TRUE');


                    //if (response.statusCode == 201) {
                    //    console.log('good');
                    //    resolve('');
                    //} else {
                    //    console.log('error: ' + response.statusCode)
                    //    console.log(body);
                    //    resolve('');
                    //}
                }
            }
        )
    })
        .then(function (result) {
            return result;
        });
};