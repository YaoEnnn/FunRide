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
            <NavLink to="/trips">Trips</NavLink>
          </li>
          <li>
            <NavLink to="/contact">Contact</NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Navbar;
