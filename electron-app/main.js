const path = require('path');

const { app, BrowserWindow, ipcMain } = require('electron');

const { io } = require('socket.io-client');

let socket;

const createWindow = () => {
  const window = new BrowserWindow({
    height: 420,
    width: 480,
    show: false,
    resizable: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: false
    },
    alwaysOnTop: true
  });

  window.webContents.on('did-finish-load', () => {
    window.show();

    if (socket) {
      if (socket.connected) handleConnect();
    } else {
      socket = io("http://raspberrypi.localdomain/", {
        reconnectionAttempts: 60
      });

      socket.on('connect', handleConnect);
      socket.on('disconnect', handleDisconnect);
      socket.on('reconnect_failed', handleFailedReconnect);
    }
  })
  
  window.loadURL("http://localhost:3000/");

  function handleConnect() {
    console.log("Connected");
    window.webContents.send(
      "change-status",
      "check",
      "Connection Successful",
      "You are connected to the server, all scans will be typed out through this system."
    );
  }

  function handleDisconnect() {
    window.webContents.send(
      "change-status",
      "info",
      "Reconnecting...",
      "Connection to server failed, make sure the server is on while reconnection attempts are made."
    );
  }

  function handleFailedReconnect() {
    window.webContents.send(
      "change-status",
      "danger",
      "Connection Failed",
      "Connection to server failed, reconnection attempts exceeded. Ensure the server is online, and then click to reconnect."
    )
  }

}

app.on('ready', createWindow);