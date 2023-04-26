import { motion } from "framer-motion";
import React, { Component } from "react";

const animations = {
  i: { opacity: 0, x: -50 },
  a: { opacity: 1, x: 0 },
  e: { opacity: 0, x: 50 },
};

function AnimatedOutlet({ children }) {
  return (
    <motion.div
      variants={animations}
      initial="i"
      animate="a"
      exit="e"
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

export default AnimatedOutlet;
