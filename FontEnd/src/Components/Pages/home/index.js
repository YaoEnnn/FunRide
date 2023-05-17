import styles from "./style.module.scss";
import AnimatedOutlet from "../../AnimatedOutlet";
import React, { Component } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../../Img/FunRide Logo.png";

function Home() {
  const navigate = useNavigate();

  return (
    <AnimatedOutlet>
      <div className={styles.base}>
        <div className={styles.header}>
          <img src={logo}></img>
          <p>Welcome to FunRide</p>
        </div>
        <div>
          <h1>Popular Routes</h1>
          <div className={styles.popular}>
            <div>
              <div
                onClick={() => {
                  navigate("/Dis1-VT");
                }}
              >
                From District 1 to Vung Tau
              </div>
              <div
                onClick={() => {
                  navigate("/Dis1-BL");
                }}
              >
                From District 1 to Bao Loc
              </div>
              <div
                onClick={() => {
                  navigate("/BtDis-VT");
                }}
              >
                From Binh Tan to Vung Tau
              </div>
              <div
                onClick={() => {
                  navigate("/BtDis-BL");
                }}
              >
                From Binh Tan to Bao Loc
              </div>
            </div>
            <div>
              <div
                onClick={() => {
                  navigate("/VT-Dis1");
                }}
              >
                From Vung Tau to District 1
              </div>
              <div
                onClick={() => {
                  navigate("/VT-BtDis");
                }}
              >
                From Vung Tau to Binh Tan
              </div>
              <div
                onClick={() => {
                  navigate("/BL-Dis1");
                }}
              >
                From Bao Loc to District 1
              </div>
              <div
                onClick={() => {
                  navigate("/BL-BtDis");
                }}
              >
                From Bao Loc to Binh Tan
              </div>
            </div>
          </div>
          <h1>Customers' Reviews</h1>
          <div className={styles.reviews}>
            <div>
              <img src="https://mashummollah.com/wp-content/uploads/2020/07/Elon-Musk.jpg"></img>
              <p>
                I had a great experience using FunRide to rent a car for my
                vacation. The website was easy to use, provided detailed car
                information and customer reviews, and offered transparent
                pricing with no hidden fees. I had no issues with the car and
                appreciated the website's 24/7 customer support. Highly
                recommend!
              </p>
            </div>
            <div>
              <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=688&q=80"></img>
              <p>
                As a reviewer, I am thrilled to share my experience with
                FunRide, a top-notch car booking agency that has truly made my
                life easier. From the moment I had the pleasure to use their
                website, I was blown away by the seamless user interface,
                allowing me to easily book a ride with just a few clicks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AnimatedOutlet>
  );
}
export default Home;
