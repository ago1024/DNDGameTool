app.service('partyService', function ($http, $q, $rootScope) {
    this.getParty = function (partyid) {
        var deferred = $q.defer();
        $http.get('http://127.0.0.1:5984/initiative/' + partyid).
            success(function (data, status, headers, config) {
                deferred.resolve(data);
                $rootScope.$$phase || $rootScope.$apply();
            }).
            error(function (data, status, headers, config) {
                deferred.reject([data, status, headers]);
            });
        return deferred.promise;
    };

    this.getId = function (id) {
        var deferred = $q.defer();
        if (id === undefined) {
            $http.get('http://127.0.0.1:5984/_uuids').
            success(function (data, status, headers, config) { deferred.resolve(data.uuids[0]); }).
            error(function (data, status, headers, config) { deferred.reject([data, status, headers]); });
        } else {
            deferred.resolve(id);
        }
        return deferred.promise;
    }

    this.setParty = function (party) {
        var self = this;
        var deferred = $q.defer();
        this.getId(party._id).then(function (id) {
            party.type = 'party';
            $http.put('http://127.0.0.1:5984/initiative/' + id, party).
                success(function (data, status, headers, config) {
                    if (data.ok) {
                        self.getParty(data.id).then(function (data) {
                            deferred.resolve(data);
                            $rootScope.$$phase || $rootScope.$apply();
                        }, function (data) { deferred.reject(data); });
                    } else {
                        deferred.reject(data);
                    }
                }).
                error(function (data, status, headers, config) {
                    deferred.reject([data, status, headers]);
                });
        }, function (data) {
            deferred.reject(data);
        });

        return deferred.promise;
    };

    this.deleteParty = function (party) {
        var deferred = $q.defer();
        if (party && party._id) {
            $http.delete('http://127.0.0.1:5984/initiative/' + party._id + '?rev=' + party._rev).
            success(function (data, status, headers, config) {
                deferred.resolve(data);
            }).
            error(function (data, status, headers, config) {
                deferred.reject([data, status, headers]);
            });
        } else {
            deferred.resolve(true);
        }
        return deferred.promise;
    };

    this.getParties = function () {
        var deferred = $q.defer();
        $http.get('http://127.0.0.1:5984/initiative/_design/parties/_view/all').
            success(function (data, status, headers, config) {
                deferred.resolve(data.rows.map(function (element) { return { id: element.id, text: element.value }; }));
                $rootScope.$$phase || $rootScope.$apply();
            }).
            error(function (data, status, headers, config) {
                deferred.reject([data, status, headers]);
            });
        return deferred.promise;
    };
});