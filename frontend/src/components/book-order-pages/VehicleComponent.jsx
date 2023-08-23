import React from "react";
import User from "../../assets/user.svg";
import BriefCase from "../../assets/briefcase.svg";

const VehicleComponent = ({carName, driverName, carImage, keyProp, select, selected, available}) => {
  return (
    <div key={keyProp} className="vehicle">
      <div className="img">
        <img src={carImage} alt="" />
      </div>
      <div className="vehicle-details">
        <h3>{carName}</h3>
        <p id="driver">
          <b>DRIVER: </b>{driverName}
        </p>
        <div className="price-btn">
          
          <div style={{opacity: selected || !available ? 0.5 : 1, cursor: available ? "pointer": "not-allowed"}} onClick={()=>{
            if(available){
              select()
            }else{
              {}
            }
          }} className="btn-selected">
            <p>{available ? selected ? "Selected" : "Select" : "Driver in ride"}</p>
          </div>
        </div>
        <div className="info-icons">
            <p>MORE INFO &#8594;</p>
            <div>
                <span>
                    <img src={User} alt="" />
                    <p>4</p>
                </span>
                <span>
                    <img src={BriefCase} alt="" />
                    <p>4</p>
                </span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleComponent;
