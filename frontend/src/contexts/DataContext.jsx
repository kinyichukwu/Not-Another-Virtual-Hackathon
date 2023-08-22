import React, { createContext, useContext, useState, useEffect } from "react";
import { useUser } from "./UserContext";
import { toast } from "react-toastify";

const DataContext = createContext();

export const useUserData = () => {
  return useContext(DataContext);
};

const DataProvider = ({ children }) => {
  const { user } = useUser();
  const [userInfo, setUserInfo] = useState({});
  const [loadingUserInfo, setLoadingUserInfo] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoadingUserInfo(true);
      try {
       
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
