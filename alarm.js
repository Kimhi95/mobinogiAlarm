const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    // 알림
    showNotification: (body) => {
        new Notification("아 맞다", {
            body,
            icon: "icon.ico",
            silent: true,
        });
    },
    // // 심구
    send: (channel, data) => {
        ipcRenderer.send(channel, data);
    },
    on: (channel, callback) => {
        ipcRenderer.on(channel, (_, data) => callback(data));
    },
});
