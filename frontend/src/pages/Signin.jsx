import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import {
  browserLocalPersistence,
  RecaptchaVerifier,
  setPersistence,
  signInWithPhoneNumber,
} from "firebase/auth";
import { auth, database } from "../firebaseConfig";
import { useUser } from "../contexts/UserContext";
import { toast } from "react-toastify";
import AuthenticationModal from "../utilities/AuthenticationModal";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { async } from "@firebase/util";

function SignIn() {
  const { setUser, navigate } = useUser();
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // state to save if phone number supplied has an account or not
  const [registeredPhone, setRegisteredPhone] = useState(true);

  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    const getUser = () => {
      let user = [];

      try {
        const q = query(
          collection(database, "usersList"),
          where("phoneNumber", "==", phoneNumber)
        );
        onSnapshot(q, (snapShot) => {
          user = snapShot.docs.map((data) => ({
            ...data.data(),
          }));

          if (user.length != 0) {
            setRegisteredPhone(true);
          } else {
            setRegisteredPhone(false);
          }
        });
      } catch (err) {
        console.log(err);
      }
    };

    getUser();
  }, [phoneNumber]);

  // render recatchaVerifier
  const phoneNumberLogin = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: (response) => {
            onSignInSubmit();
          },
        },
        auth
      );
    }

    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
        callback: (response) => {
          onSignInSubmit();
        },
      },
      auth
    );
  };

  const onSignInSubmit = async (e) => {
    e?.preventDefault();
    if ((phoneNumber === "") | null) {
      return toast.error("Phone Number is required to sign in...");
    } else if (phoneNumber.includes(" ")) {
      setPhoneNumber(phoneNumber?.replaceAll(" ", ""));
    } else if (!registeredPhone) {
      return toast.error(
        "Phone Number not linked to any Account. Click on Signup to Register!"
      );
    }
    setLoading(true);
    phoneNumberLogin();

    const appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, phoneNumber, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        toast.success("OTP sent!");
        setShowModal((prev) => !prev);
        setLoading(false);
      })
      .catch((error) => {
        if (error.code === "auth/invalid-phone-number") {
          setLoading(false);
          return toast.error("Invalid Phone Number. Too long...");
        } else if (error.code === "auth/network-request-failed") {
          setLoading(false);
          return toast.error("Network Error! Check your Network and retry");
        }
        console.log(error);
        setLoading(false);
      });
  };

  const verifyOTP = async (e, code) => {
    e.preventDefault();
    setLoading(true);
    if (code === "") {
      setLoading(false);
      return toast.error("Please enter OTP");
    }
    try {
      await setPersistence(auth, browserLocalPersistence);
      await window.confirmationResult.confirm(code).then(async (res) => {
        const docRef = doc(database, "userChats", res?.user?.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("Document data:", docSnap.data());
        } else {
          // doc.data() will be undefined in this case
          // set a userChats document
          setDoc(doc(database, "userChats", res.user.uid), {});
        }

        setUser(res.user);
        localStorage.setItem("defiUser", res.user);
        toast.success("Verified");

        const userListDoc = doc(database, "usersList", phoneNumber);
        // setting the users uid in
        updateDoc(userListDoc, {
          uid: res.user.uid,
        });

        setLoading(false);
        return navigate("/");
      });
    } catch (err) {
      if (err.code === "auth/invalid-verification-code") {
        setLoading(false);
        toast.error("Invalid Verification Code");
      }
      setLoading(false);
      toast.error(err);
    }
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
            <div>
              <p>Phone Number</p>
              <div className="login__signup--form-input flex-row">
                {/**the icon  */}

                <input
                  name="phoneNumber"
                  type="tel"
                  placeholder="+ 1 (876) 0000000000"
                  className="input"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>
            </div>
            <div id="recaptcha-container"></div>
            <button disabled={loading} type="submit" onClick={onSignInSubmit}>
              {loading ? (
                <ClipLoader size={20} color="white" />
              ) : (
                "Verify Phone"
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
      {showModal && (
        <AuthenticationModal
          handleSubmit={verifyOTP}
          handleClose={() => setShowModal(false)}
          loading={loading}
          phoneNumber={phoneNumber}
          handleResend={(e) => onSignInSubmit(e)}
        />
      )}
    </div>
  );
}

export default SignIn;
