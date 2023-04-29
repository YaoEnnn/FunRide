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
        <div className={styles.contactpage}>
          <h1>Contact Us</h1>
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
