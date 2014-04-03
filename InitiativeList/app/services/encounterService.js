app.service('encounterService', function () {
    Character = function () {

    }

    var characters = [];

    init();

    function iniRoll(bonus) {
        return Math.floor((Math.random() * 20) + 1) + bonus;
    }

    function initCharacters(characterData) {
        var keys = ['name', 'initBonus', 'initiative', 'armorClass', 'fortitude', 'reflex', 'will', 'bloodied', 'hp', 'meleeAttack', 'rangedAttack', 'ammo', 'surges'];
        var stringTypes = ['name', 'meleeAttack', 'rangedAttack'];

        return characterData.map(function (data) {
            var fields = data.split("\t");
            var character = {};
            angular.forEach(keys, function (key, index) {
                if (stringTypes.indexOf(key) != -1)
                    character[key] = fields[index];
                else
                    character[key] = parseInt(fields[index]) || undefined;
            });
            return character;
        });
    }

    function init() {
        var players = [];
        var npcs = [];

        var playerData = [
            'Warlord			18	14	15	12	12	24	+6 vs AC, 1d8+3	+2 vs AC, 1d8	20	8',
            'Wizard			14	12	15	14	11	23	+2 vs AC, 1d8	+4 vs Ref, 2d4+4		7',
            'Rogue			16	11	16	13		25	+5 vs AC, 1d4+1	+8 vs AC, 1d4+4	10	7',
            'Cleric			16	12	10	15	13	26	+3 vs AC, 1d8+1	+2 vs AC, 1d8	20	9',
            'Fighter			17	15	11	12	15	31	+6 vs AC, 2d6+3	+4 vs AC, 1d4+1	5	12',
            'Paladin			20	15	13	14	13	27	+7 vs AC, 1d8+4	+6 vs AC, 1d6+4	3	11',
        ];

        var npcData = [
            'Kobold Minion 1	3	8	15	11	13	11	0	1	+5 vs AC, 4	+5 vs AC, 4	3	0',
            'Kobold Minion 2	3	12	15	11	13	11	0	1	+5 vs AC, 4	+5 vs AC, 4	3	0',
            'Kobold Minion 3	3	7	15	11	13	11	0	1	+5 vs AC, 4	+5 vs AC, 4	3	0',
            'Kobold Minion 4	3	17	15	11	13	11	0	1	+5 vs AC, 4	+5 vs AC, 4	3	0',
            'Kobold Minion 5	3	4	15	11	13	11	0	1	+5 vs AC, 4	+5 vs AC, 4	3	0',
            'Kobold Minion 6	3	16	15	11	13	11	0	1	+5 vs AC, 4	+5 vs AC, 4	3	0',
            'Kobold Minion 7	3	4	15	11	13	11	0	1	+5 vs AC, 4	+5 vs AC, 4	3	0',
            'Kobold Minion 8	3	9	15	11	13	11	0	1	+5 vs AC, 4	+5 vs AC, 4	3	0',
            'Kobold Minion 9	3	8	15	11	13	11	0	1	+5 vs AC, 4	+5 vs AC, 4	3	0',
            'Kobold Minion 10	3	11	15	11	13	11	0	1	+5 vs AC, 4	+5 vs AC, 4	3	0',
            'Kobold Skirmisher	5	19	15	11	14	13	13	27	+6 vs AC, 1d8		0	0',
            'Kobold Dragonshield	4	12	18	14	13	13	18	36	+7 vs AC, 1d6+3		0	0',
            'Kobold Slinger	3	8	13	12	14	12	12	24	+5 vs AC, 1d4+3	+6 vs AC, 1d6+3	20	0',
        ];

        players = initCharacters(playerData);
        npcs = initCharacters(npcData);

        angular.forEach(players, function (value) {
            value.initBonus = 3;
            characters.push(value);
        });
        angular.forEach(npcs, function (value) {
            characters.push(value);
        });
    }

    this.getCharacters = function () {
        return characters;

    };

});