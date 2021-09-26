import React, { useContext } from "react";
import { UserContext } from "../../App";
import styles from "./Home.module.css";
import { useHistory } from "react-router-dom";

const Home = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const token = localStorage.getItem("jwt");
  if (!token) {
    history.push("/signin");
  }
  return <div>Home</div>;
};

export default Home;
