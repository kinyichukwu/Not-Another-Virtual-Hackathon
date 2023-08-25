import React, { useEffect, useState } from "react";
import { Link, Route } from "react-router-dom";
import { SignUpAsDriver } from "../components/SignUpAsDriver";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { ClipLoader } from "react-spinners";
import { auth, database } from "../firebaseConfig";
import { toast } from "react-toastify";
import { useUser } from "../contexts/UserContext";
import { handleChangeEvent } from "../helpers/handleChange";
import Web3 from "web3";

function Signup() {
  const { setUser, navigate, usersRef, web3, setWeb3 } = useUser();

  const [loading, setLoading] = useState(false);
  const [signAsUser, setSignAsUser] = useState(true);
  const [data, setData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
  });

  const { fullName, email, phoneNumber } = data;

  const handleChange = (e) => handleChangeEvent(e, setData, data);

  useEffect(() => {
    if (phoneNumber.includes(" ")) {
      setData({
        phoneNumber: phoneNumber.replaceAll(" ", ""),
      });
    }
  }, [handleChange]);

  console.log(phoneNumber);

  const connectToWallet = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (window.ethereum) {
      const newWeb3 = new Web3(window.ethereum);
      try {
        // Request user permission to connect
        setLoading(true);
        await window.ethereum.enable();
        setWeb3(newWeb3);

        toast.success("Welcome to defi rides");
        navigate("/book-order");
      } catch (error) {
        console.error("User denied access to MetaMask");
        toast.error("User denied access to MetaMask");
      }
    } else {
      console.error("MetaMask not found");
      toast.error("MetaMask not found");
    }
    setLoading(false);
  };

  return (
    <div className="login container-mobile">
      {/**for dextop */}
      <div className="login__signup__dextop hide-for-mobile ">
        <div className="signinLink flex-row">
          <span>Have an account already? </span>
          <Link to="/signin">
            <span>Sign in</span>
          </Link>
        </div>
      </div>

      {/* side detail */}
      <div className="login__data__dextop">
        <h2>{signAsUser ? "Request a ride" : "Become a Driver"}</h2>

        <p className="bug">
          Join Defi chat today and experience topmost quality service
        </p>

        <div className="login__signup">
          <p> Sign up as?</p>
          <div className="login__signup--buttons flex-row flex-row-jsb">
            <button
              onClick={() => setSignAsUser(true)}
              className="btn--signup flex-row flex-row-jsb flex-row-jsb--alc"
            >
              {" "}
              <span className="circle">
                <span className={signAsUser ? "inner-circle" : ""}></span>
              </span>
              Request a ride
            </button>
            <button
              onClick={() => setSignAsUser(false)}
              className="btn--signup flex-row flex-row-jsb flex-row-jsb--alc"
            >
              {" "}
              <span className="circle">
                <span className={!signAsUser ? "inner-circle" : ""}></span>
              </span>
              Become a driver
            </button>
          </div>
          {/**sign up form */}
          <div className="login__signup--form">
            {signAsUser ? (
              <>
                <form onSubmit={connectToWallet}>
                  <div className="input--item">
                    <label htmlFor="full name">Full Name</label>
                    <div>
                      <svg
                        width="20"
                        height="22"
                        viewBox="0 0 20 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18.59 21C18.59 17.13 14.74 14 10 14C5.26 14 1.41 17.13 1.41 21M10 11C11.3261 11 12.5979 10.4732 13.5355 9.53553C14.4732 8.59785 15 7.32608 15 6C15 4.67392 14.4732 3.40215 13.5355 2.46447C12.5979 1.52678 11.3261 1 10 1C8.67392 1 7.40215 1.52678 6.46447 2.46447C5.52679 3.40215 5 4.67392 5 6C5 7.32608 5.52679 8.59785 6.46447 9.53553C7.40215 10.4732 8.67392 11 10 11V11Z"
                          stroke="#1E1E1E"
                          strokeOpacity="0.5"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <input
                        name="fullName"
                        type="text"
                        placeholder="John Doe"
                        value={fullName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="input--item">
                    <label htmlFor="email addresss">E-mail Address</label>
                    <div>
                      <svg
                        width="20"
                        height="22"
                        viewBox="0 0 20 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M18.59 21C18.59 17.13 14.74 14 10 14C5.26 14 1.41 17.13 1.41 21M10 11C11.3261 11 12.5979 10.4732 13.5355 9.53553C14.4732 8.59785 15 7.32608 15 6C15 4.67392 14.4732 3.40215 13.5355 2.46447C12.5979 1.52678 11.3261 1 10 1C8.67392 1 7.40215 1.52678 6.46447 2.46447C5.52679 3.40215 5 4.67392 5 6C5 7.32608 5.52679 8.59785 6.46447 9.53553C7.40215 10.4732 8.67392 11 10 11V11Z"
                          stroke="#1E1E1E"
                          strokeOpacity="0.5"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <input
                        name="email"
                        type="email"
                        placeholder="email@example.com"
                        value={email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="input--item">
                    <label htmlFor="phone number">Phone Number</label>
                    <div>
                      <svg
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M20.97 17.33C20.97 17.69 20.89 18.06 20.72 18.42C20.55 18.78 20.33 19.12 20.04 19.44C19.55 19.98 19.01 20.37 18.4 20.62C17.8 20.87 17.15 21 16.45 21C15.43 21 14.34 20.76 13.19 20.27C12.04 19.78 10.89 19.12 9.75 18.29C8.58811 17.4401 7.49169 16.5041 6.47 15.49C5.45877 14.472 4.5261 13.3789 3.68 12.22C2.86 11.08 2.2 9.94 1.72 8.81C1.24 7.67 1 6.58 1 5.54C1 4.86 1.12 4.21 1.36 3.61C1.6 3 1.98 2.44 2.51 1.94C3.15 1.31 3.85 1 4.59 1C4.87 1 5.15 1.06 5.4 1.18C5.66 1.3 5.89 1.48 6.07 1.74L8.39 5.01C8.57 5.26 8.7 5.49 8.79 5.71C8.88 5.92 8.93 6.13 8.93 6.32C8.93 6.56 8.86 6.8 8.72 7.03C8.59 7.26 8.4 7.5 8.16 7.74L7.4 8.53C7.29 8.64 7.24 8.77 7.24 8.93C7.24 9.01 7.25 9.08 7.27 9.16C7.3 9.24 7.33 9.3 7.35 9.36C7.53 9.69 7.84 10.12 8.28 10.64C8.73 11.16 9.21 11.69 9.73 12.22C10.27 12.75 10.79 13.24 11.32 13.69C11.84 14.13 12.27 14.43 12.61 14.61C12.66 14.63 12.72 14.66 12.79 14.69C12.87 14.72 12.95 14.73 13.04 14.73C13.21 14.73 13.34 14.67 13.45 14.56L14.21 13.81C14.46 13.56 14.7 13.37 14.93 13.25C15.16 13.11 15.39 13.04 15.64 13.04C15.83 13.04 16.03 13.08 16.25 13.17C16.47 13.26 16.7 13.39 16.95 13.56L20.26 15.91C20.52 16.09 20.7 16.3 20.81 16.55C20.91 16.8 20.97 17.05 20.97 17.33V17.33Z"
                          stroke="#1E1E1E"
                          strokeOpacity="0.5"
                          strokeWidth="1.5"
                          strokeMiterlimit="10"
                        />
                      </svg>
                      <input
                        name="phoneNumber"
                        type="tel"
                        placeholder="+ 1 (876) 0000000000"
                        value={phoneNumber}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <button type="submit">
                    {loading ? <ClipLoader size={20} /> : "Continue to sign up"}
                  </button>
                </form>
              </>
            ) : (
              <SignUpAsDriver />
            )}
          </div>
        </div>

        <div className="signinLink flex-row hide-for-dextop">
          <p>Have an account already? </p>
          <Link to="/signin">
            <span>Sign in</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Signup;
