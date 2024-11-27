const { app, BrowserWindow, Menu, dialog, ipcMain } = require('electron');
const path = require('path');
const { Client } = require('discord-rpc');
const fs = require('fs');

let mainWindow;

const clientId = '1311112524393087106';
const rpc = new Client({ transport: 'ipc' });

function setRichPresence() {
    rpc.setActivity({
        details: 'Editing with Swift Editor',
        state: 'Focused on Productivity',
        startTimestamp: Date.now(),
        largeImageKey: 'lua-icon',
        largeImageText: 'Swift Editor',
        instance: false,
    });
}

rpc.on('ready', () => {
    console.log('Rich Presence is ready');
    setRichPresence();
    setInterval(setRichPresence, 15 * 1000);
});

rpc.login({ clientId }).catch(console.error);

app.on('ready', () => {
    Menu.setApplicationMenu(null);

    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        icon: path.join(__dirname, 'lua-icon-180x180.png'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    mainWindow.loadURL('https://swifteditor.netlify.app/');

    mainWindow.webContents.on('did-finish-load', () => {
        const injectButtonsScript = `
        if (!document.getElementById('clear-button')) {
            const clearButton = document.createElement('button');
            clearButton.id = 'clear-button';
            clearButton.innerText = '🗑️';
            clearButton.style.position = 'fixed';
            clearButton.style.bottom = '20px';
            clearButton.style.right = '100px';
            clearButton.style.zIndex = '1000';
            clearButton.style.padding = '10px 20px';
            clearButton.style.fontSize = '16px';
            clearButton.style.backgroundColor = '#1e1e1e';
            clearButton.style.color = 'white';
            clearButton.style.border = 'none';
            clearButton.style.borderRadius = '5px';
            clearButton.style.cursor = 'pointer';
    
            clearButton.addEventListener('click', () => {
                if (window.monaco) {
                    const editor = monaco.editor.getModels()[0];
                    if (editor) {
                        editor.setValue('');
                    } else {
                        console.error('Monaco editor model not found.');
                    }
                } else {
                    console.error('Monaco API not available.');
                }
            });
    
            document.body.appendChild(clearButton);
        }
    
        if (!document.getElementById('load-file-button')) {
            const loadFileButton = document.createElement('button');
            loadFileButton.id = 'load-file-button';
            loadFileButton.innerText = '📂';
            loadFileButton.style.position = 'fixed';
            loadFileButton.style.bottom = '20px';
            loadFileButton.style.right = '20px';
            loadFileButton.style.zIndex = '1000';
            loadFileButton.style.padding = '10px 20px';
            loadFileButton.style.fontSize = '16px';
            loadFileButton.style.backgroundColor = '#1e1e1e';
            loadFileButton.style.color = 'white';
            loadFileButton.style.border = 'none';
            loadFileButton.style.borderRadius = '5px';
            loadFileButton.style.cursor = 'pointer';
    
            loadFileButton.addEventListener('click', () => {
                window.electronAPI.openFile();
            });
    
            document.body.appendChild(loadFileButton);
        }
        `;    
        mainWindow.webContents.executeJavaScript(injectButtonsScript).catch(console.error);
    });
});

ipcMain.handle('dialog:openFile', async () => {
    try {
        const { canceled, filePaths } = await dialog.showOpenDialog({
            properties: ['openFile'],
            filters: [{ name: 'Lua Files', extensions: ['lua'] }],
        });

        if (!canceled && filePaths.length > 0) {
            const fileContent = fs.readFileSync(filePaths[0], 'utf-8');

            mainWindow.webContents.executeJavaScript(`
                if (window.monaco) {
                    const editor = monaco.editor.getModels()[0];
                    if (editor) {
                        editor.setValue(\`${fileContent.replace(/`/g, '\\`')}\`);
                    } else {
                        console.error('Monaco editor model not found.');
                    }
                } else {
                    console.error('Monaco API not available.');
                }
            `).catch(console.error);
        }
    } catch (error) {
        console.error('Error handling file dialog:', error);
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('before-quit', () => {
    rpc.destroy();
});