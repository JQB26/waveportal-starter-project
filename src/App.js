import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import './App.css';
import abi from "./utils/WavePortal.json";

export default function App() {

  const [currentAccount, setCurrentAccount] = useState("");
  const [interactionsTotalCount, setInteractionsTotalCount] = useState("");
  const [interactionsAccountCount, setInteractionsAccountCount] = useState("");


  const contractAddress = "0x8711839C4b06c1d625Bb662424A5D31D9a8CE7d0";
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

        let accountCount = await wavePortalContract.getInteractions(currentAccount);
        setInteractionsAccountCount(accountCount.toNumber());
        console.log('ACCOUTN COUNT:', accountCount.toNumber());
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

        let count = await wavePortalContract.getTotalWaves();
        setInteractionsTotalCount(count.toNumber());
        console.log("Retrieved total wave count...", count.toNumber());

        let accountCount = await wavePortalContract.getInteractions(currentAccount);
        setInteractionsAccountCount(accountCount.toNumber());
        console.log('ACCOUTN COUNT:', accountCount.toNumber());
        
        const waveTxn = await wavePortalContract.wave();
        console.log('Mining...', waveTxn.hash);

        await waveTxn.wait();
        console.log('Mined -- ', waveTxn.hash);

        count = await wavePortalContract.getTotalWaves();
        setInteractionsTotalCount(count.toNumber());
        console.log("Retrieved total wave count...", count.toNumber());

        accountCount = await wavePortalContract.getInteractions(currentAccount);
        setInteractionsAccountCount(accountCount.toNumber());
        console.log('ACCOUTN COUNT:', accountCount.toNumber());
      } else {
        console.log("Ethereum object doesn't exit!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    getInfo();
  });

  const interactionsInfo = () => {
    if (currentAccount) {
      return (
        <div className="interactions">
          <div className="interactionsInfo" id="total">
            Total interactions:<br></br>{interactionsTotalCount}
          </div>
          <div className="interactionsInfo" id="userTotal">
            Total interactions with your account:<br></br>{interactionsAccountCount}
          </div>
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

        {currentAccount && (
          <button className="waveButton" onClick={wave}>
            Interact with Me!
          </button>
        )}

        {interactionsInfo()}
        
        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
            Connect wallet
          </button>
        )}
      </div>
    </div>
  );
}
