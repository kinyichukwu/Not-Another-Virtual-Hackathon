import React, { useContext } from "react";
import messagesIcon from "../assets/messages_icon.svg";
import messagesSearchIcon from "../assets/messages-search-icon.svg";
import settingsIcon from "../assets/settings-icon.svg";
import profileIcon from "../assets/profile_icon.svg";
import ridesIcon from "../assets/my_rides_icon.svg";
import { Link } from "react-router-dom";

const MessagesNav = () => {
  return (
    <div className="message--nav">
      <Link to="/messages">
        <img src={messagesIcon} alt="" />

        <svg
          width="20"
          height="20"
          viewBox="0 0 15 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.26514 8.00049H13.5509"
            stroke="white"
            stroke-width="1.7551"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M7.40802 1.85742L13.5509 8.00028L7.40802 14.1431"
            stroke="white"
            stroke-width="1.7551"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </Link>
      <Link to="/message-search">
        <img src={messagesSearchIcon} alt="" />
      </Link>
      <Link to="/account-settings">
        <img src={settingsIcon} alt="" />
      </Link>
      <Link to="/profile">
        <img src={profileIcon} alt="" />
      </Link>
      <Link to="/support">
        <img src={ridesIcon} alt="" />
      </Link>
    </div>
  );
};

export default MessagesNav;
