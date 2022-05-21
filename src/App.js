import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json";

export default function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  const [interactionsTotalCount, setInteractionsTotalCount] = useState("");
  const [message, setMessage] = useState("");

  const [allWaves, setAllWaves] = useState([]);

  const [isLoading, setIsLoading] = useState(false);


  const contractAddress = "0xB3e1112af72a8ecC2f0e5624a3374a31651cA80C";
  const contractABI = abi.abi;
  
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setCurrentAccount(account);
        getAllWaves();
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert ("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
      getAllWaves();
      getInfo();
    } catch (error) {
      console.log(error);
    }
  }

  const getInfo = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getTotalWaves();
        setInteractionsTotalCount(count.toNumber());
        console.log("Retrieved total wave count...", count.toNumber());
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getAllWaves = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        const waves = await wavePortalContract.getAllWaves();

        let wavesCleaned = [];
        waves.forEach(wave => {
          wavesCleaned.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });

        setAllWaves(wavesCleaned.reverse());
        allWavesInfo();
      } else {
        console.log("Ethereum object doesn't exist");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const wave = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
        
        const waveTxn = await wavePortalContract.wave(message, { gasLimit: 300000 });
        console.log('Mining...', waveTxn.hash);
        setIsLoading(true);

        await waveTxn.wait();
        console.log('Mined -- ', waveTxn.hash);
        setIsLoading(false);
        setMessage("");

        getAllWaves();
        getInfo();
      } else {
        console.log("Ethereum object doesn't exit!");
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    let wavePortalContract;

    const onNewWave = (from, timestamp, message) => {
      console.log("New wave", from, timestamp, message);
      setAllWaves(prevState => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message,
        },
      ]);
    };

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      wavePortalContract.on("NewWave", onNewWave);
    }

    return () => {
      if (wavePortalContract) {
        wavePortalContract.off("NewWave", onNewWave);
      }
    };
  }, []);

  

  const Interacion = () => {
    if (currentAccount) {
      return (
        <button className="waveButton" onClick={wave}>
          Interact with Me!
        </button>
      )
    }
  }

  const allWavesInfo = () => {
    if (currentAccount) {
      return (
        allWaves.map((wave, index) => {
          return (
            <div key={index} style={{backgroundColor: "whitesmoke", marginTop: "16px", padding: "8px"}}>
              <div>Address: {wave.address}</div>
              <div>Time: {wave.timestamp.toString()}</div>
              <div>Message: {wave.message}</div>
            </div>
          )
        })
      )
    }
  }

  const messageInput = () => {
    if (currentAccount) {
      return (
        <form style={{backgroundColor: "whitesmoke", marginTop: "16px", padding: "8px"}}>
          <input
            placeholder="Your message"
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            style={{display: "block", width: "98%"}}
          />
        </form>
      )
    }
  }

  const loadingSpinner = () => {
    if (isLoading) {
      return (
        <div className="loading-spinner">
        </div>
      )
    }
  }

  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
          Hello there
        </div>

        <div className="bio">
          General Kenobi (you'd say)...<br></br>
          Join us and get to the top!
        </div>

        {messageInput()}

        {currentAccount && (
          <button className="waveButton" onClick={wave}>
            Interact with Me!
            {loadingSpinner()}
          </button>
        )}
        
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect wallet
          </button>
        )}

        <div className="all-waves">
          {allWavesInfo()}
        </div>
      </div>
    </div>
  );
}
