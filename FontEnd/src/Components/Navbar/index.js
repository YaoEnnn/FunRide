import { Link, NavLink } from "react-router-dom";
import React, { Component, useState } from "react";
import styles from "./style.module.scss";
import { loginContext } from "../../App";
import { useContext } from "react";

function Navbar() {
  const isBigRole = useContext(loginContext);
  const [toggleState, setToggleState] = useState(true);
  return (
    <div className={styles.base}>
      <nav>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <NavLink to="/searchTrip">Search Trip</NavLink>
          </li>
          <li>
            <NavLink to="/privateTrip">Private Trip</NavLink>
          </li>
          <li>
            <NavLink to="/news">News</NavLink>
          </li>
          <li>
            <NavLink to="/trips">Trip's Info</NavLink>
          </li>
          <li>
            <NavLink to="/contact">Contact</NavLink>
          </li>
          {(isBigRole.isAdmin === true || isBigRole.isManager === true) && (
            <>
              <li>
                <NavLink to="/Discountcode">Discount</NavLink>
              </li>
              <li>
                <NavLink to="/Settings">Setting</NavLink>
              </li>
            </>
          )}
          {isBigRole.isManager === true && (
            <li>
              <NavLink to="/Admin">Admin</NavLink>
            </li>
          )}
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
