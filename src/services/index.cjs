const express = require('express');
const http = require('http');
const app = express();
const server = http.createServer(app);
const {Server} = require('socket.io');
// const io = socketIO(server);
const port = 3000;
const cors = require('cors');
corsOptions = {
    origin: "*",
}
app.use(cors(corsOptions));
const io = new Server(server, {
    cors: {
        origin: "*",
    }
});


app.get('/', (req, res) => {
    res.send('Hello World!');
});


io.on('connection', socket => {
    console.log('socket connestion established');

    fetchTripData(socket)
    socket.on('disconnect', () => console.log('socket connection disconnected'));
});

async function fetchTripData(socket) {
    const mapboxAccessToken = "pk.eyJ1IjoiZGFuaXNoYW5zYXJpMjIiLCJhIjoiY2xsM3FkNzg2MDh5azNkbjIzbDUwZGYxZSJ9.fzYmv5CUuOYU5-79SJYINA"
    const waypoints = '82.539876,22.339444;82.170562,22.057430'
    const options = {
        profile: 'mapbox/driving',
        geometries: 'geojson', // Request GeoJSON format
    };

    const optionsQuery = new URLSearchParams(options).toString();
    try {
        const response = await fetch(
            `https://api.mapbox.com/directions/v5/mapbox/driving/${waypoints}?geometries=geojson&access_token=${mapboxAccessToken}`
        );

        if (response.ok) {
            const tripData = await response.json();
            console.log('Trip data from Mapbox API:', tripData.routes[0].geometry.coordinates);
              simulateCarMovement(socket, tripData.routes[0].geometry.coordinates);
                console.log('Trip data from Mapbox API:', tripData.routes[0].geometry.coordinates)
              socket.emit('tripData', tripData.routes[0].geometry.coordinates);
        } else {
            console.error('Failed to fetch trip data from Mapbox', response);
        }
    } catch (error) {
        console.error('Error fetching trip data from Mapbox:', error);
    }

}

function simulateCarMovement(socket, routeCoordinates) {
    // console.log('Simulating car movement');
    let currentIndex = 0;
    let carDistance = 0;
    const carSpeed = 0.1; // 1 meter per 10 seconds (adjust as needed)
    const updateInterval = 1000; // Update every 1 second

    const simulateCar = () => {
        if (currentIndex < routeCoordinates.length - 1) {
            // console.log("Current index", currentIndex);
            const currentCoordinate = routeCoordinates[currentIndex];
            const nextCoordinate = routeCoordinates[currentIndex + 1];

            const distanceToNext = calculateDistance(currentCoordinate, nextCoordinate);

            if (carDistance >= distanceToNext) {
                // Move to the next segment of the route
                currentIndex++;
                carDistance = 0;
            }

            // Calculate the car's position
            const carPosition = interpolateCoordinates(
                currentCoordinate,
                nextCoordinate,
                carDistance / distanceToNext
            );

            const carData = {
                coordinates: carPosition,
                timestamp: Date.now(),
            };

            socket.emit('carData', carData);
            // console.log('Car data sent:', carData);
            carDistance += carSpeed;

            setTimeout(simulateCar, updateInterval);
        }
    };
    simulateCar();
}
function calculateDistance(coord1, coord2) {
    // Implementation of Haversine formula to calculate distance
    console.log('Calculating distance');
    const [lat1, lon1] = coord1;
    const [lat2, lon2] = coord2;
    const R = 6371e3; // Earth radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

// Function to interpolate coordinates between two points
function interpolateCoordinates(coord1, coord2, fraction) {
    console.log('Interpolating coordinates');
    const lat1 = coord1[1];
    const lon1 = coord1[0];
    const lat2 = coord2[1];
    const lon2 = coord2[0];

    const lat = lat1 + fraction * (lat2 - lat1);
    const lon = lon1 + fraction * (lon2 - lon1);

    return [lon, lat];
}





server.listen(port, () => console.log(`Listening on port ${port}`));