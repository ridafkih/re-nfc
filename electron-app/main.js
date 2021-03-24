const path = require('path');
const { app, BrowserWindow, ipcMain } = require('electron');
const { io } = require('socket.io-client');
const keyboard = require('sendkeys-js');

let socket = io("http://raspberrypi/", {
  reconnectionAttempts: 3,
  reconnection: true,
  autoConnect: false
});

let lastStatus;

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

  window.webContents.once('did-finish-load', () => {
    console.log('load complete');

    window.show();
    socket.open();
  })

  window.webContents.on('did-finish-load', () => {
    if (lastStatus) lastStatus();
  })
  
  ipcMain.on('close', () => app.exit(0));

  ipcMain.on('check-receiver', () => {
    console.log('checking receiver...');
    socket.emit('check-receiver');
  })
  
  ipcMain.on('attempt-reconnect', () => {
    handleAttemptingConnection();
    socket.open();
  })
  
  // window.loadFile('./build/index.html');
  window.loadURL("http://localhost:3000/");

  socket.io.on('ping', console.log('pong'));
  socket.io.on('reconnect_attempt', () => console.log('reco attempt'));
  socket.io.on('reconnect_failed', handleFailedReconnect);

  socket.on('connect', handleConnect);
  socket.on('reconnect', handleConnect);
  socket.on('disconnect', handleDisconnect);
  
  socket.on('scan', handleScan);
  socket.on('scan-action', handleScanAction);
  socket.on('keyboard-registered', handleConnect);
  socket.on('keyboard-registration-failed', handleInputType);
  socket.on('valid-input', handleInputType);

  function handleScan(serialNumber) {
    window.webContents.send('get-scan-action', serialNumber);
  }

  function handleScanAction(rewrite) {
    console.log('scan action: ' + rewrite);
  }

  function handleInputType(validInput) {
    console.log(`input type >> ${validInput}`);
    
    lastStatus = handleInputType;

    if (validInput) return;
    window.webContents.send(
      "change-status",
      "warning",
      "No NFC Receiver",
      "NFC receiver not detected. Ensure an NFC receiver is plugged into the USB port of the Raspberry Pi."
    )
  }
  
  function handleConnect() {
    console.log('connection');

    lastStatus = handleConnect;

    window.webContents.send(
      "change-status",
      "check",
      "Connection Successful",
      "You are connected to the server, all scans will be typed out through this system."
    );
  }

  function handleAttemptingConnection() {
    console.log('manual reconnect');

    lastStatus = handleAttemptingConnection;

    window.webContents.send(
      "change-status",
      "info",
      "Connecting...",
      "Attempting to connect to server, make sure the server is on while reconnection attempts are made."
    );
  }
  
  function handleDisconnect() {
    console.log('disconnection');

    lastStatus = handleDisconnect;

    window.webContents.send(
      "change-status",
      "info",
      "Reconnecting...",
      "Connection to server failed, make sure the server is on while reconnection attempts are made."
    );
  }
  
  function handleFailedReconnect() {
    console.log('failed reconnect');

    lastStatus = handleFailedReconnect;

    window.webContents.send(
      "change-status",
      "danger",
      "Connection Failed",
      "Connection to server failed, reconnection attempts exceeded. Ensure the server is online, and then click to reconnect."
    );
  }
})