'use strict';

const { calculateNewCoordinates, randomBetween } = require('./utils.js')

const deadProps = {
    altitude: 0,
    velocity: 0,
    battery: 0,
    mission: null,
};

function Drone({ center, mission, owner, pilot }) {
    this.properties = {
        altitude: 0,
        velocity: 0,
        battery: 100,
        mission: mission,
        owner: owner,
        pilot: pilot,
    };
    
    this.moving = false;
    
    this.geometry = {
        type: 'Point',
        coordinates: center,
    };
    
    this.type = 'Feature';
}

Drone.prototype.updateProperties = function () {
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
}

Drone.prototype.updateCoordinates = function () {
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
}

Drone.prototype.die = function () {
    this.properties = Object.assign(this.properties, deadProps);
}

module.exports = Drone;
