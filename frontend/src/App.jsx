import "./App.css";
import SignUp from "./pages/SignUp";
import UserProvider from "./contexts/UserContext";
import DataProvider from "./contexts/DataContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Nav } from "./components/Nav";
import { ToastContainer } from "react-toastify";
import SignIn from "./pages/Signin";

function App() {
  return (
    <>
      <BrowserRouter>
        <UserProvider>
          <DataProvider>
            <Nav />
            <Routes>
              <Route path="/" element={<SignUp />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/signin" element={<SignIn />} />
            </Routes>
          </DataProvider>
        </UserProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
