app.controller('StartpageController', function ($scope) {
});

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
        partyService.setParty($scope.party).then(function (data) {
            location.href = href = "#/party/" + data._id + "/player/_new";
        }, function () {
            $scope.party = undefined;
        });
    }


    $scope.delete = function () {
        partyService.deleteParty($scope.party).then(function (data) {
            location.href = "#/parties";
        }, function (data) { });
        return false;
    };

    init();
});

app.controller('TemplateListController', function ($scope, templateService) {
    $scope.templates = [];

    templateService.getTemplates().then(function (data) {
        $scope.templates = data;
    }, function () {
        $scope.templates = undefined;
    });
});

app.controller('TemplateController', function ($scope, $routeParams, templateService) {

    init();
    function init() {
        if ($routeParams.templateId == '_new') {
            $scope.template = {};
        } else {
            templateService.getTemplate($routeParams.templateId).then(function (data) {
                $scope.template = data;
            }, function () {
                $scope.template = undefined;
            });
        }
    };

    $scope.save = function () {
        templateService.setTemplate($scope.template).then(function (data) {
            location.href = "#/template/" + data._id;
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
        var characterNames = $scope.encounter.characters.map(function(character) { return character.name; });
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

    $scope.addSelectedParty = function() {
        if ($scope.selectedParty) {
            partyService.getParty($scope.selectedParty.id).then(function (data) {
                $scope.addParty(data);
            }, function() {});
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
            location.href = "#/game/" + data._id ;
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

    $scope.isActive = function(character) {
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
