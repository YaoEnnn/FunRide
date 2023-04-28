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

import { AnimatePresence } from "framer-motion";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./Components/Footer";
import { Flip } from "react-toastify";
import { createContext, useEffect, useState } from "react";
import Protected from "./Components/Protected";
import Admin from "./Components/Pages/Admin";

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
          ></Route>
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
          ></Route>
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
