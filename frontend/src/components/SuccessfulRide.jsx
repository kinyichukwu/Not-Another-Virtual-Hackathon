import React from "react";
import CheckMark from "../assets/successfulRideAssets/checkmark.svg";

const SuccessfulRide = () => {
  return (
    <div className="success--page--container">
      <div className="success--box">
        <div className="checkmark--box">
          <div className="top">
            <div className="checkmark">
              <img src={CheckMark} alt="" />
            </div>
            <h1>Thanks for your order</h1>
            <p>#order 1392</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessfulRide;
