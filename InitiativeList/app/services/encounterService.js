app.service('encounterService', function ($http, $q, $rootScope) {
    this.getCharacters = function (encounterid) {
        var deferred = $q.defer();
        $http.get('http://127.0.0.1:5984/initiative/' + encounterid).
            success(function (data, status, headers, config) {
                deferred.resolve(data.characters);
                $rootScope.$$phase || $rootScope.$apply();
            }).
            error(function (data, status, headers, config) {
                deferred.reject([data, status, headers]);
            });
        return deferred.promise;
    };

    this.getEncounter = function (encounterid) {
        var deferred = $q.defer();
        $http.get('http://127.0.0.1:5984/initiative/' + encounterid).
            success(function (data, status, headers, config) {
                deferred.resolve(data);
                $rootScope.$$phase || $rootScope.$apply();
            }).
            error(function (data, status, headers, config) {
                deferred.reject([data, status, headers]);
            });
        return deferred.promise;
    };

    this.getEncounters = function () {
        var deferred = $q.defer();
        $http.get('http://127.0.0.1:5984/initiative/_design/encounters/_view/all').
            success(function (data, status, headers, config) {
                deferred.resolve(data.rows.map(function (element) { return { id: element.id, text: element.value.text, campaign: element.value.campaign }; }));
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

    this.setEncounter = function (encounter) {
        var self = this;
        var deferred = $q.defer();
        this.getId(encounter._id).then(function (id) {
            encounter.type = 'encounter';
            $http.put('http://127.0.0.1:5984/initiative/' + id, encounter).
                success(function (data, status, headers, config) {
                    if (data.ok) {
                        self.getEncounter(data.id).then(function (data) {
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

    this.deleteEncounter = function (encounter) {
        var deferred = $q.defer();
        if (encounter && encounter._id) {
            $http.delete('http://127.0.0.1:5984/initiative/' + encounter._id + '?rev=' + encounter._rev).
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
});