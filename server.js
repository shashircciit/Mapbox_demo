'use strict';

const express = require('express');
const uuidV4 = require('uuid/v4');

const { CENTER } = require('./utils.js');

const app = express();
const port = process.env.PORT || 3000;

const MEMOIZED_DRONE_DATA = {
    timers: {},
};

const DroneDataGenerator = require('./drone-data-generator.js');

function cleanUp (requestID) {
    // Clean up in another 10 minutes
    // This should be fine-tuned depending on the use case
    // This just exists here to prevent any memory-leaks
    return setTimeout(_ => {
        delete MEMOIZED_DRONE_DATA[requestID];
    }, 10 * 60 * 1000);
}

app.get('/initialize', (req, res) => {
    let count = parseInt(Number(req.query.count), 10);
    if (!count || count > 50) {
        count = 50;
    }

    const requestID = uuidV4();
    const newDroneData = new DroneDataGenerator(count);

    MEMOIZED_DRONE_DATA[requestID] = newDroneData;
    MEMOIZED_DRONE_DATA.timers[requestID] = cleanUp(requestID);

    return res.json({
        id: requestID,
        data: newDroneData,
        center: CENTER,
    });
});

app.post('/updates', express.json(), (req, res) => {
    const id = req.body.id;

    if (!id) {
        return res.status(412).json({
            error: 'Unique ID is required',
        });
    }

    if (!MEMOIZED_DRONE_DATA[id]) {
        return res.status(204).json({
            data: {},
        });
    }

    const requestData = MEMOIZED_DRONE_DATA[id];
    requestData.forEach(drone => drone.updateCoordinates());

    // Reset the cleanup timer
    const timer = MEMOIZED_DRONE_DATA.timers[id];
    clearTimeout(timer);
    MEMOIZED_DRONE_DATA.timers[id] = cleanUp(id);

    return res.json({
        data: MEMOIZED_DRONE_DATA[id],
    });
});

app.get('/*', express.static('public', {
    etag: true,
    fallthrough: false,
}));

app.listen(port, () => {
    console.log(`Serving on port ${port}`);
});
