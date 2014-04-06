
var app = angular.module('initiativeApp', [
    'ngRoute',
    'ui.bootstrap',
    'xeditable'
]);

app.run(function (editableOptions) {
    editableOptions.theme = 'bs3';
});

app.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/game/:encounterId', {
                templateUrl: 'partials/game-mode.html',
                controller: 'GameController'
            }).
            when('/games', {
                templateUrl: 'partials/game-list.html',
                controller: 'GameListController'
            }).
            when('/encounters', {
                templateUrl: 'partials/encounter-list.html',
                controller: 'EncounterListController'
            }).
            when('/encounter/:encounterId/character/:characterName', {
                templateUrl: 'partials/encounter-character.html',
                controller: 'EncounterCharacterController'
            }).
            when('/encounter/:encounterId', {
                templateUrl: 'partials/encounter-view.html',
                controller: 'EncounterController'
            }).
            when('/templates', {
                templateUrl: 'partials/template-list.html',
                controller: 'TemplateListController'
            }).
            when('/template/:templateId', {
                templateUrl: 'partials/template-view.html',
                controller: 'TemplateController'
            }).
            when('/parties', {
                templateUrl: 'partials/party-list.html',
                controller: 'PartyListController'
            }).
            when('/party/:partyId/player/:playerName', {
                templateUrl: 'partials/player-view.html',
                controller: 'PlayerController'
            }).
            when('/party/:partyId', {
                templateUrl: 'partials/party-view.html',
                controller: 'PartyController'
            }).
            when('/setup', {
                templateUrl: 'partials/setup.html',
            }).
            when('/startpage', {
                templateUrl: 'partials/startpage.html',
                controller: 'StartpageController'
            }).
            otherwise({
                redirectTo: 'startpage'
            });
    }]);

// override the default input to update on blur
app.directive('ngModelOnblur', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elm, attr, ngModelCtrl) {
            if (attr.type === 'radio' || attr.type === 'checkbox') return;

            elm.bind('focus', function () {
                elm.unbind('input').unbind('keydown').unbind('change');
            });
            elm.unbind('input').unbind('keydown').unbind('change');
            elm.bind('blur', function () {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(elm.val());
                });
            });
        }
    };
});
app.directive('ngModelOnchange', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, elm, attr, ngModelCtrl) {
            if (attr.type === 'radio' || attr.type === 'checkbox') return;

            elm.bind('focus', function () {
                elm.unbind('input').unbind('keydown');
            });
            elm.unbind('input').unbind('keydown');
            elm.bind('change', function () {
                scope.$apply(function () {
                    ngModelCtrl.$setViewValue(elm.val());
                });
            });
        }
    };
});

app.filter('groupBy', function () {
    var uniqueItems = function (data, index, caseSensitive) {
        var result = [];
        var keys = [];
        for (var i = 0; i < data.length; i++) {
            var value = data[i][index];
            var key = value;
            if (!caseSensitive && value)
                key = value.toLowerCase();
            if (keys.indexOf(key) == -1) {
                keys.push(key);
                result.push(value);
            };
        };
        return result;
    };

    return function (collection, key, caseSensitive) {
        if (collection === null) return;
        return uniqueItems(collection, key, caseSensitive);
    };
});