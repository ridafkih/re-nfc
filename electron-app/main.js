const { app, BrowserWindow, ipcMain } = require('electron');

const { io } = require('socket.io-client');
const socket = io("http://raspberrypi.localdomain/");

socket.on('connection', () => {

});

const createWindow = () => {
  const window = new BrowserWindow({
    height: 420,
    width: 420,
    resizable: false,
    autoHideMenuBar: true
  })

  window.loadURL("http://localhost:3000/");
}

app.on('ready', createWindow);