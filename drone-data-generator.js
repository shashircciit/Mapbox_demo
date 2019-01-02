'use strict';

const Drone = require('./drone.js');
const { CENTER, calculateNewCoordinates, randomBetween } = require('./utils.js');

// Random missions from https://donjon.bin.sh/weird/random/
const MISSIONS = ["Torn to pieces by whirling blades.", "Bitten to death by swarms of centipedes.", "Electrocuted by a howling maelstrom of lightning.", "Imploded by a sorcerous artifact.", "Imploded by an eldritch machine.", "Drowned in ichor.", "Imploded by an eldritch device.", "Torn to pieces by whirling blades.", "Vivisected by an insane occultist.", "Mind consumed by uncontrolled paranoia.", "Drained of blood by a vampiric shadow.", "Bones shattered by by a demonic monstrosity.", "Flesh melted by acidic vapor.", "Fell into a howling maelstrom of lightning.", "Bones shattered by flailing chains.", "Bitten to death by venomous snakes.", "Drained of blood by an eldritch creature.", "Stabbed to death by a degenerate scientist.", "Fell into a howling maelstrom of fire."];

const OWNERS = ["Orville Pearson", "Jake Gordon", "Kim Turner", "Ashley Sparks", "Jill Smith", "Antonia Hampton", "Jane Greer", "Anita Matthews", "Martha Thompson", "Ricardo James", "Tracey Murphy", "Madeline Keller", "Andre Fletcher", "Kerry Lee", "Nettie Cole", "Gwen Coleman", "Leona Mann", "Mitchell Stewart", "Gail Mcbride", "Lucia Dixon", "Melissa Williams", "Heather Holt", "Julius Jefferson", "Bert Mendoza", "Troy Gardne"];

// Random pilot names from https://donjon.bin.sh/weird/name/#type=cm;cm=eldritch
const PILOTS = ["Anoth", "Cthagga", "Nyogth-Cthanarth", "Yithatan", "Ktyng-Athoth", "Yath-Gnyarlyu", "Kad-Shoggua", "Bha-Rhuulmell", "Zaoth-Shuulmith", "Gheemoga"];

function DroneDataGenerator (count) {
    const droneData = [];

    while (count > 0) {
        const center = calculateNewCoordinates(CENTER);
        const mission = MISSIONS[randomBetween(0, MISSIONS.length)];
        const owner = OWNERS[randomBetween(0, OWNERS.length)];
        const pilot = PILOTS[randomBetween(0, PILOTS.length)];

        droneData.push(new Drone({
            center,
            mission,
            owner,
            pilot,
        }));

        count--;
    }

    return droneData;
}

module.exports = DroneDataGenerator;
