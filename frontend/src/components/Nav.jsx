import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import notificationIcon from "../assets/notification.svg";
import { FaBars } from "react-icons/fa";
import OptionsPanel from "./OptionsPanel";
import { useUser } from "../contexts/UserContext";
import { useUserData } from "../contexts/DataContext";
import { toast } from "react-toastify";

export const Nav = () => {
  const { user } = useUser();

  const [showMnav, setShowMnav] = useState(false);
  const [status, setStatus] = useState("active");
  const [showOptions, setShowOptions] = useState(false);
  const { userInfo } = useUserData();
  const click = useRef();

  const toggleStatus = async (e) => {
    if (e == true) {
      setStatus("active");
    } else {
      setStatus("inactive");
    }


        if (status == "active") {
          toast.success("You are active");
        } else {
          toast.success("You are inactive");
        }
  
      
       
  };

  return (
    <nav>
      <div id="desktopMenu">
        {userInfo && userInfo.accountType !== "driver" ? (
          <Link to="/">Celo Ride</Link>
        ) : (
          <img src="" alt="" id="logo" />
        )}
        {user && (
          <>
            <div className="flex-row" style={{ gap: "2rem" }}>
              {userInfo && userInfo.accountType !== "driver" && (
                <Link to="/">Home</Link>
              )}
              {userInfo && userInfo.accountType == "driver" && (
                <Link to="/orders">All Orders</Link>
              )}

              {userInfo && userInfo.accountType !== "driver" && (
                <Link to="/my-rides">My Rides</Link>
              )}
            </div>
            <div>
              {userInfo && userInfo.accountType == "driver" ? (
                <input
                  type="checkbox"
                  className="toggle"
                  id="status"
                  ref={click}
                  checked={userInfo?.status === "active" ? true : false}
                  onChange={(e) => toggleStatus(e.target.checked)}
                />
              ) : null}
            </div>
            <div className="flex-row" style={{ gap: "1rem" }}>
              <img src={notificationIcon} alt="" className="icon" />

              <img
                style={{
                  cursor: "pointer",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
                onClick={() => setShowOptions(!showOptions)}
                src={
                  userInfo.profilePic
                    ? userInfo.profilePic
                    : "https://www.irablogging.com/assets/frontend/images/default-user.png"
                }
                alt=""
                className="icon"
              />
            </div>
          </>
        )}
      </div>
      <div id="mobileMenu">
        <div className="item-1">
          <div>
            <Link to="/"></Link>
          </div>
          <div className="toggles">
            {userInfo && userInfo.accountType == "driver" ? (
              <input
                type="checkbox"
                className="toggle"
                id="status-mobile"
                checked={userInfo?.status === "active" ? true : false}
                ref={click}
                onChange={(e) => toggleStatus(e.target.checked)}
              />
            ) : null}
            {user && (
              <img
                style={{
                  cursor: "pointer",
                  borderRadius: "50%",
                  objectFit: "cover",
                  width: "30px",
                  height: "30px",
                  marginRight: "10px",
                }}
                onClick={() => setShowOptions(!showOptions)}
                src={
                  userInfo.profilePic
                    ? userInfo.profilePic
                    : "https://www.irablogging.com/assets/frontend/images/default-user.png"
                }
                alt=""
                className="icon"
              />
            )}

            <FaBars id="hamburger" onClick={() => setShowMnav(!showMnav)} />
          </div>
        </div>
        {showMnav && (
          <div className="flex-col mobile--items" style={{ gap: "2rem" }}>
            {userInfo && userInfo.accountType !== "driver" && (
              <Link onClick={() => setShowMnav(false)} to="/">
                Home
              </Link>
            )}
            {userInfo && userInfo.accountType == "driver" && (
              <Link onClick={() => setShowMnav(false)} to="/orders">
                All Orders
              </Link>
            )}
            <Link onClick={() => setShowMnav(false)} to="/Messages">
              Messages
            </Link>
            {userInfo && userInfo.accountType !== "driver" && (
              <Link onClick={() => setShowMnav(false)} to="/my-rides">
                My Rides
              </Link>
            )}
            <Link onClick={() => setShowMnav(false)} to="/Wallet">
              Wallet
            </Link>
          </div>
        )}
      </div>
      {showOptions && (
        <OptionsPanel
          showOptions={showOptions}
          setShowOptions={setShowOptions}
        />
      )}
    </nav>
  );
};
