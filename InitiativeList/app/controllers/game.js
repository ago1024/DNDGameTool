app.controller('GameListController', function ($scope, encounterService) {
    $scope.encounters = [];

    encounterService.getEncounters().then(function (data) {
        $scope.encounters = data;
    }, function () {
        $scope.encounters = undefined;
    });
});

app.controller('GameController', function ($scope, $routeParams, encounterService) {

    Character = function (initData) {
        this.name = initData.name;
        this.tag = initData.tag;
        this.initiative = initData.initiative;
        this.initBonus = initData.initBonus;
        this.armorClass = initData.armorClass;
        this.fortitude = initData.fortitude;
        this.reflex = initData.reflex;
        this.will = initData.will;
        this.bloodied = initData.bloodied;
        this.hp = initData.hp;

        this.meleeAttack = initData.meleeAttack;
        this.rangedAttack = initData.rangedAttack;
        this.ammo = initData.ammo;
        this.surges = initData.surges;

        this.mark = undefined;

        this.initiative = undefined;
        if (this.initBonus != undefined) {
            this.initiative = Math.floor((Math.random() * 20) + 1) + this.initBonus;
        }
    }

    $scope.characters = [];
    $scope.current = undefined;
    init();
    function init() {
        encounterService.getCharacters($routeParams.encounterId).then(function (data) {
            $scope.characters = [];

            angular.forEach(data, function (character) {
                $scope.characters.push(new Character(character));
            });
            resort();

            angular.forEach($scope.characters, function (character) {
                $scope.$watch(function () { return character.initiative }, resort);
                $scope.$watch(function () { return character.hp }, selectActive);
            })

            first($scope.characters);

        }, function () { $scope.characters = undefined; });

    }

    function selectActive() {
        var nextCharacters = $scope.characters.filter(function (element) { return element.initiative <= $scope.current && !element.defer && element.hp > 0; });
        first(nextCharacters);
    }

    function updateDeferred() {
        var deferred = $scope.characters.filter(function (element) { return element.defer; });
        angular.forEach(deferred, function (element) { element.initiative = $scope.current; });
    }

    function resort() {
        $scope.characters.sort(function (a, b) { return b.initiative - a.initiative });
        if ($scope.current != undefined) {
            selectActive();
        }
    }

    function first(list) {
        if (list.length > 0) {
            $scope.current = list[0].initiative;
        } else if ($scope.characters.length > 0) {
            $scope.current = $scope.characters[0].initiative;
        } else {
            $scope.current = undefined;
        }
    }

    $scope.toggleDeferred = function (character) {
        character.defer = !character.defer;
        resort();
        updateDeferred();
    }

    $scope.isDead = function (character) {
        return character.hp <= 0;
    }

    $scope.isActive = function (character) {
        return character.initiative == $scope.current && character.hp > 0;
    }

    $scope.first = function () {
        first($scope.characters);
    }

    $scope.next = function () {
        $scope.current--;
        selectActive();
        updateDeferred();
    };

    $scope.getIcon = function (character) {
        if (isDead(character))
            return 'glyphicon-remove-circle';
        else if (character.defer)
            return 'glyphicon-ban-circle';
        else if (isActive(character))
            return 'glyphicon-ok';
        else
            return 'glyphicon-remove';
    }
});