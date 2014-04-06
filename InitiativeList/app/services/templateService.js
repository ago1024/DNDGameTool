app.service('templateService', function ($http, $q, $rootScope, couchdbService) {
    this.getTemplate = function (templateid) {
        var deferred = $q.defer();
        $http.get(couchdbService.getBaseUrl() + templateid).
            success(function (data, status, headers, config) {
                deferred.resolve(data);
                $rootScope.$$phase || $rootScope.$apply();
            }).
            error(function (data, status, headers, config) {
                deferred.reject([data, status, headers]);
            });
        return deferred.promise;
    };

    this.setTemplate = function (template) {
        var self = this;
        var deferred = $q.defer();
        couchdbService.getId(template._id).then(function (id) {
            template.type = 'template';
            $http.put(couchdbService.getBaseUrl() + id, template).
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
            $http.delete(couchdbService.getBaseUrl() + template._id + '?rev=' + template._rev).
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
        $http.get(couchdbService.getBaseUrl() + '_design/templates/_view/all').
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