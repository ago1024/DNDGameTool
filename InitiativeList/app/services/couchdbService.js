app.service('couchdbService', function ($http, $q, $rootScope) {
    var server = 'lupus';
    var port = '5984';
    var dbname = 'initiative';

    this.getBaseUrl = function () {
        return 'http://' + server + ':' + port + '/' + dbname + '/';
    };

    this.getId = function (id) {
        var deferred = $q.defer();
        if (id === undefined) {
            $http.get('http://' + server + ':' + port + '/_uuids').
            success(function (data, status, headers, config) { deferred.resolve(data.uuids[0]); }).
            error(function (data, status, headers, config) { deferred.reject([data, status, headers]); });
        } else {
            deferred.resolve(id);
        }
        return deferred.promise;
    }

});