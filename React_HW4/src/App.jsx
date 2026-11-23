import { useState } from "react";
import Characters from "./components/Characters";
import Potions from "./components/Potions";
import Spells from "./components/Spells";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <>
      <div className="app-wrapper">
        <h1 style={{ textAlign: "center", paddingTop: "20px" }}>
          Harry Potter Info
        </h1>
        <p style={{ textAlign: "center", padding: "20px", margin: "10px" }}>
          A web app that lets you explore the characters, potions, and spells in
          the world of Harry Potter.
        </p>
        <Characters />
        <Potions />
        <Spells />
      </div>
      <div className="animated-bg"></div>
    </>
  );
}

export default App;
