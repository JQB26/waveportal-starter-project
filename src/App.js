import * as React from "react";
import { ethers } from "ethers";
import './App.css';

export default function App() {

  const wave = () => {
    
  }
  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
          Hello there
        </div>

        <div className="bio">
          General Kenobi (you'd say)...<br></br>
          Join me and interact with others!
        </div>

        <button className="waveButton" onClick={wave}>
          Interact with Me!
        </button>
      </div>
    </div>
  );
}
