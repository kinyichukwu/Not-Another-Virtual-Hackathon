import React from "react";
import Transaction from "../components/wallet-component/Transaction";


const Wallet = () => {
  return (
    <div className="wallet">
      <div className="wallet-container">
        <div>
          <h2>My Wallet Balance:</h2>
          <h1>$3,560.3</h1>
        </div>
        <div>
          <h3>Payment Methods</h3>
          <p> Bucks</p>
          <p>Paypal</p>
          <p className="add">+ Add New</p>
        </div>
      </div>
      <div className="recent">
        <h3>Recent Transactions</h3>
        <Transaction/>
        <Transaction/>
      </div>
    </div>
  );
};

export default Wallet;
