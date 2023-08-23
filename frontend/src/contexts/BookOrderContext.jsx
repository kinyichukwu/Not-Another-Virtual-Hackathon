import {
  addDoc,
  collection,
  doc,
  getDocs,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { database } from "../firebaseConfig";
import { useMap } from "./MapContext";
import { useUserData } from "./DataContext";

const BookOrderContext = createContext();

export const useBookOrder = () => {
  return useContext(BookOrderContext);
};

const BookOrderProvider = ({ children }) => {
  const { userInfo } = useUserData();
  const [locations, setLocations] = useState([]);
  const [pickupDateTime, setPickupDateTime] = useState({});
  const [transferType, setTransferType] = useState("");
  const [driver, setDriver] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [numOfPassengers, setNumOfPassengers] = useState(1);
  const [numOfLuggages, setNumOfLuggages] = useState(1);
  const [totalDistance, setTotalDistance] = useState("");
  const [totalTime, setTotalTime] = useState("");
  const [creating, setCreating] = useState(false);
  const [price, setPrice] = useState("$100");
  const [allOrders, setAllOrders] = useState([])
  const navigate = useNavigate();
  const {
    setDistance,
    setDirectionsResponse,
    setDuration,
    setDestination,
    setOrigin,
  } = useMap();

  const clearFields = () => {
    setLocations([]);
    setPickupDateTime({});
    setTransferType("");
    setDriver("");
    setNumOfLuggages(1);
    setNumOfPassengers(1);
    setTotalDistance("");
    setTotalTime("");
    setDistance(null);
    setDirectionsResponse(null);
    setDuration(null);
    setDestination(null);
    setOrigin(null);
  };

  useEffect(() => {
    const getAllDrivers = async () => {
      try {
        const q = query(
          collection(database, "usersList"),
          where("accountType", "==", "driver")
        );
        await onSnapshot(q, (snapShot) => {
          const driversTemp = snapShot.docs.map((data) => {
            return data.data();
          });
          setDrivers(driversTemp);
        });
      } catch (err) {
        console.log(err);
      }
    };
    getAllDrivers();
  }, []);

  const createOrder = async () => {
    try {
      setCreating(true);
      const colRef = await collection(database, "orders");
      await addDoc(colRef, {
        locations,
        pickupDateTime,
        transferType,
        driverId: driver,
        passangersName: userInfo?.fullName,
        passangerID: userInfo?.uid,
        totalDistance,
        totalTime,
        numOfLuggages,
        numOfPassengers,
        price,
        status:"Pending",
        orderTime: Date.now()
      })
        .then(async () => {
            setCreating(false);
            toast.success("Order Created Successfully");
            clearFields();
            navigate("/");
        })
        .catch((e) => {
          setCreating(false);
          toast.error("An error occured");
        });
    } catch (error) {}
  };

  useEffect(() => {
    const getAllOrders = async()=>{
      try {
        if(userInfo?.accountType === "driver"){
          const q = query(
            collection(database, "orders"),
            where("driverId", "==", userInfo?.uid)
          );
          await onSnapshot(q, (snapShot) => {
            const orders = snapShot.docs.map((data) => {
              return data.data();
            });
            setAllOrders(orders);
          });
        }else{
          const q = query(
            collection(database, "orders"),
            where("passangerID", "==", userInfo?.uid)
          );
          await onSnapshot(q, (snapShot) => {
            const orders = snapShot.docs.map((data) => {
              return data.data();
            });
            setAllOrders(orders);
          });
        }
      } catch (err) {
        console.log(err);
      }
    };
    getAllOrders()
    
  }, [userInfo])


  
  
  

  const value = {
    locations,
    setLocations,
    pickupDateTime,
    setPickupDateTime,
    setTransferType,
    transferType,
    drivers,
    driver,
    setDriver,
    numOfPassengers,
    setNumOfPassengers,
    numOfLuggages,
    setNumOfLuggages,
    setTotalDistance,
    setTotalTime,
    totalTime,
    totalDistance,
    creating,
    createOrder,
    allOrders
  };
  return (
    <BookOrderContext.Provider value={value}>
      {children}
    </BookOrderContext.Provider>
  );
};

export default BookOrderProvider;
