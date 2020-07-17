import React from "react";
import { useScripts } from "../src/useScripts";

import "./Home.css";

const Home = () => {
  useScripts([() => import("../src/home")]);
  return <h1 id="home">Home Page</h1>;
};

export default Home;
