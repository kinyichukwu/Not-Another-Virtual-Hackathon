import "./App.css";
import SignUp from "./pages/SignUp";
import UserProvider from "./contexts/UserContext";
import DataProvider from "./contexts/DataContext";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Nav } from "./components/Nav";

function App() {
  return (
    <>
      <BrowserRouter>
        <UserProvider>
          <DataProvider>
            <Nav />
            <Routes>
              <Route path="/" element={<SignUp />} />
            </Routes>
          </DataProvider>
        </UserProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
