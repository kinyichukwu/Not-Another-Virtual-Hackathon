import React from "react";
import { useState } from "react";
import { useBookOrder } from "../../contexts/BookOrderContext";
import VehicleComponent from "./VehicleComponent";

const BookOrderDetails2 = ({ clickForward, clickBack }) => {
  const { drivers, driver, setDriver, numOfPassengers, setNumOfPassengers, numOfLuggages, setNumOfLuggages } =
    useBookOrder();
  return (
    <div className="order-details2-container">
      <div className="available-rides">
        <div className="heading">
          <h3>Choose Available rides</h3>
        </div>
        <div className="options">
          <div style={{ width: "50%" }}>
            <p>Passengers</p>
            <select onChange={(e)=>setNumOfPassengers(e.target.value)} value={numOfPassengers} name="type" id="">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
          <div style={{ width: "50%" }}>
            <p>Luggages</p>
            <select onChange={(e)=>setNumOfLuggages(e.target.value)} value={numOfLuggages} name="type" id="">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
          </div>
     
        </div>
        <div className="red-heading">
          <h3>Select a Vehicle</h3>
        </div>
        <div className="vehicles">
          {drivers.map((driverInfo, index) => {
            return (
              <VehicleComponent
                keyProp={index}
                carName={driverInfo.carBrand}
                carImage={driverInfo.vehicleFront}
                driverName={driverInfo.fullName}
                select={() => setDriver(driverInfo.uid)}
                selected={driver === driverInfo.uid ? true : false}
                available={driverInfo?.onGoingRide ? false : true}
              />
            );
          })}
        </div>
      </div>
      <div className="buttons">
        <div onClick={() => clickBack()} className="back">
          <p> &#8592; Go back to last Step </p>
        </div>
        <div
          style={{ opacity: driver !== "" ? 1 : 0.5 }}
          onClick={() => {
            if (driver !== "") {
              clickForward();
            }
          }}
          className="next"
        >
          <p>Continue &#8594;</p>
        </div>
      </div>
    </div>
  );
};

export default BookOrderDetails2;
