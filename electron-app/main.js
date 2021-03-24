const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const { io } = require('socket.io-client');
const keyboard = require('sendkeys-js');

let socket = io("http://raspberrypi.localdomain/", {
  reconnectionAttempts: 3,
  reconnection: true,
  autoConnect: false
});

app.on('ready', () => {
  const window = new BrowserWindow({
    height: 420,
    width: 520,
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
    socket.open();
  })
  
  ipcMain.on('close', () => app.exit(0));
  ipcMain.on('attempt-reconnect', () => {
    handleAttemptingConnection();
    socket.open();
  })
  
  window.loadURL("http://localhost:3000/");

  socket.io.on('ping', console.log('pong'));
  socket.io.on('reconnect_attempt', () => console.log('reco attempt'));
  socket.io.on('reconnect_failed', handleFailedReconnect);

  socket.on('connect', handleConnect);
  socket.on('reconnect', handleConnect);
  socket.on('disconnect', handleDisconnect);
  
  socket.on('scan', handleScan);

  function handleScan(serialNumber) {
    keyboard.sendKeys(`;${serialNumber}?`);
  }
  
  function handleConnect() {
    console.log('connection');

    window.webContents.send(
      "change-status",
      "check",
      "Connection Successful",
      "You are connected to the server, all scans will be typed out through this system."
    );
  }

  function handleAttemptingConnection() {
    console.log('manual reconnect');

    window.webContents.send(
      "change-status",
      "info",
      "Connecting...",
      "Attempting to connect to server, make sure the server is on while reconnection attempts are made."
    );
  }
  
  function handleDisconnect() {
    console.log('disconnection');

    window.webContents.send(
      "change-status",
      "info",
      "Reconnecting...",
      "Connection to server failed, make sure the server is on while reconnection attempts are made."
    );
  }
  
  function handleFailedReconnect() {
    console.log('failed reconnect');

    window.webContents.send(
      "change-status",
      "danger",
      "Connection Failed",
      "Connection to server failed, reconnection attempts exceeded. Ensure the server is online, and then click to reconnect."
    );
  }
})