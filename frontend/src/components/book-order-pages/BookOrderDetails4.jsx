import React, { useEffect, useState } from "react";
import { useBookOrder } from "../../contexts/BookOrderContext";
import { useUserData } from "../../contexts/DataContext";
import { ClipLoader } from "react-spinners";

const BookOrderDetails4 = ({ clickBack, clickForward, setStep }) => {
  const {
    locations,
    pickupDateTime,
    totalDistance,
    totalTime,
    transferType,
    drivers,
    driver,
    creating,
    createOrder,
  } = useBookOrder();
  const { userInfo } = useUserData();
  const [mapImage, setMapImage] = useState("");

  useEffect(() => {
    var mapUrl = `https://maps.googleapis.com/maps/api/staticmap?size=640x480&maptype=roadmap&markers=color:red|${
      locations?.filter((loc) => loc.type === "pickup")[0]?.lat
    },${
      locations?.filter((loc) => loc.type === "pickup")[0]?.lng
    }&markers=color:red|${
      locations?.filter((loc) => loc.type === "dropoff")[0]?.lat
    },${
      locations?.filter((loc) => loc.type === "dropoff")[0]?.lng
    }&path=color:red|weight:10&bounds=17.700066,-78.361128|18.526070,-76.180555`;

    mapUrl += `&key=${process.env.REACT_APP_GOOGLEMAPS_API_KEY}`;
    const getImage = async () => {
      await fetch(mapUrl).then(() => setMapImage(mapUrl));
    };
    getImage();
  }, []);

  return (
    <div className="order-details4-container">
      <div className="first">
        <div className="details">
          <div className="head">
            <h2>Contact & Booking info</h2>
            {/* <p>Edit</p> */}
          </div>
          <div className="names">
            <span>
              <h3>FIRST NAME</h3>
              <p>{userInfo?.fullName?.split(" ")[0]}</p>
            </span>
            <span>
              <h3>LAST NAME</h3>
              <p>
                {!userInfo?.fullName?.split(" ")[1]
                  ? "---"
                  : userInfo?.fullName?.split(" ")[1]}
              </p>
            </span>
          </div>
          <div>
            <h3>EMAIL ADDRESS</h3>
            <p>{userInfo.email}</p>
          </div>
          <div>
            <h3>PHONE NUMBER</h3>
            <p>{userInfo?.phoneNumber}</p>
          </div>
          <div className="pay-meth">
            <div className="head">
              <h2>Payment Method</h2>
              <p>Edit</p>
            </div>
            <p className="choice">YOUR CHOICE</p>
            <i></i>
          </div>
        </div>
      </div>
      <div className="second">
        <div className="map">
          <img src={mapImage} alt="" />
        </div>
        <div className="summary">
          <div className="head">
            <h2>Ride Details</h2>
            <p onClick={() => setStep(1)}>Edit</p>
          </div>
          <div className="details">
            <div>
              <h3>SERVICE TYPE</h3>
              <p>Distance</p>
            </div>
            <div>
              <h3>TRANSFER TYPE</h3>
              <p>{transferType}</p>
            </div>
            <div>
              <h3>PICKUP LOCATION</h3>
              <p>
                {locations?.filter((loc) => loc.type === "pickup")[0]?.address}
              </p>
            </div>
            <div>
              <h3>DROPOFF LOCATION</h3>
              <p>
                {locations?.filter((loc) => loc.type === "dropoff")[0]?.address}
              </p>
            </div>

            <div>
              <h3>PICKUP TIME, DATE</h3>
              <p>
                {pickupDateTime.time}, {pickupDateTime.date}
              </p>
            </div>
            <div>
              <span>
                <h3>Total Distance</h3>
                <p>{totalDistance}</p>
              </span>
              <span>
                <h3>Total Time</h3>
                <p>{totalTime}</p>
              </span>
            </div>
            {/* <div>
              <h3>DRIVER</h3>
              <p>Sani Ahmed</p>
            </div>
            <span className="price">
              <p>Total</p>
              <p>$0.00</p>
            </span>
            <span className="price">
              <p>
                To pay<i>(20% discount)</i>
              </p>
              <p>$0.00</p>
            </span> */}
          </div>
        </div>
      </div>
      <div className="third">
        <div className="img">
          <img
            src={drivers.filter((d) => d.uid === driver)[0]?.profilePic}
            alt=""
          />
        </div>
        <div className="details">
          <div className="head">
            <h2>Driver info</h2>
          </div>

          <div>
            <h3>Name</h3>
            <p>{drivers.filter((d) => d.uid === driver)[0]?.fullName}</p>
          </div>
          <div>
            <h3>Phone Number</h3>
            <p>{drivers.filter((d) => d.uid === driver)[0]?.phoneNumber}</p>
          </div>
          {/* <div>
            <h3>Vehicle</h3>
            <p>{drivers.filter((d) => d.uid === driver)[0]?.carBrand}</p>
          </div> */}
        </div>
        <div className="message">
          <textarea placeholder="Write a message to the driver"></textarea>
        </div>
      </div>
      <div className="buttons">
        <div onClick={() => clickBack()} className="back">
          <p> &#8592; Go back to last Step </p>
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => (creating ? {} : createOrder())}
          className="next"
        >
          {creating ? <ClipLoader size={20} color="white" /> : <p>Finish Up</p>}
        </div>
      </div>
    </div>
  );
};

export default BookOrderDetails4;
