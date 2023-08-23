import React from 'react'
import { ClipLoader } from "react-spinners";


const FullScreenLoader = () => {
  return (
    <div style={{
        
        display:"flex",
        position:"fixed",
        width:"100%",
        height:"100vh",
        background:"rgba(0,0,0,0.6)",
        backdropFilter:"blur(3px)",
        textAlign:"center",
        top:'0',
        left:"0",
        zIndex:"999999999999999999999999999",
        alignItems:"center",
        justifyContent:"center",
    }}>
        <ClipLoader size={60} color="white"/>
        
    </div>
  )
}

export default FullScreenLoader