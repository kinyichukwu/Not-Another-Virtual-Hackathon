import React from "react";
import Ride from "../components/my-rides-components/Ride";
import { useBookOrder } from "../contexts/BookOrderContext";

const MyRides = () => {
  const { allOrders, drivers } = useBookOrder();

  return (
    <div className="my-rides">
      <h1>My Rides</h1>
      <div className="today" style={{position:"relative"}}>
        {allOrders?.length !== 0 && <h2>Recent</h2>}
        <div className="rides">
          {allOrders.length !== 0 ? allOrders.sort((a,b)=>b.orderTime - a.orderTime)?.map((order, index) => {
            return (
              <Ride
                key={index}
                keyVal={index}
                price={order?.price}
                to={
                  order?.locations?.filter((loc) => loc.type == "dropoff")[0]
                    ?.address
                }
                from={
                  order?.locations?.filter((loc) => loc.type == "pickup")[0]
                    ?.address
                }
                time={order?.totalTime}
                status = {order?.status}
                dName={drivers.filter((d) => d.uid === order?.driverId)[0]?.fullName}
              />
            );
          }) : <section style={{display:"flex",alignItems:"center", justifyContent:'center', minHeight:"60vh", width:"100%", position:"absolute", top:"0", left:0}}><p style={{color:"red"}}>No Recent Rides available</p></section>}
        </div>
      </div>
      {/* <div className="today">
        <h2>Yesterday</h2>
        <div className="rides">
          <Ride />
          <Ride />
        </div>
      </div> */}
    </div>
  );
};

export default MyRides;
