import { Link, NavLink } from "react-router-dom";
import React, { Component } from "react";
import styles from "./style.module.scss";

function Navbar() {
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
          <li>
            <NavLink to="/Discountcode">Discount</NavLink>
          </li>
          <li>
            <NavLink to="/Admin">Admin</NavLink>
          </li>
          <li>
            <NavLink to="/setting">Setting</NavLink>
          </li>
          <li>
            <NavLink to="/Logout">Logout</NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
