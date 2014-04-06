app.controller('PlayerController', function ($scope, $routeParams, partyService) {

    init();
    function init() {
        $scope.partyId = $routeParams.partyId;
        if ($routeParams.partyId == '_new') {
            $scope.player = {};
            $scope.party = {};
        } else {
            partyService.getParty($routeParams.partyId).then(function (data) {
                $scope.party = data;
                if ($routeParams.playerName == '_new') {
                    $scope.player = {};
                } else if (data.players && data.players[$routeParams.playerName]) {
                    $scope.player = data.players[$routeParams.playerName];
                } else {
                    $scope.player = {};
                }
            }, function () {
                $scope.player = undefined;
            });
        }
    };

    $scope.save = function () {
        if ($scope.player && $scope.player.name) {
            if (!$scope.party.players)
                $scope.party.players = {};
            $scope.party.players[$scope.player.name] = $scope.player;
            partyService.setParty($scope.party).then(function (data) {
                location.href = "#/party/" + data._id;
            }, function () { });
        } else if ($scope.player && !$scope.player.name) {
            alert("Player name is required");
        }
    };

    $scope.delete = function () {
        partyService.getParty($routeParams.partyId).then(function (data) {
            if (!data.players) {
                data.players = {};
            };
            delete data.players[$scope.player.name];
            partyService.setParty(data).then(function (data) {
                location.href = "#/party/" + $routeParams.partyId;
            }, function () { });
        });
        return false;
    };

});