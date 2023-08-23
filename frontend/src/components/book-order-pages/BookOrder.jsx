import React, {useState} from "react";
import BookOrderDetails1 from "./BookOrderDetails1";
import BookOrderDetails2 from "./BookOrderDetails2";
import BookOrderDetails3 from "./BookOrderDetails3";
import BookOrderDetails4 from "./BookOrderDetails4";

const BookOrder = () => {
  const [step, setStep] = useState(1);
  return (
    <div className="book-order-page">
      <div className="book-order-container">
        <h1>Book Ride</h1> 
        <div className="order-tabs">
          <div className={step === 1 ? "one active-step" : "one"}>
            <div id="num"> {step > 1 ? <>&#x2713;</> : 1} </div>
            <p>Enter Ride Details</p>
          </div>
          <span></span>
          <div className={step === 2 ? "two active-step" : "two"}>
            <div id="num">{step > 2 ? <>&#x2713;</> : 2}</div>
            <p>Choose a Vehicle</p>
          </div>
          <span></span>
          <div className={step === 3 ? "three active-step" : "three"}>
            <div id="num">{step > 3 ? <>&#x2713;</> : 3}</div>
            <p>Your Contact Details</p>
          </div>
          <span></span>
          <div className={step === 4 ? "four active-step" : "four"}>
            <div id="num">{step > 4 ? <>&#x2713;</> : 4}</div>
            <p>Booking Summary</p>
          </div>
        </div>
        {step === 1 && <BookOrderDetails1 clickForward={()=>setStep(2)}/>}
        {step === 2 && <BookOrderDetails2 clickForward={()=>setStep(3)} clickBack={()=>setStep(1)}/>}
        {step === 3 && <BookOrderDetails3 clickForward={()=>setStep(4)} clickBack={()=>setStep(2)}/>}
        {step === 4 && <BookOrderDetails4 setStep={(e)=>setStep(e)} clickBack={()=>setStep(3)}/>}
        
       
      </div>
    </div>
  );
};

export default BookOrder;
