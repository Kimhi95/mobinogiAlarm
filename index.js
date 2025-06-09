const { app, BrowserWindow, Menu, Tray, ipcMain, Notification } = require("electron");
const path = require("path");
const schedule = require("node-schedule");
const notifier = require("node-notifier");

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 240,
        height: 480,
        resizable: false,
        fullscreenable: false,
        icon: path.join(__dirname, "icon.ico"),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, "alarm.js"),
        },
    });

    mainWindow.setAppDetails({
        appId: "com.mobinogi.alarm",
        appIconPath: path.join(__dirname, "icon.ico"),
        relaunchCommand: process.argv.join(" "),
        relaunchDisplayName: "아 맞다",
    });

    mainWindow.loadFile("home.html");
    createTray(mainWindow);

    mainWindow.once("ready-to-show", () => {
        mainWindow.show();
    });

    mainWindow.on("close", (event) => {
        if (!app.isQuiting) {
            event.preventDefault();
            mainWindow.hide();
        }
        return false;
    });

    mainWindow.on("minimize", (e) => {
        e.preventDefault();
        mainWindow.hide();
    });
}

function createTray(mainWindow) {
    const tray = new Tray(path.join(__dirname, "icon.ico"));
    const contextMenu = Menu.buildFromTemplate([
        {
            label: "열기",
            click: () => {
                mainWindow.show();
            },
        },
        {
            label: "종료",
            click: () => {
                app.quit();
            },
        },
    ]);

    tray.setToolTip("아 맞다");
    tray.setContextMenu(contextMenu);

    tray.on("double-click", () => {
        mainWindow.show();
    });
}

Menu.setApplicationMenu(null);

app.whenReady().then(() => {
    app.setAppUserModelId("com.mobinogi.alarm");
    createWindow();
});

app.on("before-quit", () => {
    app.isQuiting = true;
});

let hole = null;
ipcMain.on("schedule-hole", (event, minute) => {
    const rule = new schedule.RecurrenceRule();
    rule.minute = [minute, (minute + 30) % 60];
    hole = schedule.scheduleJob(rule, () => {
        notifier.notify({
            title: "아 맞다",
            message: "심구",
            icon: path.join(__dirname, "icon.ico"),
            appName: "아 맞다 심구",
            silent: true,
        });
    });
});

ipcMain.on("cancel-hole", () => {
    if (hole) {
        hole.cancel();
        hole = null;
    }
});

let onTime = null;
ipcMain.on("schedule-onTime", (event, checkboxList) => {
    onTime = schedule.scheduleJob("0 0 * * * *", () => {
        const nowHour = new Date().getHours();
        const activeCheckbox = Array.from(checkboxList).find((checkbox) => {
            const dataTime = parseInt(checkbox.dataset.time, 10);
            return checkbox.checked && dataTime === nowHour;
        });
        if (!activeCheckbox) return;
        notifier.notify({
            title: "아 맞다",
            message: "결계",
            icon: path.join(__dirname, "icon.ico"),
            appName: "아 맞다 결계",
            silent: true,
        });
    });
});

ipcMain.on("cancel-onTime", () => {
    if (onTime) {
        onTime.cancel();
        onTime = null;
    }
});
