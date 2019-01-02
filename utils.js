'use strict';

// Somewhere in Bangalore
const CENTER = [77.62, 12.95];

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

module.exports = {
    CENTER,
    calculateNewCoordinates,
    plusOrMinus,
    randomBetween,
};
