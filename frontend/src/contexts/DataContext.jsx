import React, { createContext, useContext, useState, useEffect } from "react";
import {
  collection,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import { database } from "../firebaseConfig";
import { useUser } from "./UserContext";
import { toast } from "react-toastify";

const DataContext = createContext();

export const useUserData = () => {
  return useContext(DataContext);
};

const DataProvider = ({ children }) => {
  const { user } = useUser();
  const usersRef = collection(database, "usersList");
  const [userInfo, setUserInfo] = useState({});
  const [loadingUserInfo, setLoadingUserInfo] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoadingUserInfo(true);
      try {
        const q = query(
          collection(database, "usersList"),
          where("phoneNumber", "==", user.phoneNumber)
        );
        await onSnapshot(q, (data) => {
          data.forEach((user) => {
            setUserInfo(user.data());
          });
        });
        setLoadingUserInfo(false);
      } catch (err) {
        toast.error(err);
        setLoadingUserInfo(false);
      }
    };
    fetchUserInfo();
  }, [user]);

  const value = {
    userInfo,
    loadingUserInfo,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export default DataProvider;
