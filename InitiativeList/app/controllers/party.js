app.controller('PartyListController', function ($scope, partyService) {
    $scope.parties = [];

    partyService.getParties().then(function (data) {
        $scope.parties = data;
    }, function () {
        $scope.parties = undefined;
    });
});

app.controller('PartyController', function ($scope, $routeParams, partyService) {
    function init() {
        if ($routeParams.partyId == '_new') {
            $scope.party = {};
            $scope.id = $routeParams.partyId;
        } else {
            partyService.getParty($routeParams.partyId).then(function (data) {
                $scope.party = data;
                $scope.id = data._id;
            }, function () {
                $scope.party = undefined;
            });
        }
    };

    $scope.save = function () {
        partyService.setParty($scope.party).then(function (data) {
            location.href = "#/party/" + data._id;
        }, function () {
            $scope.party = undefined;
        });
    };

    $scope.addPlayer = function () {
        if (!$scope.party.players) {
            $scope.party.players = [];
        }
        $scope.party.players.push({ name: 'New player' });
    };

    $scope.deletePlayer = function (player) {
        if (player && $scope.party && $scope.party.players) {
            $scope.party.players = $scope.party.players.filter(function (element) { return !(element === player) });
        }
    };

    $scope.delete = function () {
        partyService.deleteParty($scope.party).then(function (data) {
            location.href = "#/parties";
        }, function (data) { });
        return false;
    };

    init();
});
