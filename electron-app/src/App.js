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

  const [rewriteMode, setRewriteMode] = useState(false);

  useEffect(() => {
    ipcRenderer.on('change-status', (_, newStatus, newMessage, newDescription) => {
      setStatus(newStatus);
      setMessage(newMessage);
      setDescription(newDescription);
    })
  }, []);

  function reconnectSocket() {
    ipcRenderer.send('attempt-reconnect');
  }

  function abort() {
    ipcRenderer.send('close');
  }

  function toggleRewriteMode() {
    setRewriteMode(!rewriteMode);
  }

  return (
    <div className={`App ${status} rewrite-${rewriteMode}`}>
      <div className="App-root">
        <div className="App-notification-container">
          {status === "danger" &&
            <img className="App-notification-icon" src={dangerIcon} alt="" srcSet=""/>
          }
          {status === "warning" &&
            <img className="App-notification-icon" src={warningIcon} alt="" srcSet=""/>
          }
          {(status === "info" || status === "rewrite") &&
            <img className="App-notification-icon" src={infoIcon} alt="" srcSet=""/>
          }
          {status === "check" &&
            <img className="App-notification-icon" src={checkIcon} alt="" srcSet=""/>
          }
          <div className="App-bulb App-bulb-s"></div>
          <div className="App-notification"></div>
          <div className="App-bulb App-bulb-l"></div>
        </div>
        <div className="App-notification-message">
          {rewriteMode && status === "check" ? "Rewrite Mode" : message}
        </div>
        <div className="App-notification-description">
          {rewriteMode && status === "check" ? "Rewrite mode is active, scan a near-field communication device to rewrite the serial number." : description}
        </div>
      </div>
      <div className="App-buttons">
          <button className="App-button" onClick={abort}>Close</button>
          {status === "danger" &&
            <button className="App-button App-button-highlight" onClick={reconnectSocket}>Attempt Reconnect</button>
          }
          {status === "check" &&
            <button className="App-button App-button-highlight" onClick={toggleRewriteMode}>
              {rewriteMode ? "Exit Rewrite Mode" : "Enter Rewrite Mode"}
            </button>
          }
          </div>
    </div>
  );
}

export default App;
