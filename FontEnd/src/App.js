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
import { AnimatePresence } from "framer-motion";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "./Components/Footer";
import { Flip } from "react-toastify";

axios.defaults.baseURL = `http://127.0.0.1:5000`;

function App() {
  const location = useLocation();

  return (
    <>
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
        </Routes>
      </AnimatePresence>
      {/* <Footer></Footer> */}
      <ToastContainer
        theme="dark"
        position={"bottom-right"}
        transition={Flip}
      />
    </>
  );
}

export default App;
