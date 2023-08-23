import React, { useState } from 'react'
import ReactDOM  from 'react-dom'
import { FaCross, FaTimes } from 'react-icons/fa'
import { ClipLoader, MoonLoader } from 'react-spinners'

const AuthenticationModal = ({handleSubmit, handleClose, handleResend, loading, phoneNumber}) => {
    const [otp, setOtp] = useState("")


  return ReactDOM.createPortal(
    <>
    <div className='modal--overlay'>
        <div className='modal'>
            <h1 onClick={handleClose}>
                <FaTimes />
            </h1>
            <svg width="94" height="110" viewBox="0 0 94 110" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M82.2289 12.1301L82.2293 12.1303C85.2152 13.2467 87.9675 15.5895 89.99 18.4873C92.0112 21.3834 93.2635 24.7765 93.3169 27.9461V68.5462C93.3169 71.635 92.2911 75.259 90.6093 78.6025C88.9276 81.9457 86.6248 84.9392 84.1364 86.799L60.6367 104.342L60.6348 104.343C56.9212 107.135 51.9766 108.551 47 108.551C42.0234 108.551 37.0788 107.135 33.3652 104.343L33.3633 104.342L9.86361 86.799C7.37515 84.9392 5.07235 81.9457 3.39066 78.6025C1.70885 75.259 0.683139 71.635 0.683139 68.5462V27.9404C0.683139 24.7738 1.90738 21.382 3.91561 18.4856C5.92375 15.5894 8.67548 13.2467 11.6613 12.1303L11.6618 12.1301L38.932 1.9106C38.9322 1.91052 38.9325 1.91041 38.9327 1.91034C41.101 1.10063 44.0059 0.683139 46.9453 0.683139C49.8848 0.683139 52.7897 1.10066 54.9579 1.91034C54.9582 1.91042 54.9584 1.91051 54.9587 1.9106L82.2289 12.1301ZM47 51.4677H47.0119L47.0237 51.4673C53.6733 51.236 58.9413 45.8546 58.9413 39.1439C58.9413 32.3178 53.3889 26.7654 46.5628 26.7654C39.7914 26.7654 34.2375 32.3183 34.2936 39.1465C34.295 45.8618 39.5139 51.2368 46.4307 51.4674L46.4421 51.4677H46.4535H47ZM59.2886 79.0094L59.2929 79.0065C62.5562 76.831 64.4562 73.6888 64.5156 70.3619H64.5157V70.3497C64.5157 66.9524 62.6031 63.918 59.3475 61.7476L59.3454 61.7461C55.9041 59.4709 51.4208 58.3538 46.9727 58.3538C42.5246 58.3538 38.0412 59.4709 34.6 61.7461L34.5978 61.7476C31.336 63.9221 29.4297 67.0679 29.4295 70.4044L29.4298 70.4163C29.4891 73.7962 31.3326 76.8284 34.5942 79.0041C38.0126 81.3389 42.5271 82.4549 46.9453 82.4549C51.3745 82.4549 55.8269 81.2793 59.2886 79.0094Z" fill="black" stroke="black" stroke-width="1.36628"/>
            </svg>
            <h3>Authenticate your account</h3>
            <p>Please confirm and verify your account by filling the otp in the field provided below. 
                <br /> An otp has been sent to your number <b>{phoneNumber}</b> as SMS 
            </p>
            <input 
            name='otp'
            type="number" 
            maxLength={6}
            onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={(e) => handleSubmit(e, otp)}>
                {loading ? <ClipLoader size={20} color="white" /> : "Verify"}
            </button>
            {/* <button onClick={handleResend}>Resend Code</button> */}
        </div>
    </div>
    </>
    , document.getElementById('authenticationModal')
  )
}

export default AuthenticationModal