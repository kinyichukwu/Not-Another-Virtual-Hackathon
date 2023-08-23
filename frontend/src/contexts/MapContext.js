import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection } from "firebase/firestore";
import { database } from "../firebaseConfig";
import { locations } from "../helpers/testLocations";
import { toast } from "react-toastify";

const MapContext = createContext();

export const useMap = () => {
  return useContext(MapContext);
};

const MapProvider = ({ children }) => {
  let map;
  const navigate = useNavigate();
  const usersRef = collection(database, "usersList");

  const [loading, setLoading] = useState(false);

  // states
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [transportType, setTransportType] = useState("");
  const [directionsResponse, setDirectionsResponse] = useState(null)

  // set markers position on map
  const markerOrigin =
    origin != null
      ? { lat: origin?.lat, lng: origin?.lng }
      : { lat: 0, lng: 0 };
  const markerDestination =
    destination != null
      ? { lat: destination?.lat, lng: destination?.lng }
      : { lat: 0, lng: 0 };

  const handleOriginChange = (index, setShowModal) => {
    const selectedLocation = locations[index];
    setOrigin(selectedLocation);
    setShowModal(false);
  };

  const handleDestinationChange = (index, setShowModal) => {
    const selectedLocation = locations[index];
    setDestination(selectedLocation);
    setShowModal(false);
  };

  async function getDirections() {
    map = new window.google.maps.Map(document.getElementById("map-container"), {
      center: { lat: 18.017443423458225, lng: -76.80649334431106 },
      zoom: 12,
      mapTypeControl: false,
    });

    if (markerOrigin.lat != 0 && markerDestination.lat != 0) {
      const directionsService = new window.google.maps.DirectionsService();
      const directionsRenderer = new window.google.maps.DirectionsRenderer(
        {polylineOptions : {
          strokeColor: 'red',
          strokeOpacity: 0.8,
          strokeWeight: 5,
        }});

      directionsRenderer.setMap(map);

      const origin = markerOrigin;
      const destination = markerDestination;

      const result = await directionsService.route(
        {
          origin: origin,
          destination: destination,
          travelMode: window.google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === window.google.maps.DirectionsStatus.OK) {
            directionsRenderer.setDirections(response);

            // create custom labels for markers
            new window.google.maps.Marker({
              position: origin,
              label: "Pickup Area",
              map: map,
            });

            new window.google.maps.Marker({
              position: destination,
              label: "Drop off Location",
              map: map,
            });
            setLoading(false)
          } else {
            console.log("Directions request failed due to " + status);
          }
        }
      );

      setDirectionsResponse(result)
    }
  }

  const calculateDistance = async () => {
    setLoading(true)
    if (origin && destination) {
      const service = new window.google.maps.DistanceMatrixService();
      const originLatLng = new window.google.maps.LatLng(
        origin.lat,
        origin.lng
      );
      const destinationLatLng = new window.google.maps.LatLng(
        destination.lat,
        destination.lng
      );
      service.getDistanceMatrix(
        {
          origins: [originLatLng],
          destinations: [destinationLatLng],
          travelMode: window.google.maps.TravelMode.DRIVING,
          unitSystem: window.google.maps.UnitSystem.IMPERIAL,
        },
        async (response, status) => {
          if (status === "OK") {
            const distanceInMiles = response.rows[0].elements[0].distance.text;
            const formattedDistance = distanceInMiles.replace(" mi", "");
            const convertToNum = parseFloat(formattedDistance);
            const distanceInKm = convertToNum * 1.60934;
            const tripDuration = response.rows[0].elements[0].duration.text;
            setDistance(distanceInKm.toFixed(2) + " km");
            setDuration(tripDuration);
            await getDirections();
          } else {
            setLoading(false);
            console.log("Error: " + status);
            toast.error("Network error. Retry...");
          }
        }
      );
    }
  };

  const value = {
    navigate,
    loading,
    origin,
    setOrigin,
    destination,
    setDestination,
    distance,
    setDistance,
    duration,
    setDuration,
    transportType,
    setTransportType,
    markerOrigin,
    markerDestination,
    handleOriginChange,
    handleDestinationChange,
    calculateDistance,
    getDirections,
    directionsResponse,
    setDirectionsResponse,
    
  };

  return <MapContext.Provider value={value}>{children}</MapContext.Provider>;
};

export default MapProvider;