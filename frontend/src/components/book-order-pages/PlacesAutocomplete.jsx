import { forwardRef, useEffect, useState } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { useBookOrder } from "../../contexts/BookOrderContext";
import { useMap } from "../../contexts/MapContext";

export const PlacesAutocomplete = ({
  setSelected,
  selectedLocations,
  inputType,
  setPickup,
  setDropoff,
}) => {
  const {
    setOrigin,
    setDestination,
    setDirectionsResponse,
    setDistance,
    setDuration,
    duration,
    distance,
  } = useMap();
  const { locations, setTotalDistance, setTotalTime } = useBookOrder();

  useEffect(() => {
    if (locations) {
      if (inputType === "origin") {
        setValue(locations[0]?.address);
      } else {
        setValue(locations[1]?.address);
      }
    }
  }, []);

  const [selected1, selected2] = selectedLocations;
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete({
    
  });

  const handleSelect1 = async (address) => {
    setValue(address, false);
    clearSuggestions();

    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0]);
    if (inputType === "origin") {
      setPickup({ type:"pickup",address, lat, lng });
    } else {
      setDropoff({ type:"dropoff", address, lat, lng });
    }
    setSelected({ lat, lng });
  };

  async function calculateRoute() {
    const directionsService = new google.maps.DirectionsService(); // eslint-disable-line
    const results = await directionsService.route({
      origin: selected1,
      destination: selected2,
      travelMode: google.maps.TravelMode.DRIVING, // eslint-disable-line
    });
    setDirectionsResponse(results);
    // calculate distance here
    setDistance(results.routes[0]?.legs[0]?.distance?.text);
    setTotalDistance(distance)
    // console.log(distance, "this is distance");
    // calculate time here
    setDuration(results.routes[0]?.legs[0]?.duration?.text);
    setTotalTime(duration)
    
    // console.log(duration, "this is time");
  }

  useEffect(() => {
    if (
      selected1?.lat !== null &&
      selected1?.lat !== undefined &&
      selected2?.lat !== null &&
      selected2?.lat !== undefined
    ) {
      setOrigin(selected1);
      setDestination(selected2);

      calculateRoute();
    }
  }, [selected1?.lat, selected2?.lat]);

  return (
    <div>
      <input
        value={value}
        type="text"
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        placeholder={"Search for an address"}
      />
      <div className="locations--list">
        {status === "OK" &&
          data.map(({ place_id, description }) => {
            return (
              <div key={place_id}>
                <p onClick={() => handleSelect1(description)}>{description}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
};
