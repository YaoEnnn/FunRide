import {
  BrowserRouter as Router,
  Switch,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import Navbar from "./Components/Navbar";
import Home from "./Components/Pages/home";
import DefaultLayout from "./Components/Layout/DefaultLayout";
import Contact from "./Components/Pages/contact";
import News from "./Components/Pages/news";
import PrivateTrip from "./Components/Pages/privateTrip";
import SearchTrip from "./Components/Pages/searchTrip";
import Trips from "./Components/Pages/trips";
import Login from "./Components/Pages/Login";
import Settings from "./Components/Pages/Settings";
import Discount from "./Components/Pages/discount";
import AddAdmin from "./Components/Pages/Admin/add";
import AddDiscount from "./Components/Pages/discount/add";
import PrivateOrder from "./Components/Pages/PrivateOrder";
import TripOrder from "./Components/Pages/Trip Order";
import Dis1VT from "./Components/Pages/RecommendTrip/Dis1-VT";
import SeatPicker from "./Components/SeatPicker";
import Booking from "./Components/Pages/searchTrip/Booking";

import { AnimatePresence } from "framer-motion";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./Components/Footer";
import { Flip } from "react-toastify";
import { createContext, useEffect, useState } from "react";
import Protected from "./Components/Protected";
import Admin from "./Components/Pages/Admin";
import OrderID from "./Components/Pages/Trip Order/OrderID";

axios.defaults.baseURL = `http://127.0.0.1:5000`;
axios.defaults.headers.common["Authorization"] = localStorage.getItem("token");
export const loginContext = createContext();

function App() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isManager, setIsManager] = useState(false);
  const location = useLocation();
  useEffect(() => {
    axios.post("admin/my-profile").then((resp) => {
      const role = resp.data.msg.role;
      console.log(resp.data.msg.role);
      if (role === "Admin") {
        setIsAdmin(true);
      }
      if (role === "Manager") {
        setIsManager(true);
      }
    });
  });

  return (
    <loginContext.Provider value={{ isAdmin: isAdmin, isManager: isManager }}>
      <Navbar></Navbar>
      <AnimatePresence mode="wait">
        {/* <SeatPicker
          onChange={(e) => {
            console.log(e);
          }}
          section1={[{ i: 1, selected: true }, { i: 2 }, { i: 3 }]}
          section2={[{ i: 1 }, { i: 2 }, { i: 3 }]}
        ></SeatPicker> */}
        <Routes key={location.pathname} location={location}>
          <Route
            path="/"
            element={
              <DefaultLayout>
                <Home></Home>
              </DefaultLayout>
            }
          ></Route>
          <Route
            path="/contact"
            element={
              <DefaultLayout>
                <Contact></Contact>
              </DefaultLayout>
            }
          ></Route>
          <Route
            path="/searchTrip"
            element={
              <DefaultLayout>
                <SearchTrip></SearchTrip>
              </DefaultLayout>
            }
          >
            <Route path=":id" element={<Booking></Booking>}></Route>
          </Route>
          <Route
            path="/Dis1-VT"
            element={
              <DefaultLayout>
                <Dis1VT></Dis1VT>
              </DefaultLayout>
            }
          >
            <Route path=":id" element={<Booking></Booking>}></Route>
          </Route>
          <Route
            path="/privateTrip"
            element={
              <DefaultLayout>
                <PrivateTrip></PrivateTrip>
              </DefaultLayout>
            }
          ></Route>
          <Route
            path="/news"
            element={
              <DefaultLayout>
                <News></News>
              </DefaultLayout>
            }
          ></Route>
          <Route
            path="/trips"
            element={
              <DefaultLayout>
                <Trips></Trips>
              </DefaultLayout>
            }
          ></Route>
          <Route
            path="/login"
            element={
              <DefaultLayout>
                <Login></Login>
              </DefaultLayout>
            }
          ></Route>
          <Route
            path="/Admin"
            element={
              <Protected>
                <Admin></Admin>
              </Protected>
            }
          >
            <Route path="add" element={<AddAdmin></AddAdmin>}></Route>
          </Route>
          <Route
            path="/Settings"
            element={
              <Protected>
                <Settings></Settings>
              </Protected>
            }
          ></Route>
          <Route
            path="/Discountcode"
            element={
              <Protected>
                <Discount></Discount>
              </Protected>
            }
          >
            <Route path="add" element={<AddDiscount></AddDiscount>}></Route>
          </Route>
          <Route
            path="/TripOrder"
            element={
              <Protected>
                <TripOrder></TripOrder>
              </Protected>
            }
          ></Route>
          <Route
            path="/PrivateOrder"
            element={
              <Protected>
                <PrivateOrder></PrivateOrder>
              </Protected>
            }
          >
            <Route path=":id" element={<OrderID></OrderID>}></Route>
          </Route>
        </Routes>
      </AnimatePresence>
      <ToastContainer
        theme="dark"
        position={"bottom-right"}
        transition={Flip}
      />
    </loginContext.Provider>
  );
}

export default App;
