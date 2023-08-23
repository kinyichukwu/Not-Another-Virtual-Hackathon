import React, { useEffect, useState } from "react";
import { useBookOrder } from "../../contexts/BookOrderContext";
import { useUserData } from "../../contexts/DataContext";
import { useMap } from "../../contexts/MapContext";
import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";

const BookOrderDetails3 = ({ clickBack, clickForward }) => {
  const {
    transferType,
    locations,
    pickupDateTime,
    totalDistance,
    totalTime,
    drivers,
    driver,
  } = useBookOrder();
  const { userInfo } = useUserData();

  const { price } = useMap();

  const [address, setAddress] = useState(null);
  const [kit, setKit] = useState(null);

  // connect to celo wallet
  const connectToWallet = async () => {
    if (window.celo) {
      try {
        await window.celo.enable();
        const web3 = new Web3(window.celo);
        let kit = newKitFromWeb3(web3);

        const accounts = await kit.web3.eth.getAccounts();
        const user_address = accounts[0];
        kit.defaultAccount = user_address;

        await setAddress(user_address);
        await setKit(kit);
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Error Occurred");
    }
  };

  useEffect(() => {
    connectToWallet();
  }, []);

  // send money to other account
  async function sendCELOTx() {
    // Connect to the network and get the current tx count
    let nonce = await kit.web3.eth.getTransactionCount(kit.defaultAccount);

    // Send 0.1 CELO
    let amount = kit.web3.utils.toWei("0.1", "ether");

    let CeloTx = {
      to: "0x78820ee969c7C3264817723779b1D780f1aD0C13", // omit recipient for a contract deployment
      from: address,
      gas: 2000000, // surplus gas will be returned to the sender
      nonce: nonce,
      chainId: "44787", // Alfajores chainId
      data: "0x0", // data to send for smart contract execution
      value: amount,

      // The following fields can be omitted and will be filled by ContractKit, if required

      gasPrice: "30000000000",
      // gatewayFee: 0,
      // gatewayFeeRecipient: "",
      // feeCurrency: ""
    };

    let tx = await kit.sendTransaction(CeloTx);
    let receipt = await tx.waitReceipt();

    if (receipt.transactionHash.length > 0) {
      clickForward();
    }else{
      alert('transaction failed')
    }

    console.log(
      `CELO tx: https://alfajores-blockscout.celo-testnet.org/tx/${receipt.transactionHash}`
    );
  }

  return (
    <div className="order-details3-container">
      <div className="summary">
        <h2>Summary</h2>
        <div className="details">
          <div>
            <h3>SERVICE TYPE</h3>
            <p>Distance</p>
          </div>
          <div>
            <h3>TRANSFER TYPE</h3>
            <p>{transferType}</p>
          </div>
          <div>
            <h3>PICKUP LOCATION</h3>
            <p>
              {locations?.filter((loc) => loc.type === "pickup")[0]?.address}
            </p>
          </div>
          <div>
            <h3>PICKUP TIME, DATE</h3>
            <p>
              {pickupDateTime.time}, {pickupDateTime.date}
            </p>
          </div>
          <div>
            <span>
              <h3>Total Distance</h3>
              <p>{totalDistance}</p>
            </span>
            <span>
              <h3>Total Time</h3>
              <p>{totalTime}</p>
            </span>
          </div>
          <div>
            <h3>DRIVER</h3>
            <p>{drivers.filter((d) => d.uid === driver)[0]?.fullName}</p>
          </div>
          <span className="price">
            <p>Total</p>
            <p>1CELO</p>
          </span>
          <span className="price">
            <p></p>
            <p>1CELO</p>
          </span>
        </div>
      </div>
      <div className="contact-details">
        <div className="heading">
          <h3>Contact Details</h3>
        </div>
        <div className="scan-user">
          <div className="user-info">
            <div>
              <p>First Name*</p>
              <h3>{userInfo?.fullName?.split(" ")[0]}</h3>
            </div>
            <div>
              <p>Last Name*</p>
              <h3>
                {!userInfo?.fullName?.split(" ")[1]
                  ? "---"
                  : userInfo?.fullName?.split(" ")[1]}
              </h3>
            </div>
            <div>
              <p>Email address*</p>
              <h3>{userInfo?.email}</h3>
            </div>
            <div>
              <p>Phone Number*</p>
              <h3>{userInfo.phoneNumber}</h3>
            </div>
          </div>
          <div className="scan">
            <img
              src="https://www.pngitem.com/pimgs/m/120-1202125_qr-code-png-transparent-background-qr-code-png.png"
              alt=""
            />
            <h3>Celo Wallet</h3>
          </div>
        </div>
        <p id="pay-with">Pay with</p>
        <div className="img-list">
          <p>Celo</p>
        </div>

        <p id="info">
          *your information cannot be tampered with by inputting your details
        </p>
      </div>
      <div className="buttons">
        <div onClick={() => clickBack()} className="back">
          <p> &#8592; Go back to last Step </p>
        </div>

        <div
          onClick={() => {
            sendCELOTx();
          }}
          style={{ opacity: driver !== "" ? 1 : 0.5 }}
          className="next"
        >
          <p>Pay &#8594;</p>
        </div>
      </div>
    </div>
  );
};

export default BookOrderDetails3;
