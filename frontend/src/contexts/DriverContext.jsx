import { createContext, useEffect, useState } from "react";
import { useUser } from "./UserContext";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { database } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

export const DriverContext = createContext({
  first: false,
  setfirst: () => {},
  data: {},
  setdata: () => {},
});

export const DriverContextProvider = ({ children }) => {
  const { user } = useUser();
  const [first, setfirst] = useState(false);
  const [data, setdata] = useState(null);
  const [driverDetails, setDriverDetails] = useState(null);
  const navigate = useNavigate()

  // useEffect(() => {
  //   if(!user){
  //     navigate("/signin")
  //   }else{
  //     navigate("/")
  //   }
  // }, [user])
  

  useEffect(() => {
    const getDriver = () => {
      const q = query(
        collection(database, "orders"),
        where("driverId", "==", user?.uid)
      );
      const unsub = onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.exists() && doc?.data()) {
            setfirst(true);
            setdata(doc?.data());
          }
          setdata(doc?.data());
        });
      });

      return () => {
        unsub();
      };
    };

    user?.uid && getDriver();
  }, [user?.uid]);

  useEffect(() => {
    const getPassanger = () => {
      const q = query(
        collection(database, "orders"),
        where("passangerID", "==", user?.uid)
      );
      const unsub = onSnapshot(q, (querySnapshot) => {
        querySnapshot.forEach((doc) => {
          if (doc.exists() && doc?.data()) {
            setfirst(true);
            setdata(doc?.data());
          }
        });
      });

      return () => {
        unsub();
      };
    };

    user?.uid && getPassanger();
  }, [user?.uid]);

  useEffect(() => {
    const getDetails = async()=>{
      const q = query(
        collection(database, "usersList"),
        where("uid", "==", data?.driverId)
      );
      const unsub = await onSnapshot(q, (querySnapshot) => {
        querySnapshot?.forEach((doc) => {
          setDriverDetails(doc?.data());
        });
      });
  
    }
    getDetails()
  }, [data])

  useEffect(() => {
    if(first === true){
      setTimeout(() => {
        setfirst(false)
      }, 5000);
    }
  }, [first])

  

  const value = {
    first,
    setfirst,
    data,
    driverDetails
  };

  return (
    <DriverContext.Provider value={value}>{children}</DriverContext.Provider>
  );
};
