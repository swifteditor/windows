const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    openFile: async () => {
        try {
            return await ipcRenderer.invoke('dialog:openFile');
        } catch (error) {
            console.error('Error in openFile IPC:', error);
            throw error;
        }
    },
});