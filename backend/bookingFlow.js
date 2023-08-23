import driverLiveLocation from "./gettingLocation.js";
import riderLiveLocation from "./gettingLocation.js";

// Simulated data
const drivers = [
  {
    id: 1,
    name: "Driver 1",
    location: [driverrLiveLocation.lat, riderLiveLocation.lng],
    status: "online",
    onRide: false,
  },
  {
    id: 2,
    name: "Driver 2",
    location: [riderLiveLocation.lat2, riderLiveLocation.lon2],
    status: "online",
    onRide: false,
  },
  // ... more drivers
];

const riders = [
  {
    id: 101,
    name: "Rider 1",
    location: [latRider, lonRider],
    rideInProgress: false,
  },
  // ... more riders
];

const rideRadius = 1; // in miles

// Step 1: Rider initiates a booking request
function initiateBooking(riderId) {
  const rider = riders.find((r) => r.id === riderId);
  const nearbyAvailableDrivers = findNearbyAvailableDrivers(rider.location);

  // Step 3: Recommendation and Notification
  if (nearbyAvailableDrivers.length > 0) {
    notifyRider(nearbyAvailableDrivers);
    const selectedDriver = riderChoosesDriver(nearbyAvailableDrivers);
    if (selectedDriver) {
      notifyDriver(selectedDriver);
      driverAcceptsRide(selectedDriver, rider);
    }
  }
}

// Step 2: Find available drivers nearby
function findNearbyAvailableDrivers(riderLocation) {
  return drivers.filter(
    (driver) =>
      !driver.onRide &&
      driver.status === "online" &&
      calculateDistance(driver.location, riderLocation) <= rideRadius
  );
}

// Step 4: Rider chooses a driver
function riderChoosesDriver(nearbyDrivers) {
  // Simulated selection logic (could be based on UI interaction)
  return nearbyDrivers[0]; // Choose the first available driver for simplicity
}

// Step 5: Driver accepts the ride
function driverAcceptsRide(driver, rider) {
  driver.onRide = true;
  rider.rideInProgress = true;

  // Simulate ride completion
  completeRide(driver, rider);
}

// Simulated ride completion
function completeRide(driver, rider) {
  // Fare calculation logic goes here
  const fare = calculateFare(/* parameters */);

  // Simulate payment processing
  processPayment(driver, rider, fare);

  // Update driver and rider status
  driver.onRide = false;
  rider.rideInProgress = false;
}

// Simulated functions
function calculateDistance(location1, location2) {
  // Simplified distance calculation using coordinates
  const [lat1, lon1] = location1;
  const [lat2, lon2] = location2;
  return Math.sqrt((lat1 - lat2) ** 2 + (lon1 - lon2) ** 2);
}

function notifyRider(drivers) {
  console.log(
    `Notifying rider about available drivers: ${drivers.map((d) => d.name)}`
  );
}

function notifyDriver(driver) {
  console.log(`Notifying driver ${driver.name} about ride request`);
}

function processPayment(driver, rider, fare) {
  console.log(
    `Processing payment: Driver ${driver.name} receives ${fare} from rider ${rider.name}`
  );
}

// Example usage
const riderId = 101;
initiateBooking(riderId);
