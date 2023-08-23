import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { setDoc, doc, collection, getDoc } from 'firebase/firestore';
import { auth, database, storage } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from "firebase/auth"
import { useUser } from '../contexts/UserContext';
import { handleChangeEvent } from '../helpers/handleChange';
import { ClipLoader } from 'react-spinners';
import SignUpInput from './SignUpInput';

export const SignUpAsDriver = () => {

  const { navigate, setUser, user, usersRef } = useUser()
  const [loading, setLoading] = useState(false)
  // state to check progress of upload: used files url readiness to determine finished state 
  const [uploadState, setUploadState] = useState("");

  const [data, setData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    carType: "",
    carMake: "",
    carBrand: "",
    carColor: "",
    carModel: "",
    trn: "",
    driverBadgeNumber: "",

  })

  const { fullName, email, phoneNumber, carType, carBrand, carColor, carModel, carMake, driverBadgeNumber, trn } = data

  const [driverLicenceFile, setDriverLicenceFile] = useState("")
  const [proofOfOwnershipFile, setProofOfOwnershipFile] = useState("")
  const [vehicleFrontFile, setVehicleFrontFile] = useState("")
  const [vehicleBackFile, setVehicleBackFile] = useState("")

  const [driverLicenceURL, setDriverLicenceURL] = useState("")
  const [proofOfOwnershipURL, setProofOfOwnershipURL] = useState("")
  const [vehicleFrontURL, setVehicleFrontURL] = useState("")
  const [vehicleBackURL, setVehicleBackURL] = useState("")


  const handleChange = (e) => handleChangeEvent(e, setData, data)

  const handleFile = (e, setFile) => {
    setFile(e.target.files[0])
  }

  useEffect(() => {
    if(phoneNumber.includes(" ")){
      setData({
        phoneNumber: phoneNumber.replaceAll(" ",'')
      })
    }
  }, [handleChange])

  const uploadFile = async (setURL, file) => {
    const storageRef = ref(storage, `/drivers/${file.name}`)
    if (file === "") {
      return toast.error('No file selected!')
    }
    const uploadTask = uploadBytesResumable(storageRef, file)
    uploadTask.on("state_changed", (snapshot) => {
      const percentage = Math.round(
        (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      );
    },
      (error) => console.log(error),

      async () => {
        await getDownloadURL(uploadTask.snapshot.ref)
          .then((url) => {
            return setURL(url);
          });
      },
    );
    setLoading(false)
  }


  // upload all files
  const uploadAll = async (e) => {
    e.preventDefault()
    setLoading(prev => !prev)

    // if user is offline return error
    if (!navigator.onLine) {
      setLoading(false)
      return toast.error('You appear to be Offline')
    }

    const allUploads = async () => {
      uploadFile(setDriverLicenceURL, driverLicenceFile)
      uploadFile(setProofOfOwnershipURL, proofOfOwnershipFile)
      uploadFile(setVehicleFrontURL, vehicleFrontFile)
      uploadFile(setVehicleBackURL, vehicleBackFile)
    }
    const res = await allUploads()
    setUploadState("uploading")
    setLoading(prev => !prev)
  }

  // check that all files have been uploaded completely and have their URLs generated
  useEffect(() => {
    if (driverLicenceURL !== "" && proofOfOwnershipURL !== "" && vehicleBackURL !== "" && vehicleFrontURL !== "") {
      setUploadState("done")
    }
  }, [driverLicenceURL, proofOfOwnershipURL, vehicleFrontURL, vehicleBackURL])

  // sign up function
  const driverSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    if (fullName == "" || email == "" || phoneNumber == "" || carType == "" || carBrand == "" || carColor == "" || carModel == "" || carMake == "" || driverBadgeNumber == "" || trn === "") {
      return toast.error('All fields are required')
    }
    try {
      setLoading(true)
      const document = await getDoc(doc(usersRef, phoneNumber))
      if (document.exists()) {
        toast.error("Phone number already in use")

      } else {
        await setDoc(doc(collection(database, "usersList"), phoneNumber), {
          accountType: "driver",
          email: data.email,
          fullName: fullName,
          phoneNumber: phoneNumber,
          carType: carType,
          carMake: carMake,
          carBrand: carBrand,
          carColor: carColor,
          trn: trn,
          carModel: carModel,
          driverBadgeNumber: driverBadgeNumber,
          driverLicence: driverLicenceURL,
          proofofOwnership: proofOfOwnershipURL,
          vehicleFront: vehicleFrontURL,
          vehicleBack: vehicleBackURL,
          onGoingRide:false
        }).then(() => {
          toast.success('Sign up Successful')
          navigate('/signin')
          return setLoading(false)
        }).catch((err) => {
          console.log(err);
          setLoading(false)
        })
      }
    }
    catch (err) {
      setLoading(false)
      toast.error(err)
    }
  }

  return (
    <form>
      <SignUpInput label="Full Name" name={"fullName"} type="text" placeholder={"Full Name"} value={fullName} onChange={handleChange}>
        <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.59 21C18.59 17.13 14.74 14 10 14C5.26 14 1.41 17.13 1.41 21M10 11C11.3261 11 12.5979 10.4732 13.5355 9.53553C14.4732 8.59785 15 7.32608 15 6C15 4.67392 14.4732 3.40215 13.5355 2.46447C12.5979 1.52678 11.3261 1 10 1C8.67392 1 7.40215 1.52678 6.46447 2.46447C5.52679 3.40215 5 4.67392 5 6C5 7.32608 5.52679 8.59785 6.46447 9.53553C7.40215 10.4732 8.67392 11 10 11V11Z" stroke="#1E1E1E" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </SignUpInput>
      <SignUpInput label="E-mail Address" name={"email"} type="email" placeholder={"email@example.com"} value={email} onChange={handleChange}>
        <svg width="20" height="22" viewBox="0 0 20 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.59 21C18.59 17.13 14.74 14 10 14C5.26 14 1.41 17.13 1.41 21M10 11C11.3261 11 12.5979 10.4732 13.5355 9.53553C14.4732 8.59785 15 7.32608 15 6C15 4.67392 14.4732 3.40215 13.5355 2.46447C12.5979 1.52678 11.3261 1 10 1C8.67392 1 7.40215 1.52678 6.46447 2.46447C5.52679 3.40215 5 4.67392 5 6C5 7.32608 5.52679 8.59785 6.46447 9.53553C7.40215 10.4732 8.67392 11 10 11V11Z" stroke="#1E1E1E" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </SignUpInput>
      <SignUpInput label="Phone Number" name={"phoneNumber"} type="tel" placeholder={"+ 1 (876) 0000000000"} value={phoneNumber} onChange={handleChange}>
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20.97 17.33C20.97 17.69 20.89 18.06 20.72 18.42C20.55 18.78 20.33 19.12 20.04 19.44C19.55 19.98 19.01 20.37 18.4 20.62C17.8 20.87 17.15 21 16.45 21C15.43 21 14.34 20.76 13.19 20.27C12.04 19.78 10.89 19.12 9.75 18.29C8.58811 17.4401 7.49169 16.5041 6.47 15.49C5.45877 14.472 4.5261 13.3789 3.68 12.22C2.86 11.08 2.2 9.94 1.72 8.81C1.24 7.67 1 6.58 1 5.54C1 4.86 1.12 4.21 1.36 3.61C1.6 3 1.98 2.44 2.51 1.94C3.15 1.31 3.85 1 4.59 1C4.87 1 5.15 1.06 5.4 1.18C5.66 1.3 5.89 1.48 6.07 1.74L8.39 5.01C8.57 5.26 8.7 5.49 8.79 5.71C8.88 5.92 8.93 6.13 8.93 6.32C8.93 6.56 8.86 6.8 8.72 7.03C8.59 7.26 8.4 7.5 8.16 7.74L7.4 8.53C7.29 8.64 7.24 8.77 7.24 8.93C7.24 9.01 7.25 9.08 7.27 9.16C7.3 9.24 7.33 9.3 7.35 9.36C7.53 9.69 7.84 10.12 8.28 10.64C8.73 11.16 9.21 11.69 9.73 12.22C10.27 12.75 10.79 13.24 11.32 13.69C11.84 14.13 12.27 14.43 12.61 14.61C12.66 14.63 12.72 14.66 12.79 14.69C12.87 14.72 12.95 14.73 13.04 14.73C13.21 14.73 13.34 14.67 13.45 14.56L14.21 13.81C14.46 13.56 14.7 13.37 14.93 13.25C15.16 13.11 15.39 13.04 15.64 13.04C15.83 13.04 16.03 13.08 16.25 13.17C16.47 13.26 16.7 13.39 16.95 13.56L20.26 15.91C20.52 16.09 20.7 16.3 20.81 16.55C20.91 16.8 20.97 17.05 20.97 17.33V17.33Z" stroke="#1E1E1E" strokeOpacity="0.5" strokeWidth="1.5" strokeMiterlimit="10" />
        </svg>
      </SignUpInput>
      <div className="input--item">
        <label htmlFor="car type">Car Type</label>
        <div>
          <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.1576 9.63934H5.88759C4.02759 9.63934 3.60759 10.5693 3.37759 11.7193L2.52759 15.7693H14.5276L13.6776 11.7193C13.4276 10.5693 13.0176 9.63934 11.1576 9.63934V9.63934Z" stroke="#1E1E1E" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2.51771 13.5193H1.76771M15.2677 13.5193H14.5177M4.01771 18.7693H6.26771M10.7677 18.7693H13.0177M17.7277 10.7593C18.0077 10.1093 17.9077 9.22935 17.3877 8.45935C16.8777 7.68935 16.0977 7.25935 15.3877 7.26935M20.8377 11.7493C21.2577 10.2393 20.9577 8.38935 19.8877 6.78935C18.8177 5.18935 17.2177 4.20935 15.6577 4.01935M16.0077 22.3793C16.0877 23.2593 15.3877 24.0193 14.4877 24.0193H13.0777C12.2677 24.0193 12.1577 23.6693 12.0077 23.2493L11.8577 22.7993C11.6477 22.1893 11.5077 21.7693 10.4277 21.7693H6.58771C5.50771 21.7693 5.34771 22.2393 5.15771 22.7993L5.00771 23.2493C4.86771 23.6793 4.75771 24.0193 3.93771 24.0193H2.52771C1.62771 24.0193 0.917706 23.2593 1.00771 22.3793L1.42771 17.8093C1.53771 16.6793 1.74771 15.7593 3.71771 15.7593H13.2877C15.2577 15.7593 15.4677 16.6793 15.5777 17.8093L16.0077 22.3793Z" stroke="#1E1E1E" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="12.0176" y="3.55408" width="5.59058" height="13" transform="rotate(-32.9946 12.0176 3.55408)" fill="white" />
          </svg>
          <input
            name="carType"
            type="carType"
            placeholder="Enter Car type"
            value={carType}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="input--item">
        <label htmlFor="car brand">Car Brand</label>
        <div>
          <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.1576 9.63934H5.88759C4.02759 9.63934 3.60759 10.5693 3.37759 11.7193L2.52759 15.7693H14.5276L13.6776 11.7193C13.4276 10.5693 13.0176 9.63934 11.1576 9.63934V9.63934Z" stroke="#1E1E1E" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2.51771 13.5193H1.76771M15.2677 13.5193H14.5177M4.01771 18.7693H6.26771M10.7677 18.7693H13.0177M17.7277 10.7593C18.0077 10.1093 17.9077 9.22935 17.3877 8.45935C16.8777 7.68935 16.0977 7.25935 15.3877 7.26935M20.8377 11.7493C21.2577 10.2393 20.9577 8.38935 19.8877 6.78935C18.8177 5.18935 17.2177 4.20935 15.6577 4.01935M16.0077 22.3793C16.0877 23.2593 15.3877 24.0193 14.4877 24.0193H13.0777C12.2677 24.0193 12.1577 23.6693 12.0077 23.2493L11.8577 22.7993C11.6477 22.1893 11.5077 21.7693 10.4277 21.7693H6.58771C5.50771 21.7693 5.34771 22.2393 5.15771 22.7993L5.00771 23.2493C4.86771 23.6793 4.75771 24.0193 3.93771 24.0193H2.52771C1.62771 24.0193 0.917706 23.2593 1.00771 22.3793L1.42771 17.8093C1.53771 16.6793 1.74771 15.7593 3.71771 15.7593H13.2877C15.2577 15.7593 15.4677 16.6793 15.5777 17.8093L16.0077 22.3793Z" stroke="#1E1E1E" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="12.0176" y="3.55408" width="5.59058" height="13" transform="rotate(-32.9946 12.0176 3.55408)" fill="white" />
          </svg>
          <input
            name="carBrand"
            type="text"
            placeholder="ex: Honda"
            value={carBrand}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="input--item">
        <label htmlFor="car color">Car Color</label>
        <div>
          <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.1576 9.63934H5.88759C4.02759 9.63934 3.60759 10.5693 3.37759 11.7193L2.52759 15.7693H14.5276L13.6776 11.7193C13.4276 10.5693 13.0176 9.63934 11.1576 9.63934V9.63934Z" stroke="#1E1E1E" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2.51771 13.5193H1.76771M15.2677 13.5193H14.5177M4.01771 18.7693H6.26771M10.7677 18.7693H13.0177M17.7277 10.7593C18.0077 10.1093 17.9077 9.22935 17.3877 8.45935C16.8777 7.68935 16.0977 7.25935 15.3877 7.26935M20.8377 11.7493C21.2577 10.2393 20.9577 8.38935 19.8877 6.78935C18.8177 5.18935 17.2177 4.20935 15.6577 4.01935M16.0077 22.3793C16.0877 23.2593 15.3877 24.0193 14.4877 24.0193H13.0777C12.2677 24.0193 12.1577 23.6693 12.0077 23.2493L11.8577 22.7993C11.6477 22.1893 11.5077 21.7693 10.4277 21.7693H6.58771C5.50771 21.7693 5.34771 22.2393 5.15771 22.7993L5.00771 23.2493C4.86771 23.6793 4.75771 24.0193 3.93771 24.0193H2.52771C1.62771 24.0193 0.917706 23.2593 1.00771 22.3793L1.42771 17.8093C1.53771 16.6793 1.74771 15.7593 3.71771 15.7593H13.2877C15.2577 15.7593 15.4677 16.6793 15.5777 17.8093L16.0077 22.3793Z" stroke="#1E1E1E" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="12.0176" y="3.55408" width="5.59058" height="13" transform="rotate(-32.9946 12.0176 3.55408)" fill="white" />
          </svg>
          <input
            name="carColor"
            type="text"
            placeholder="ex: Red"
            value={carColor}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="input--item">
        <label htmlFor="car make">Car Make</label>
        <div>
          <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.1576 9.63934H5.88759C4.02759 9.63934 3.60759 10.5693 3.37759 11.7193L2.52759 15.7693H14.5276L13.6776 11.7193C13.4276 10.5693 13.0176 9.63934 11.1576 9.63934V9.63934Z" stroke="#1E1E1E" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2.51771 13.5193H1.76771M15.2677 13.5193H14.5177M4.01771 18.7693H6.26771M10.7677 18.7693H13.0177M17.7277 10.7593C18.0077 10.1093 17.9077 9.22935 17.3877 8.45935C16.8777 7.68935 16.0977 7.25935 15.3877 7.26935M20.8377 11.7493C21.2577 10.2393 20.9577 8.38935 19.8877 6.78935C18.8177 5.18935 17.2177 4.20935 15.6577 4.01935M16.0077 22.3793C16.0877 23.2593 15.3877 24.0193 14.4877 24.0193H13.0777C12.2677 24.0193 12.1577 23.6693 12.0077 23.2493L11.8577 22.7993C11.6477 22.1893 11.5077 21.7693 10.4277 21.7693H6.58771C5.50771 21.7693 5.34771 22.2393 5.15771 22.7993L5.00771 23.2493C4.86771 23.6793 4.75771 24.0193 3.93771 24.0193H2.52771C1.62771 24.0193 0.917706 23.2593 1.00771 22.3793L1.42771 17.8093C1.53771 16.6793 1.74771 15.7593 3.71771 15.7593H13.2877C15.2577 15.7593 15.4677 16.6793 15.5777 17.8093L16.0077 22.3793Z" stroke="#1E1E1E" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="12.0176" y="3.55408" width="5.59058" height="13" transform="rotate(-32.9946 12.0176 3.55408)" fill="white" />
          </svg>
          <input
            name="carMake"
            type="text"
            placeholder="ex: SUV"
            value={carMake}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="input--item">
        <label htmlFor="trn">TRN</label>
        <div>
          <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.1576 9.63934H5.88759C4.02759 9.63934 3.60759 10.5693 3.37759 11.7193L2.52759 15.7693H14.5276L13.6776 11.7193C13.4276 10.5693 13.0176 9.63934 11.1576 9.63934V9.63934Z" stroke="#1E1E1E" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2.51771 13.5193H1.76771M15.2677 13.5193H14.5177M4.01771 18.7693H6.26771M10.7677 18.7693H13.0177M17.7277 10.7593C18.0077 10.1093 17.9077 9.22935 17.3877 8.45935C16.8777 7.68935 16.0977 7.25935 15.3877 7.26935M20.8377 11.7493C21.2577 10.2393 20.9577 8.38935 19.8877 6.78935C18.8177 5.18935 17.2177 4.20935 15.6577 4.01935M16.0077 22.3793C16.0877 23.2593 15.3877 24.0193 14.4877 24.0193H13.0777C12.2677 24.0193 12.1577 23.6693 12.0077 23.2493L11.8577 22.7993C11.6477 22.1893 11.5077 21.7693 10.4277 21.7693H6.58771C5.50771 21.7693 5.34771 22.2393 5.15771 22.7993L5.00771 23.2493C4.86771 23.6793 4.75771 24.0193 3.93771 24.0193H2.52771C1.62771 24.0193 0.917706 23.2593 1.00771 22.3793L1.42771 17.8093C1.53771 16.6793 1.74771 15.7593 3.71771 15.7593H13.2877C15.2577 15.7593 15.4677 16.6793 15.5777 17.8093L16.0077 22.3793Z" stroke="#1E1E1E" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="12.0176" y="3.55408" width="5.59058" height="13" transform="rotate(-32.9946 12.0176 3.55408)" fill="white" />
          </svg>
          <input
            name="trn"
            type="number"
            placeholder="ex: 0292892328"
            value={trn}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="input--item">
        <label htmlFor="car model">Car Model</label>
        <div>
          <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.1576 9.63934H5.88759C4.02759 9.63934 3.60759 10.5693 3.37759 11.7193L2.52759 15.7693H14.5276L13.6776 11.7193C13.4276 10.5693 13.0176 9.63934 11.1576 9.63934V9.63934Z" stroke="#1E1E1E" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2.51771 13.5193H1.76771M15.2677 13.5193H14.5177M4.01771 18.7693H6.26771M10.7677 18.7693H13.0177M17.7277 10.7593C18.0077 10.1093 17.9077 9.22935 17.3877 8.45935C16.8777 7.68935 16.0977 7.25935 15.3877 7.26935M20.8377 11.7493C21.2577 10.2393 20.9577 8.38935 19.8877 6.78935C18.8177 5.18935 17.2177 4.20935 15.6577 4.01935M16.0077 22.3793C16.0877 23.2593 15.3877 24.0193 14.4877 24.0193H13.0777C12.2677 24.0193 12.1577 23.6693 12.0077 23.2493L11.8577 22.7993C11.6477 22.1893 11.5077 21.7693 10.4277 21.7693H6.58771C5.50771 21.7693 5.34771 22.2393 5.15771 22.7993L5.00771 23.2493C4.86771 23.6793 4.75771 24.0193 3.93771 24.0193H2.52771C1.62771 24.0193 0.917706 23.2593 1.00771 22.3793L1.42771 17.8093C1.53771 16.6793 1.74771 15.7593 3.71771 15.7593H13.2877C15.2577 15.7593 15.4677 16.6793 15.5777 17.8093L16.0077 22.3793Z" stroke="#1E1E1E" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="12.0176" y="3.55408" width="5.59058" height="13" transform="rotate(-32.9946 12.0176 3.55408)" fill="white" />
          </svg>
          <input
            type="text"
            placeholder="ex: crv20"
            name="carModel"
            value={carModel}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="input--item">
        <label htmlFor="driver badge number">Driver Badge Number</label>
        <div>
          <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.1576 9.63934H5.88759C4.02759 9.63934 3.60759 10.5693 3.37759 11.7193L2.52759 15.7693H14.5276L13.6776 11.7193C13.4276 10.5693 13.0176 9.63934 11.1576 9.63934V9.63934Z" stroke="#1E1E1E" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2.51771 13.5193H1.76771M15.2677 13.5193H14.5177M4.01771 18.7693H6.26771M10.7677 18.7693H13.0177M17.7277 10.7593C18.0077 10.1093 17.9077 9.22935 17.3877 8.45935C16.8777 7.68935 16.0977 7.25935 15.3877 7.26935M20.8377 11.7493C21.2577 10.2393 20.9577 8.38935 19.8877 6.78935C18.8177 5.18935 17.2177 4.20935 15.6577 4.01935M16.0077 22.3793C16.0877 23.2593 15.3877 24.0193 14.4877 24.0193H13.0777C12.2677 24.0193 12.1577 23.6693 12.0077 23.2493L11.8577 22.7993C11.6477 22.1893 11.5077 21.7693 10.4277 21.7693H6.58771C5.50771 21.7693 5.34771 22.2393 5.15771 22.7993L5.00771 23.2493C4.86771 23.6793 4.75771 24.0193 3.93771 24.0193H2.52771C1.62771 24.0193 0.917706 23.2593 1.00771 22.3793L1.42771 17.8093C1.53771 16.6793 1.74771 15.7593 3.71771 15.7593H13.2877C15.2577 15.7593 15.4677 16.6793 15.5777 17.8093L16.0077 22.3793Z" stroke="#1E1E1E" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="12.0176" y="3.55408" width="5.59058" height="13" transform="rotate(-32.9946 12.0176 3.55408)" fill="white" />
          </svg>
          <input
            name="driverBadgeNumber"
            type="text"
            placeholder="ex: #120242"
            value={driverBadgeNumber}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      <div className="input--item">
        <label htmlFor="driver's licence">Driver's Licence</label>
        <div>
          <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 10.5678V15.5678C22 20.5678 20 22.5678 15 22.5678H9C4 22.5678 2 20.5678 2 15.5678V9.56781C2 4.56781 4 2.56781 9 2.56781H14" stroke="#1E1E1E" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 10.5678H18C15 10.5678 14 9.56781 14 6.56781V2.56781L22 10.5678Z" stroke="#1E1E1E" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <input
            name='driverLicence'
            type="file"
            accept=".doc, .docx, application/pdf, image/jpg, image/heic, image/jpeg, image/png"
            onChange={(e) => handleFile(e, setDriverLicenceFile)}
            required
          />
        </div>
      </div>
      <div className="input--item">
        <label htmlFor="proof of ownership">Proof of Ownership</label>
        <div>
          <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 10.5678V15.5678C22 20.5678 20 22.5678 15 22.5678H9C4 22.5678 2 20.5678 2 15.5678V9.56781C2 4.56781 4 2.56781 9 2.56781H14" stroke="#1E1E1E" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 10.5678H18C15 10.5678 14 9.56781 14 6.56781V2.56781L22 10.5678Z" stroke="#1E1E1E" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <input
            name="proofOfOwnership"
            type="file"
            accept=".doc, .docx, application/pdf, image/jpg, image/heic, image/jpeg, image/png"
            onChange={(e) => handleFile(e, setProofOfOwnershipFile)}
            required
          />
        </div>
      </div>
      <div className="input--item">
        <label htmlFor="vehicle front">Front of Vehicle</label>
        <div>
          <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 10.5678V15.5678C22 20.5678 20 22.5678 15 22.5678H9C4 22.5678 2 20.5678 2 15.5678V9.56781C2 4.56781 4 2.56781 9 2.56781H14" stroke="#1E1E1E" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 10.5678H18C15 10.5678 14 9.56781 14 6.56781V2.56781L22 10.5678Z" stroke="#1E1E1E" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <input
            name="vehicleFront"
            type="file"
            accept=".doc, .docx, application/pdf, image/jpg, image/heic, image/jpeg, image/png"
            onChange={(e) => handleFile(e, setVehicleFrontFile)}
            required
          />
        </div>
      </div>
      <div className="input--item">
        <label htmlFor="vehicle back">Back of Vehicle</label>
        <div>
          <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22 10.5678V15.5678C22 20.5678 20 22.5678 15 22.5678H9C4 22.5678 2 20.5678 2 15.5678V9.56781C2 4.56781 4 2.56781 9 2.56781H14" stroke="#1E1E1E" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M22 10.5678H18C15 10.5678 14 9.56781 14 6.56781V2.56781L22 10.5678Z" stroke="#1E1E1E" strokeOpacity="0.5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <input
            name="vehicleBack"
            type="file"
            accept=".doc, .docx, application/pdf, image/jpg, image/heic, image/jpeg, image/png"
            onChange={(e) => handleFile(e, setVehicleBackFile)}
            required
          />
        </div>
      </div>



      {uploadState === "uploading" && loading && <button><ClipLoader size={20} /></button>}
      {driverLicenceFile == "" | proofOfOwnershipFile == "" | vehicleBackFile == "" | vehicleFrontFile == "" ? <button type='buton' onClick={() => toast.error('All fields must be filled')} >Verify Details</button> : ""}
      {driverLicenceFile !== "" && proofOfOwnershipFile !== "" && vehicleBackFile !== "" && vehicleFrontFile !== "" && !loading && <button type='button' onClick={(e) => uploadAll(e)}>Verify Details</button>}
      {uploadState === "done" && <button type="submit" onClick={(e) => driverSignUp(e)}>Continue to sign up as Driver</button>}

    </form>
  )
}