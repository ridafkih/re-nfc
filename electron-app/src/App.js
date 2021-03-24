import dangerIcon from './img/danger.svg';
import warningIcon from './img/warning.svg';
import infoIcon from './img/info.svg';
import checkIcon from './img/check.svg';

import { useState, useEffect } from 'react';

import './App.css';

const { ipcRenderer } = window.require("electron");

function App() {
  const [message, setMessage] = useState("Connecting...");
  const [description, setDescription] = useState("Attempting to connect to server, make sure the server is on while connection attempts are made.");
  const [status, setStatus] = useState("info");

  useEffect(() => {
    ipcRenderer.on("change-status", (_, newStatus, newMessage, newDescription) => {
      setStatus(newStatus);
      setMessage(newMessage);
      setDescription(newDescription);
    })
  }, [])

  return (
    <div className={"App " + status}>
      <div className="App-root">
        <div className="App-notification-container">
          {status === "danger" &&
            <img className="App-notification-icon" src={dangerIcon} alt="" srcSet=""/>
          }
          {status === "warning" &&
            <img className="App-notification-icon" src={warningIcon} alt="" srcSet=""/>
          }
          {status === "info" &&
            <img className="App-notification-icon" src={infoIcon} alt="" srcSet=""/>
          }
          {status === "check" &&
            <img className="App-notification-icon" src={checkIcon} alt="" srcSet=""/>
          }
          <div className="App-bulb App-bulb-s"></div>
          <div className="App-notification"></div>
          <div className="App-bulb App-bulb-l"></div>
        </div>
        <div className="App-notification-message">{message}</div>
        <div className="App-notification-description">{description}</div>
      </div>
      <div className="App-buttons">
          <button className="App-button" onClick={abort}>Close</button>
          {status === "danger" &&
            <button className="App-button App-button-highlight" onClick={reconnectSocket}>Attempt Reconnect</button>
          }
          {status === "check" &&
            <button className="App-button App-button-highlight">Rewrite Wristband (Coming Soon)</button>
          }
          </div>
    </div>
  );
}

function reconnectSocket() {
  ipcRenderer.send("attempt-reconnect");
}

function abort() {
  ipcRenderer.send("close");
}

export default App;
