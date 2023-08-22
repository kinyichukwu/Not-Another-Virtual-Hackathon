import { useState } from "react";
import "./App.css";
import SignUp from "./pages/SignUp";
import UserProvider from "./contexts/UserContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <UserProvider>
          <Routes>
            <Route path="/" element={<SignUp />} />
          </Routes>
        </UserProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
