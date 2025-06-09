const main = document.querySelector("#main");

const holeCheckBox = main.querySelector("#hole");
const holeTimer = main.querySelector("#holeTime");

holeTimer.addEventListener("keyup", function (evt) {
    if (evt.target.value === null) return;
    evt.target.value = Math.max(0, Math.min(59, evt.target.value || 0));

    if (!holeCheckBox.checked) return;
    electronAPI.send("cancel-hole");
    electronAPI.send("schedule-hole", evt.target.value);
});

holeCheckBox.addEventListener("change", function (evt) {
    if (evt.target.checked) {
        electronAPI.send("schedule-hole", holeTimer.value);
    } else {
        electronAPI.send("cancel-hole");
    }
});

const checkBox = main.querySelectorAll(".timeCheckBox");
main.querySelector("#onTime").addEventListener("change", function (evt) {
    if (evt.target.checked) {
        electronAPI.send("schedule-onTime", checkBox);
    } else {
        checkBox.forEach(function (checkBox) {
            checkBox.checked = false;
        });
        electronAPI.send("cancel-onTime");
    }
});
