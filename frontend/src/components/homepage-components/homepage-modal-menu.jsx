import React, { useState } from "react";
import arrow from "../../assets/homeIcons/arrowDown.svg";

let array = [
  "Outstation Cabs",
  "Local Rentals",
  "Airport Transfer",
  "Holiday Package",
];

function HomepageModalMenu() {
  const [openMenuMobile, setOpenMenuMobile] = useState([
    "hide-for-all",
    " hide-all-navElements",
  ]);

  const openMenu = () => {
    if (openMenuMobile[0] === "hide-for-all") {
      setOpenMenuMobile(["", ""]);
    } else {
      setOpenMenuMobile(["hide-for-all", " hide-all-navElements"]);
    }
  };

  //   for menu click
  const [newMenu, setNewMenu] = useState(array);

  const newMenuFunction = (val) => {
    let first = array[0];
    const removedElement = array.splice(val, 1); // create a copy of the original array
    array.unshift(removedElement[0]);
    setNewMenu([...array]);
    if (first !== array[0]) {
      setOpenMenuMobile(["hide-for-all", " hide-all-navElements"]);
    }
    console.log(array);
  };

  return (
    <div className="homepage__modal--menu">
      <div className="homepage__modal--menu-active" >
        <h1>Book Rides</h1>
        <img src={arrow} className="hide-for-dexktop hide-for-tablet" />
      </div>


      {/** */}

      {/**border bottom when opened */}
      <div className="borderBottom"></div>
    </div>
  );
}

export default HomepageModalMenu;
