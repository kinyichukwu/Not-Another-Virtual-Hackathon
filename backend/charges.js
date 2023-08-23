export defualt function calculateFare(
  baseFare,
  costPerMinute,
  costPerMile,
  bookingFee,
  rideDurationMinutes,
  rideDistanceMiles
) {
  const fare =
    baseFare +
    costPerMinute * rideDurationMinutes +
    costPerMile * rideDistanceMiles +
    bookingFee;
  return fare;
}

// Example usage
const baseFare = 5; // Base fare in currency
const costPerMinute = 50; // Cost per minute in currency
const costPerMile = 500; // Cost per mile in currency
const bookingFee = 1000; // Booking fee in currency
const rideDurationMinutes = 30; // Ride duration in minutes
const rideDistanceMiles = 5; // Ride distance in miles

const fare = calculateFare(
  baseFare,
  costPerMinute,
  costPerMile,
  bookingFee,
  rideDurationMinutes,
  rideDistanceMiles
);
console.log(`Your Fare: ${fare}`);
