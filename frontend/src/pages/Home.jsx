import React, { useEffect, useState } from "react";
import Location from "../assets/homeIcons/Vector.svg";
import HomepageModalMenu from "../components/homepage-components/homepage-modal-menu";
import { useUser } from "../contexts/UserContext";
import { Link, useNavigate } from "react-router-dom";
import { useMap } from "../contexts/MapContext";
import { locations } from "../helpers/testLocations";
import { useBookOrder } from "../contexts/BookOrderContext";
import { useUserData } from "../contexts/DataContext";

export const Home = () => {
  const { setLocations } = useBookOrder();
  const { user } = useUser();
  const { userInfo } = useUserData();
  const navigate = useNavigate();
  const {
    origin,
    destination,
    handleOriginChange,
    handleDestinationChange,
    distance,
    duration,
    calculateDistance,
    getDirections,
  } = useMap();

  useEffect(() => {
    if (userInfo.accountType === "driver") {
      navigate("/");
    }
  }, [userInfo]);

  // TODO: uncomment for production
  const apiKey = `${process.env.REACT_APP_GOOGLEMAPS_API_KEY}`;
  // const apiKey = "";

  const [originSearch, setOriginSearch] = useState(null);
  const [destinationSearch, setDestinationSearch] = useState(null);
  const [showOriginList, setShowOriginList] = useState(false);
  const [showDestinationList, setShowDestinationList] = useState(false);

  // TODO: remove location from origins list if it is selected in destination list
  // and vice versa
  let filteredOrigins = locations.filter((item) =>
    item.locationName?.toLowerCase().includes(originSearch?.toLowerCase())
  );
  let filteredDestinations = locations.filter((item) =>
    item.locationName?.toLowerCase().includes(destinationSearch?.toLowerCase())
  );

  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // inject script to html and load the google API
  function loadGoogleMapsScript() {
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&v=weekly`;
    script.async = true;
    document.body.appendChild(script);
    setIsScriptLoaded(true);
  }

  // initialize map
  let map;
  function initMap() {
    map = new window.google.maps.Map(document.getElementById("map-container"), {
      center: { lat: 18.017443423458225, lng: -76.80649334431106 },
      zoom: 12,
      mapTypeControl: false,
    });
  }

  // display map to window
  useEffect(() => {
    window.onload = function () {
      getDirections();
    };
  }, [handleDestinationChange, handleOriginChange]);

  // display map to window
  window.initMap = initMap;

  // load google script to add api key to html via <script>
  useEffect(() => {
    if (!isScriptLoaded) {
      loadGoogleMapsScript();
    }
  }, [isScriptLoaded]);

  useEffect(() => {
    if (origin && destination) {
      calculateDistance();
    }
  }, [origin, destination]);

  return (
    <div className="Home">
      {/* google javascript map container */}
      <div id="map-container"></div>

      <div className={"homepage container "}>
        <div className="homepage__modal">
          {/**The white box menu*/}
          <HomepageModalMenu />

          {/**The white box content*/}
          <div className="homepage__modal--container">
            <div className="homepage__modal--container-first"></div>
            <div className="homepage__modal--container-second">
              {/** the main content*/}
              <div className="location">
                <div className="from">
                  <h2>From</h2>
                  <div className="from--input">
                    <img src={Location} />
                    <input
                      type="text"
                      name="originSearch"
                      placeholder={
                        origin?.locationName
                          ? origin?.locationName
                          : "Pickup Area"
                      }
                      onChange={(e) => setOriginSearch(e.target.value)}
                      onClick={() => setShowOriginList(true)}
                    />
                  </div>
                  {showOriginList && (
                    <div className="locations--list">
                      {filteredOrigins.length != 0
                        ? filteredOrigins.map((location, index) => (
                            <div key={index}>
                              <p
                                onClick={() =>
                                  handleOriginChange(index, setShowOriginList)
                                }
                              >
                                {location.locationName}
                              </p>
                              <hr />
                            </div>
                          ))
                        : locations.map((location, index) => (
                            <div key={index}>
                              <p
                                onClick={() =>
                                  handleOriginChange(index, setShowOriginList)
                                }
                              >
                                {location.locationName}
                              </p>
                              <hr />
                            </div>
                          ))}
                    </div>
                  )}
                </div>
                <div className="from">
                  <h2>To</h2>
                  <div className="from--input">
                    <img src={Location} />
                    <input
                      type="text"
                      name="destinationSearch"
                      placeholder={
                        destination?.locationName
                          ? destination?.locationName
                          : "Drop Off Area"
                      }
                      onChange={(e) => setDestinationSearch(e.target.value)}
                      onClick={() => setShowDestinationList(true)}
                    />
                  </div>
                  {showDestinationList && (
                    <div className="locations--list">
                      {filteredDestinations.length != 0
                        ? filteredDestinations.map((location, index) => (
                            <div key={index}>
                              <p
                                onClick={() =>
                                  handleDestinationChange(
                                    index,
                                    setShowDestinationList
                                  )
                                }
                              >
                                {location.locationName}
                              </p>
                              <hr />
                            </div>
                          ))
                        : locations.map((location, index) => (
                            <div key={index}>
                              <p
                                onClick={() =>
                                  handleDestinationChange(
                                    index,
                                    setShowDestinationList
                                  )
                                }
                              >
                                {location.locationName}
                              </p>
                              <hr />
                            </div>
                          ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            {distance && (
              <div className="homepage__modal--container-third">
                <div>
                  <h3>Distance:</h3>
                  <p>
                    <b>{distance}</b>
                  </p>
                </div>
                <div>
                  <h3>Duration:</h3>
                  <p>
                    <b>{duration}</b>
                  </p>
                </div>
              </div>
            )}
            <div className="homepage__modal--container-forth">
              {/** the main content*/}
              {user ? (
                <button onClick={() => navigate("/book-order")}>
                  {distance && destination ? (
                    <Link
                      onClick={() =>
                        setLocations([
                          {
                            address: origin.locationName,
                            lat: origin.lat,
                            lng: origin.lng,
                          },
                          {
                            address: destination.locationName,
                            lat: destination.lat,
                            lng: destination.lng,
                          },
                        ])
                      }
                      to="/book-order"
                    >
                      Book Now
                    </Link>
                  ) : (
                    "Book Now"
                  )}
                </button>
              ) : (
                <button>
                  <Link to="/signin">Book Now</Link>
                </button>
              )}
              <p>By proceeding, you agree to terms and conditions.</p>
            </div>
          </div>
        </div>
        {/* map container mobile */}
        <div id="map-container" className="mapImage hide-for-tablet"></div>
      </div>
    </div>
  );
};
