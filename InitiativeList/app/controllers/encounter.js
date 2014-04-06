app.controller('EncounterListController', function ($scope, encounterService) {
    $scope.encounters = [];

    encounterService.getEncounters().then(function (data) {
        $scope.encounters = data;
    }, function () {
        $scope.encounters = undefined;
    });
});


app.controller('EncounterController', function ($scope, $routeParams, encounterService, partyService, templateService) {
    function init() {
        $scope.templateCount = 1;
        if ($routeParams.encounterId == '_new') {
            $scope.encounter = {};
            $scope.id = $routeParams.encounterId;
        } else {
            encounterService.getEncounter($routeParams.encounterId).then(function (data) {
                $scope.encounter = data;
                $scope.id = data._id;
            }, function () {
                $scope.encounter = {};
            });
        }

        partyService.getParties().then(function (data) {
            $scope.parties = data;
        }, function () {
            $scope.parties = undefined;
        });

        templateService.getTemplates().then(function (data) {
            $scope.templates = data;
        }, function () {
            $scope.templates = undefined;
        });

    };

    $scope.save = function () {
        encounterService.setEncounter($scope.encounter).then(function (data) {
            location.href = "#/encounter/" + data._id;
        }, function () {
            $scope.encounter = undefined;
        });
    };

    $scope.delete = function () {
        encounterService.deleteEncounter($scope.encounter).then(function (data) {
            location.href = "#/encounters";
        }, function (data) { });
        return false;
    };

    Character = function (initData) {
        this.name = initData.name;
        this.tag = initData.tag;
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
    }


    $scope.addParty = function (party) {
        if (!$scope.encounter)
            return;
        if (!$scope.encounter.characters)
            $scope.encounter.characters = [];
        var hasPlayer = false;
        var characterNames = $scope.encounter.characters.map(function (character) { return character.name; });
        angular.forEach(party.players, function (player) {
            if (characterNames.indexOf(player.name) != -1) {
                hasPlayer = true;
            }
        });
        if (!hasPlayer) {
            angular.forEach(party.players, function (player) {
                $scope.encounter.characters.push(new Character(player));
            });
        };
    };

    $scope.addTemplate = function (template, count) {
        if (!$scope.encounter)
            return;
        if (!$scope.encounter.characters)
            $scope.encounter.characters = [];
        var npcNames = $scope.encounter.characters.map(function (character) { return character.name; });
        var n = 1;
        for (var i = 0; i < count; i++) {
            var character = new Character(template);
            if (count > 1 || npcNames.indexOf(character.name) != -1) {
                do {
                    character.name = template.name + " " + n;
                    n++;
                } while (npcNames.indexOf(character.name) != -1);
            }
            $scope.encounter.characters.push(character);
        };
    };

    $scope.addSelectedParty = function () {
        if ($scope.selectedParty) {
            partyService.getParty($scope.selectedParty.id).then(function (data) {
                $scope.addParty(data);
            }, function () { });
        }
    }

    $scope.addSelectedTemplate = function () {
        if ($scope.selectedTemplate) {
            templateService.getTemplate($scope.selectedTemplate.id).then(function (data) {
                $scope.addTemplate(data, $scope.templateCount);
            }, function () { });
        }
    }

    $scope.selectParty = function (party) {
        $scope.selectedParty = party;
    };

    $scope.selectTemplate = function (template) {
        $scope.selectedTemplate = template;
    };

    $scope.showCharacter = function (characterName) {
        encounterService.setEncounter($scope.encounter).then(function (data) {
            location.href = "#/encounter/" + data._id + "/character/" + characterName;
        }, function () {
            $scope.encounter = undefined;
        });
    }

    $scope.play = function () {
        encounterService.setEncounter($scope.encounter).then(function (data) {
            location.href = "#/game/" + data._id;
        }, function () {
            $scope.encounter = undefined;
        });
    }

    init();
});


app.controller('EncounterCharacterController', function ($scope, $routeParams, encounterService) {
    init();
    function init() {
        $scope.encounterId = $routeParams.encounterId;
        encounterService.getEncounter($routeParams.encounterId).then(function (data) {
            $scope.encounter = data;
            if ($routeParams.characterName == '_new') {
                $scope.character = {};
            } else if (!data.characters) {
                $scope.character = {};
            } else {
                var pos = data.characters.map(function (character) { return character.name; }).indexOf($routeParams.characterName);
                if (pos == -1) {
                    $scope.character = {};
                } else {
                    $scope.character = data.characters[pos];
                }
            }
        }, function () {
            $scope.character = {};
        });
    };

    $scope.save = function () {
        if ($scope.character && $scope.character.name) {
            if (!$scope.ecnounter.characters)
                $scope.encounter.characters = [];

            var pos = data.characters.map(function (character) { return character.name; }).indexOf($routeParams.characterName);
            if (pos == -1) {
                $scope.ecnounter.characters.push($scope.character);
            } else {
                $scope.encounter.characters[pos] = $scope.character;
            }
            encounterService.setEncounter($scope.encounterId).then(function (data) {
                location.href = "#/encounter/" + data._id;
            }, function () { });
        } else if ($scope.character && !$scope.character.name) {
            alert("Character name is required");
        }
    };

    $scope.delete = function () {
        encounterService.getEncounter($routeParams.encounterId).then(function (data) {
            if (!data.characters) {
                data.characters = [];
            };

            data.characters = data.characters.filter(function (character) { return character.name != $routeParams.characterName; });
            encounterService.setEncounter(data).then(function (data) {
                location.href = "#/encounter/" + $routeParams.encounterId;
            }, function () { });
        });
        return false;
    };

});