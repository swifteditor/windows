const { BrowserWindow } = require('electron');
const config = require('./config');

function createMainWindow() {
    const mainWindow = new BrowserWindow(config.windowConfig);
    mainWindow.loadURL(config.appUrl);
    return mainWindow;
}

module.exports = { createMainWindow };