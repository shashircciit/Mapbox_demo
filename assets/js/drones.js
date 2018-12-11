// List of random names from http://random-name-generator.info/
const OWNERS = ["Orville Pearson", "Jake Gordon", "Kim Turner", "Ashley Sparks", "Jill Smith", "Antonia Hampton", "Jane Greer", "Anita Matthews", "Martha Thompson", "Ricardo James", "Tracey Murphy", "Madeline Keller", "Andre Fletcher", "Kerry Lee", "Nettie Cole", "Gwen Coleman", "Leona Mann", "Mitchell Stewart", "Gail Mcbride", "Lucia Dixon", "Melissa Williams", "Heather Holt", "Julius Jefferson", "Bert Mendoza", "Troy Gardne"];
// Random missions from https://donjon.bin.sh/weird/random/
const MISSIONS = ["Torn to pieces by whirling blades.", "Bitten to death by swarms of centipedes.", "Electrocuted by a howling maelstrom of lightning.", "Imploded by a sorcerous artifact.", "Imploded by an eldritch machine.", "Drowned in ichor.", "Imploded by an eldritch device.", "Torn to pieces by whirling blades.", "Vivisected by an insane occultist.", "Mind consumed by uncontrolled paranoia.", "Drained of blood by a vampiric shadow.", "Bones shattered by by a demonic monstrosity.", "Flesh melted by acidic vapor.", "Fell into a howling maelstrom of lightning.", "Bones shattered by flailing chains.", "Bitten to death by venomous snakes.", "Drained of blood by an eldritch creature.", "Stabbed to death by a degenerate scientist.", "Fell into a howling maelstrom of fire."];
// Random pilot names from https://donjon.bin.sh/weird/name/#type=cm;cm=eldritch
const PILOTS = ["Anoth", "Cthagga", "Nyogth-Cthanarth", "Yithatan", "Ktyng-Athoth", "Yath-Gnyarlyu", "Kad-Shoggua", "Bha-Rhuulmell", "Zaoth-Shuulmith", "Gheemoga"];

// Center of the map to be rendered - Bangalore
const CENTER = window.CENTER = [77.62, 12.95];
const MAX_DEVIATION = 2;
// We will choose a resolution of 4000 for drones
// This will allow them to occupy co-ordinates which are multiples of 0.0005
const RESOLUTION = 40000;

function plusOrMinus () {
    return Math.random() < 0.5 ? -1 : 1;
}

function randomBetween (min, max) {
    return min + Math.floor(Math.random() * (max - min));
}

function calculateNewCoordinates (oldCordinates) {
    const longitude = oldCordinates[0] + (plusOrMinus() * MAX_DEVIATION * randomBetween(0, RESOLUTION) / (100 * RESOLUTION));
    const latitude = oldCordinates[1] + (plusOrMinus() * MAX_DEVIATION * randomBetween(0, RESOLUTION) / (100 * RESOLUTION));

    return [longitude, latitude];
}

// Ideally all the member methods implemented here should have been on Drone.prototype
// For some reason, that does not work and we end up with this
// I assume the way mapboxgl serializes the sources it uses, it destroys everything
// except own properties. The prototype references are dropped and not accessible
function Drone (map) {
    this.properties = {
        altitude: 0,
        velocity: 0,
        battery: 100,
        mission: MISSIONS[Math.floor(Math.random() * MISSIONS.length)],
        owner: OWNERS[Math.floor(Math.random() * OWNERS.length)],
        pilot: PILOTS[Math.floor(Math.random() * PILOTS.length)],
    };

    this.moving = false;

    this.geometry = {
        type: 'Point',
        coordinates: calculateNewCoordinates(CENTER),
    };

    this.type = 'Feature';

    this.updateProperties = function () {
        // Increase the velocity and altitude, decrease the battery by a random amount
        const altitudeDelta = randomBetween(-2, 3);
        const velocityDelta = randomBetween(-1, 2);
        const batteryDelta = randomBetween(-4, 0);

        if (this.properties.altitude + altitudeDelta <= 0) {
            this.properties.altitude += randomBetween(1, 4);
        } else {
            this.properties.altitude += altitudeDelta;
        }

        if (this.properties.velocity + velocityDelta <= 0) {
            this.properties.velocity += randomBetween(0, 3);
        } else {
            this.properties.velocity += velocityDelta;
        }

        if (this.properties.battery + batteryDelta <= 0) {
            return this.die();
        } else {
            this.properties.battery += batteryDelta;
        }
    };

    this.updateCoordinates = function () {
        if (this.properties.battery <= 0) {
            this.moving = false;
            return this.die();
        } else {
            this.moving = true;
        }

        const coordinates = calculateNewCoordinates(this.geometry.coordinates);
        this.geometry.coordinates = coordinates;
        // Also update various other details about the drone
        this.updateProperties();
    };

    this.die = function () {
        this.properties = Object.assign(this.properties, {
            altitude: 0,
            velocity: 0,
            battery: 0,
            mission: undefined,
        });
    };
}

(function DroneFactory(parent) {
    const MAX_DRONES = 50;
    let drones = [];

    function initiateDrones (map, count) {
        if (count > MAX_DRONES) {
            count = MAX_DRONES;
        }

        // Clear out the drones cache for new call
        drones = [];

        for (let i = 0; i < count; i++) {
            drones[i] = new Drone(map);
        }

        return drones;
    }

    function updateDroneDetails (map) {
        drones.forEach(drone => {
            drone.updateCoordinates();
        });
        map.getSource('dronesSource').setData({
            type: 'FeatureCollection',
            features: drones,
        });
    }

    parent.DRONES = parent.DRONES || {
        initiate: initiateDrones,
        update: updateDroneDetails,
    };
}(window));