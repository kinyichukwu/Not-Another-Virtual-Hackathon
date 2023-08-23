import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Home } from "./pages/Home";
import { Nav } from "./components/Nav";
import Signup from "./pages/Signup";
import SuccessfulRide from "./components/SuccessfulRide";
import BookOrder from "./components/book-order-pages/BookOrder";
import MyRides from "./pages/MyRides";
import UserProvider from "./contexts/UserContext";
import SignIn from "./pages/Signin";
import DataProvider from "./contexts/DataContext";
import MapProvider from "./contexts/MapContext";
import BookOrderProvider from "./contexts/BookOrderContext";
import { DriverContextProvider } from "./contexts/DriverContext";
import HomepageNotification from "./components/homepage-components/homepage-notification-component";

function App() {
  return (
    <>
      <UserProvider>
        <DataProvider>
          <MapProvider>
            <BookOrderProvider>
              <DriverContextProvider>
                <Nav />
                <HomepageNotification />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/ride-success" element={<SuccessfulRide />} />
                  <Route path="/book-order" element={<BookOrder />} />

                  <Route path="/my-rides" element={<MyRides />} />
                </Routes>
              </DriverContextProvider>
            </BookOrderProvider>
          </MapProvider>
        </DataProvider>
      </UserProvider>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
