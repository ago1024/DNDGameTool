app.service('partyService', function ($http, $q, $rootScope, couchdbService) {
    this.getParty = function (partyid) {
        var deferred = $q.defer();
        $http.get(couchdbService.getBaseUrl() + partyid).
            success(function (data, status, headers, config) {
                deferred.resolve(data);
                $rootScope.$$phase || $rootScope.$apply();
            }).
            error(function (data, status, headers, config) {
                deferred.reject([data, status, headers]);
            });
        return deferred.promise;
    };

    this.setParty = function (party) {
        var self = this;
        var deferred = $q.defer();
        couchdbService.getId(party._id).then(function (id) {
            party.type = 'party';
            $http.put(couchdbService.getBaseUrl() + id, party).
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
            $http.delete(couchdbService.getBaseUrl() + party._id + '?rev=' + party._rev).
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
        $http.get(couchdbService.getBaseUrl() + '_design/parties/_view/all').
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