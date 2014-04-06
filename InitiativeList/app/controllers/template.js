app.controller('TemplateListController', function ($scope, templateService) {
    $scope.templates = [];

    templateService.getTemplates().then(function (data) {
        $scope.templates = data;
    }, function () {
        $scope.templates = undefined;
    });
});

app.controller('TemplateController', function ($scope, $routeParams, templateService) {

    function load() {
        templateService.getTemplate($routeParams.templateId).then(function (data) {
            $scope.template = data;
        }, function () {
            $scope.template = undefined;
        });
    };

    init();
    function init() {
        if ($routeParams.templateId == '_new') {
            $scope.template = {};
        } else {
            load();
        }
    };

    $scope.save = function () {
        templateService.setTemplate($scope.template).then(function (data) {
            if (data._id == $routeParams.templateId) {
                load();
            } else {
                location.href = "#/template/" + data._id;
            }
        }, function () {
            $scope.template = undefined;
        });
    };

    $scope.delete = function () {
        templateService.deleteTemplate($scope.template).then(function (data) {
            location.href = "#/templates";
        }, function (data) { });
        return false;
    };

});