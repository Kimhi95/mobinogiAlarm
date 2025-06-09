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

const onTime = main.querySelector("#onTime");
const checkboxList = main.querySelectorAll(".timeCheckBox");
onTime.addEventListener("change", function (evt) {
    if (evt.target.checked) {
        const hour = Array.from(checkboxList)
            .filter((checkbox) => {
                return checkbox.checked;
            })
            .map((checkbox) => {
                return parseInt(checkbox.dataset.time, 10);
            }, []);
        if (hour.length > 0) electronAPI.send("schedule-onTime", hour);
    } else {
        checkboxList.forEach(function (checkBox) {
            checkBox.checked = false;
        });
        electronAPI.send("cancel-onTime");
    }
});

checkboxList.forEach(function (checkBox) {
    checkBox.addEventListener("change", function () {
        const hour = Array.from(checkboxList)
            .filter((checkbox) => {
                return checkbox.checked;
            })
            .map((checkbox) => {
                return parseInt(checkbox.dataset.time, 10);
            }, []);
        electronAPI.send("cancel-onTime");
        if (hour.length > 0 && onTime.checked) electronAPI.send("schedule-onTime", hour);
    });
});
