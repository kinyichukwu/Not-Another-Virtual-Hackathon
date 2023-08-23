import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { useUser } from "../contexts/UserContext";
import { toast } from "react-toastify";

function SignIn() {
  const { setUser, navigate } = useUser();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // state to save if phone number supplied has an account or not
  const [registeredPhone, setRegisteredPhone] = useState(true);

  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    const getUser = () => {};

    getUser();
  }, [phoneNumber]);

  const onSignInSubmit = async (e) => {
    e?.preventDefault();

    setLoading(true);
  };

  return (
    <div className="login container-mobile">
      {/**for dextop */}
      <div className="login__signup__dextop hide-for-mobile ">
        <div className="signinLink flex-row">
          <span>Don't have an account? </span>
          <Link to="/signup">
            <span>Sign up</span>
          </Link>
        </div>
      </div>

      {/* side detail */}
      <div className="login__data__dextop">
        <h2>Login to your Account</h2>

        <p className="bug">
          Join Defi Chat today and experience topmost quality service
        </p>

        <div className="login__signup">
          {/**sign up form */}
          <div className="login__signup--form">
            <div></div>
            <button disabled={loading} type="submit" onClick={onSignInSubmit}>
              {loading ? (
                <ClipLoader size={20} color="white" />
              ) : (
                "Verify Wallet"
              )}
            </button>
          </div>
        </div>

        <div className="signinLink flex-row hide-for-dextop">
          <p>Don't have an account? </p>
          <Link to="/signup">
            <span>Sign up</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
