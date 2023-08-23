
const src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places"></script>
//   <p>Driver's Live Location: <span id="driver-location"></span></p>
//   <p>Rider's Live Location: <span id="rider-location"></span></p>

//   <script>
    // Replace with your Google Maps API key
    const API_KEY = 'YOUR_API_KEY';

    // Variables to store the live locations
export const  driverLiveLocation = null;
export const  riderLiveLocation = null;


    // Function to update the driver's live location
    function updateDriverLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          position => {
            driverLiveLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            // return driverLiveLocation;
            // document.getElementById('driver-location').textContent = `${driverLiveLocation.lat}, ${driverLiveLocation.lng}`;
          },
          error => {
            console.error('Error getting driver location:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    }

    // Function to update the rider's live location
    function updateRiderLocation() {
      if (navigator.geolocation) {
        navigator.geolocation.watchPosition(
          position => {
            riderLiveLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            // return riderLiveLocation;
            // document.getElementById('rider-location').textContent = `${riderLiveLocation.lat}, ${riderLiveLocation.lng}`;
          },
          error => {
            console.error('Error getting rider location:', error);
          }
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    }


    // Call the updateLocation functions to start tracking
    updateDriverLocation();
    updateRiderLocation();
