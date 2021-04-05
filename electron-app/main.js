const path = require('path');
const { app, BrowserWindow, ipcMain, session } = require('electron');
const { io } = require('socket.io-client');
const fetch = require('node-fetch');
const keyboard = require('sendkeys-js');

const socket = io("http://raspberrypi/", {
  reconnectionAttempts: 3,
  reconnection: true,
  autoConnect: false
});

let lastStatus;

app.on('ready', () => {
  session.defaultSession.clearCache();
  
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
    alwaysOnTop: true,
    icon: path.join(__dirname, "icon.ico")
  });

  window.webContents.once('did-finish-load', () => {
    window.show();
    socket.open();
  })

  window.webContents.on('did-finish-load', () => {
    if (lastStatus) 
      lastStatus();
  })
  
  ipcMain.on('close', () => app.exit(0));

  ipcMain.on('check-receiver', () => {
    socket.emit('check-receiver');
  })
  
  ipcMain.on('attempt-reconnect', () => {
    handleAttemptingConnection();
    socket.open();
  })

  ipcMain.on('scan-action', (_, rewrite, serialNumber) => {
    if (rewrite) {
      window.webContents.send('rewrite-in-progress');
      return fetch(`http://raspberrypi/rewriteWristband/${serialNumber}`)
      .then(() => window.webContents.send('exit-rewrite-mode'));
    }

    fetch(`http://raspberrypi/getWristband/${serialNumber}`)
      .then(res => res.json())
      .then(({ newSerialNumber }) => {
        keyboard.sendKeys(`;${newSerialNumber}?`);
      })
    
  });
  
  window.loadFile('./build/index.html');

  socket.io.on('reconnect_failed', handleFailedReconnect);

  socket.on('connect', handleConnect);
  socket.on('reconnect', handleConnect);
  socket.on('disconnect', handleDisconnect);
  
  socket.on('scan', handleScan);
  socket.on('keyboard-registered', handleConnect);
  socket.on('keyboard-registration-failed', handleInputType);
  socket.on('valid-input', handleInputType);

  function handleScan(serialNumber) {
    window.webContents.send('get-scan-action', serialNumber);
  }

  function handleInputType(validInput) {
    lastStatus = validInput ? handleConnect : handleInputType;

    if (validInput) return;
    window.webContents.send(
      "change-status",
      "warning",
      "No NFC Receiver",
      "NFC receiver not detected. Ensure an NFC receiver is plugged into the USB port of the Raspberry Pi."
    )
  }
  
  function handleConnect() {
    lastStatus = handleConnect;

    window.webContents.send(
      "change-status",
      "check",
      "Connection Successful",
      "You are connected to the server, all scans will be typed out through this system."
    );
  }

  function handleAttemptingConnection() {
    lastStatus = handleAttemptingConnection;

    window.webContents.send(
      "change-status",
      "info",
      "Connecting...",
      "Attempting to connect to server, make sure the server is on while reconnection attempts are made."
    );
  }
  
  function handleDisconnect() {
    lastStatus = handleDisconnect;

    window.webContents.send(
      "change-status",
      "info",
      "Reconnecting...",
      "Connection to server failed, make sure the server is on while reconnection attempts are made."
    );
  }
  
  function handleFailedReconnect() {
    lastStatus = handleFailedReconnect;

    window.webContents.send(
      "change-status",
      "danger",
      "Connection Failed",
      "Connection to server failed, reconnection attempts exceeded. Ensure the server is online, and then click to reconnect."
    );
  }
})
