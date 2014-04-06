app.service('templateService', function ($http, $q, $rootScope) {
    this.getTemplate = function (templateid) {
        var deferred = $q.defer();
        $http.get('http://127.0.0.1:5984/initiative/' + templateid).
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

    this.setTemplate = function (template) {
        var self = this;
        var deferred = $q.defer();
        this.getId(template._id).then(function (id) {
            template.type = 'template';
            $http.put('http://127.0.0.1:5984/initiative/' + id, template).
                success(function (data, status, headers, config) {
                    if (data.ok) {
                        self.getTemplate(data.id).then(function (data) {
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

    this.deleteTemplate = function (template) {
        var deferred = $q.defer();
        if (template && template._id) {
            $http.delete('http://127.0.0.1:5984/initiative/' + template._id + '?rev=' + template._rev).
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

    this.getTemplates = function () {
        var deferred = $q.defer();
        $http.get('http://127.0.0.1:5984/initiative/_design/templates/_view/all').
            success(function (data, status, headers, config) {
                deferred.resolve(data.rows.map(function (element) { return { id: element.id, text: element.value.name, race: element.value.race }; }));
                $rootScope.$$phase || $rootScope.$apply();
            }).
            error(function (data, status, headers, config) {
                deferred.reject([data, status, headers]);
            });
        return deferred.promise;
    };
});