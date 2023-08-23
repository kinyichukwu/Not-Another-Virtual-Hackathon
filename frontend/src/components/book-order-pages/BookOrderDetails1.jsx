import React, { useEffect, useRef } from "react";
import { useState, useMemo } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { PlacesAutocomplete } from "./PlacesAutocomplete";
import { useMap } from "../../contexts/MapContext";
import { useBookOrder } from "../../contexts/BookOrderContext";
import { currentDate, currentTime} from "../../helpers/currentTimeAndDate";
import { ClipLoader } from "react-spinners";

const BookOrderDetails1 = ({ clickForward }) => {
  const { directionsResponse } = useMap();
  const { setLocations, setTransferType, setPickupDateTime, totalTime, totalDistance } = useBookOrder();
  const [pickup, setPickup] = useState(null);
  const [dropoff, setDropoff] = useState(null);
  const [selectTransferType, setSelectTransferType] = useState("One Way");

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: `${process.env.REACT_APP_GOOGLEMAPS_API_KEY}`,
    libraries: ["places"],
  });
  const center = useMemo(
    () => ({ lat: 18.017443423458225, lng: -76.80649334431106 }),
    []
  );
  

  useEffect(() => {
    setPickup(pickup);
    setDropoff(dropoff)
  }, [pickup, dropoff])
  

  const [selected1, setSelected1] = useState(null);
  const [selected2, setSelected2] = useState(null);

  const polylineOptions = {
    strokeColor: "red",
    strokeOpacity: 0.8,
    strokeWeight: 5,
  };

  if (!isLoaded) return <div style={{padding:"2.5rem", display:"flex", alignItems:"center", justifyContent:"center"}}><ClipLoader size={40} color="red"/></div>;

  return (
    <div className="order-details1-container">
      <div className="info">
        <div className="tabs">
          <p>Distance</p>
        </div>
        <div className="heading">
          <h3>Ride Details</h3>
        </div>
        <div className="date-time">
          <div className="date">
            <p>Pickup Date</p>
            <h3>{currentDate()}</h3>
          </div>
          <div className="time">
            <p>Pickup Time</p>
            <h3>{currentTime()}</h3>
          </div>
        </div>
        <div className="pickup-location">
          <div className="left">
            <p id="label">Pickup Location</p>
            <PlacesAutocomplete
              setSelected={setSelected1}
              selectedLocations={[selected1, null]}
              inputType={"origin"}
              setPickup={(e) => setPickup(e)}
            />
          </div>
          <div className="add-location">
            <p>+</p>
          </div>
        </div>
        <div className="dropoff-location">
          <p id="label">Drop Off Location</p>
          <PlacesAutocomplete
            setSelected={setSelected2}
            selectedLocations={[selected1, selected2]}
            inputType={"destination"}
            setDropoff={(e) => setDropoff(e)}
          />
        </div>
        <div className="transfer-type">
          <p id="label">Transfer Type</p>
          <select
            onChange={(e) => setSelectTransferType(e.target.value)}
            name="type"
            id=""
          >
            <option value="One Way">One Way</option>
          </select>
        </div>
        <div className="heading">
          <h3>Extra Details</h3>
        </div>
        <div className="extra-time">
          <p id="label">Extra Time</p>
          <select name="type" id="">
            <option value="0">0 hour(s)</option>
          </select>
        </div>
      </div>

      <div className="map">
        <GoogleMap
          zoom={10}
          center={center}
          options={{
            zoomControl: false,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          mapContainerClassName="map-container"
        >
          {selected1 && <Marker position={selected1} />}
          {selected2 && <Marker position={selected2} />}
          {directionsResponse && (
            <DirectionsRenderer
              options={{ polylineOptions }}
              directions={directionsResponse}
            />
          )}
        </GoogleMap>

        <div
          style={{ opacity: pickup && dropoff && totalTime !== "" && totalDistance !== "" ? 1 : 0.5 }}
          onClick={() => {
            if (pickup && dropoff && totalTime !== "" && totalDistance !== "") {
              console.log(pickup, dropoff);
              setLocations([pickup, dropoff])
              setTransferType(selectTransferType);
              setPickupDateTime({date:currentDate(), time:currentTime()})
              clickForward();
            }
          }}
          className="continue"
        >
          <p>Continue &#8594;</p>
        </div>
      </div>
    </div>
  );
};

export default BookOrderDetails1;
