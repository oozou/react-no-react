import React from "react";
import { useScripts } from "../src/useScripts";

const AboutUs = () => {
  useScripts([() => import("../src/about-us")]);
  return <h1>About Us</h1>;
};

export default AboutUs;
