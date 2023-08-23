def calculate_fare(base_fare, cost_per_minute, cost_per_mile, booking_fee, ride_duration_minutes, ride_distance_miles):
    fare = (
        base_fare +
        cost_per_minute * ride_duration_minutes +
        cost_per_mile * ride_distance_miles +
        booking_fee
    )
    return fare

# Example usage
base_fare = 5  # Base fare in currency
cost_per_minute = 50  # Cost per minute in currency
cost_per_mile = 500  # Cost per mile in currency
booking_fee = 1000  # Booking fee in currency
ride_duration_minutes = 30  # Ride duration in minutes
ride_distance_miles = 5  # Ride distance in miles

fare = calculate_fare(base_fare, cost_per_minute, cost_per_mile, booking_fee, ride_duration_minutes, ride_distance_miles)
print(f"Your Fare: {fare}")
