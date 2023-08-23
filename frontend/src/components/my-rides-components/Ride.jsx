import React from "react";

const Ride = ({ from, to, price, status, time, dName, keyVal }) => {
  return (
    <div key={keyVal} className="ride">
      <div className="destination">
        <div className="from">
          <div></div>
          <p>{from}</p>
        </div>
        <div className="to">
          <div></div>
          <p>{to}</p>
        </div>
      </div>
      <div className="fee">
        <p>Fee:</p>
        <h3>1 CELO</h3>
      </div>
      <div className="time">
        <p>Time:</p>
        <h3>{time}</h3>
      </div>
      <div className="payment">
        <p>Payment Method:</p>
        <h3>Celo</h3>
      </div>
      <div className="driver">
        <p>Driver:</p>
        <h3>{dName}</h3>
      </div>

      <div className="status">
        <p>Status:</p>
        <h3>{status}</h3>
      </div>
    </div>
  );
};

export default Ride;
