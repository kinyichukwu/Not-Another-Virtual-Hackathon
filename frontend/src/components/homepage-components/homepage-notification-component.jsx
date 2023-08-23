import React, { useContext, useEffect, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { DriverContext } from "../../contexts/DriverContext";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { database } from "../../firebaseConfig";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useUserData } from "../../contexts/DataContext";

function HomepageNotification({ showNotification }) {
  const { user } = useUser();
  const { userInfo } = useUserData();
  const { first, setfirst, data, driverDetails } = useContext(DriverContext);

  const change = () => {
    setfirst(false);
  };

  const cancelRideUser = async () => {
    try {
      const q = query(
        collection(database, "orders"),
        where("passangerID", "==", user?.uid)
      );
      const querySnapshot = await getDocs(q);
      const updatePromises = querySnapshot.docs.map(async (doc) => {
        console.log(doc.ref);
        await updateDoc(doc.ref, { status: "Canceled" });
      });

      await Promise.all(updatePromises).then(() => {
        toast.success("Ride canceled");
        setfirst(false);
      });
    } catch (error) {
      console.log(error);
    }
  };
  const cancelRideDriver = async () => {
    try {
      const q = query(
        collection(database, "orders"),
        where("driverId", "==", user?.uid)
      );
      const querySnapshot = await getDocs(q);
      const updatePromises = querySnapshot.docs.map(async (doc) => {
        await updateDoc(doc.ref, { status: "Canceled" });
      });

      await Promise.all(updatePromises).then(() => {
        setfirst(false);
        toast.success("Ride canceled");
      });
    } catch (error) {
      console.log(error);
    }
  };
  const acceptRideDriver = async () => {
    try {
      const q = query(
        collection(database, "orders"),
        where("driverId", "==", user?.uid)
      );
      const querySnapshot = await getDocs(q);
      const updatePromises = querySnapshot.docs.map(async (doc) => {
        await updateDoc(doc.ref, { status: "In Ride" });
      });

      await Promise.all(updatePromises).then(async () => {
        await updateDoc(doc(database, "usersList", userInfo?.phoneNumber), {
          onGoingRide: true,
        }).then(() => {
          toast.success("Ride accepted");
          setfirst(false);
        });
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {user && data?.driverId === user?.uid && data?.status === "Pending" && (
        <div style={{ height: "fit-content", borderBottomLeftRadius:"0px" }} className="floating__modal">
          <h2>Ride Requested</h2>
          <li>{data?.passangersName}</li>
          <p>Order Status: {data?.status}</p>
          <div style={{ padding: "12px 0" }}>
            <button
              style={{
                marginRight: "10px",
                background: "rgba(255,255,255,0.2)",
              }}
              onClick={() => acceptRideDriver()}
            >
              Accept Ride
            </button>
            <button onClick={() => cancelRideDriver()}>Cancel Ride</button>
          </div>
        </div>
      )}
      {user &&
        data?.passangerID === user?.uid &&
        data?.status == "In Ride" &&
        first && (
          <div className="floating__modal">
            <h2>Your Ride</h2>
            <li>
              {driverDetails && driverDetails?.fullName} is on his way for
              pickup
            </li>
            <p>The vehicle will arrive in a few minutes</p>
            <button onClick={() => cancelRideUser()}>Cancel Ride</button>
          </div>
        )}
    </>
  );
}

export default HomepageNotification;
