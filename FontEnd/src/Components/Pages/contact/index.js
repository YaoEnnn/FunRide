import styles from "./style.module.scss";
import AnimatedOutlet from "../../AnimatedOutlet";
import React, { Component } from "react";
import { useState } from "react";
import { success } from "../../lib/toast";

function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    success("Thanks for giving us your feedback");
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  };
  return (
    <AnimatedOutlet>
      <div className={styles.base}>
        <div className={styles.about}>
          <div>
            <h1>What is FunRide</h1>
            <label>
              Welcome to Funride, the ultimate car booking agency for all your
              fun and adventure needs! We are dedicated to providing you with
              the best car rental experience that will make your trip
              unforgettable.
            </label>
            <label>
              At Funride, we understand that your time is valuable, and we want
              to make sure that your journey is hassle-free. We offer a wide
              range of vehicles, from luxury sedans to rugged SUVs, that are
              well-maintained and equipped with the latest amenities to ensure a
              comfortable ride.
            </label>
            <label>
              Whether you're planning a family vacation, a weekend getaway, or a
              road trip with friends, we have got you covered. Our team of
              experienced professionals will assist you in finding the perfect
              car that suits your needs and budget. We offer flexible rental
              plans that can be customized to fit your schedule and
              requirements.
            </label>
            <label></label>
          </div>
          <div>
            <h1>Contact Us</h1>
            <label>
              Address at District 1: 45 Đinh Tiên Hoàng street, Da Kao, district
              1, Ho Chi Minh city, Vietnam
            </label>
            <label>
              Address at Binh Tan Distrct: 34W Võ Văn Vân street, Vinh Loc B, Ho
              Chi Minh city, Vietnam
            </label>
            <label>Phone Number: 0385461060</label>
          </div>
        </div>
        <div className={styles.contactpage}>
          <h1>Send us a message</h1>
          <form onSubmit={handleSubmit}>
            <div className={styles.formgroup}>
              <label>Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className={styles.formgroup}>
              <label>Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={styles.formgroup}>
              <label>Subject</label>
              <input
                type="text"
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
            <div className={styles.formgroup}>
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              ></textarea>
            </div>
            <button type="submit">Send</button>
          </form>
        </div>
      </div>
    </AnimatedOutlet>
  );
}
export default Contact;
