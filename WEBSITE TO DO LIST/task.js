const monthYearDisplay = document.getElementById("monthYearDisplay");
const calendarBody = document.getElementById("calendarBody");
const prevMonthBtn = document.getElementById("prevMonthBtn");
const nextMonthBtn = document.getElementById("nextMonthBtn");
const addEventBtn = document.getElementById("addEventBtn");
const logoutBtn = document.getElementById("logoutBtn");
const addEventForm = document.getElementById("addEventForm");
const cancelEventBtn = document.getElementById("cancelEventBtn");
const reminderCheckbox = document.getElementById("reminderCheckbox");
const reminderTimeContainer = document.getElementById("reminderTimeContainer");
const saveEventBtn = document.getElementById("saveEventBtn");
const activityContainer = document.querySelector('.container');

let currentDate = new Date();
let activities = JSON.parse(localStorage.getItem("activities")) || [];

// Fungsi untuk menghasilkan ID unik
function generateUniqueId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

function renderCalendar() {
    const month = currentDate.getMonth();
    const year = currentDate.getFullYear();
    
    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    monthYearDisplay.textContent = `${monthNames[month]} ${year}`;
    
    calendarBody.innerHTML = ""; // Bersihkan kalender sebelumnya
    
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let row = document.createElement("tr");
    
    for (let i = 0; i < firstDayOfMonth; i++) {
        row.appendChild(document.createElement("td"));
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
        const cell = document.createElement("td");
        cell.textContent = day;
        
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        
        // Menampilkan aktivitas pada tanggal yang sesuai
        renderActivitiesInCalendar(cell, dateKey);
        
        cell.addEventListener('click', () => {
            const selectedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            document.getElementById("activityDate").value = selectedDate; // Set tanggal yang dipilih ke form
            addEventForm.style.display = "block"; // Tampilkan form untuk menambah aktivitas
        });
        
        row.appendChild(cell);

        if (row.children.length === 7) {
            calendarBody.appendChild(row);
            row = document.createElement("tr");
        }
    }

    calendarBody.appendChild(row);
    renderActivities(); // Tampilkan aktivitas dalam kontainer
}

function renderActivitiesInCalendar(cell, dateKey) {
    cell.innerHTML = cell.textContent; // Kosongkan aktivitas sebelumnya
    activities.filter(activity => activity.date === dateKey).forEach(activity => {
        const activityDiv = document.createElement("div");
        activityDiv.className = "calendar-activity";
        activityDiv.textContent = activity.name;
        cell.appendChild(activityDiv);
    });
}

prevMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
});

nextMonthBtn.addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
});

addEventBtn.addEventListener("click", () => {
    addEventForm.style.display = "block";
});

cancelEventBtn.addEventListener("click", () => {
    addEventForm.style.display = "none";
});

saveEventBtn.addEventListener("click", () => {
    const activityName = document.getElementById("activityName").value;
    const activityDate = document.getElementById("activityDate").value;
    const reminderTime = document.getElementById("reminderTime").value;
    const isReminderSet = reminderCheckbox.checked;

    if (activityName && activityDate) {
        const activity = {
            id: generateUniqueId(), // Tambahkan ID unik
            name: activityName,
            date: activityDate,
            reminderTime: isReminderSet ? reminderTime : null,
            completed: false
        };

        activities.push(activity);
        updateLocalStorage();
        addEventForm.style.display = "none";
        clearForm();
        renderCalendar(); // Render ulang kalender setelah menambah aktivitas
    }
});

reminderCheckbox.addEventListener("change", () => {
    toggleReminderTime();
});

function toggleReminderTime() {
    reminderTimeContainer.style.display = reminderCheckbox.checked ? "block" : "none";
}

function clearForm() {
    document.getElementById("activityName").value = "";
    document.getElementById("activityDate").value = "";
    document.getElementById("reminderCheckbox").checked = false;
    document.getElementById("reminderTime").value = "";
    reminderTimeContainer.style.display = "none";
}

function updateLocalStorage() {
    localStorage.setItem("activities", JSON.stringify(activities));
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('id-ID', options);
}

function renderActivities() {
    activityContainer.innerHTML = ""; // Kosongkan kontainer aktivitas sebelum merender ulang

    const groupedActivities = {};
    activities.forEach(activity => {
        const date = activity.date;
        if (!groupedActivities[date]) {
            groupedActivities[date] = [];
        }
        groupedActivities[date].push(activity);
    });

    const sortedDates = Object.keys(groupedActivities).sort((a, b) => new Date(a) - new Date(b));

    sortedDates.forEach(date => {
        const dateHeader = document.createElement("h4");
        dateHeader.textContent = formatDate(date);
        dateHeader.style.color = "#FEFAE0";
        dateHeader.style.marginTop = "10px";
        activityContainer.appendChild(dateHeader);

        const dateContainer = document.createElement("div");
        dateContainer.className = "date-activity-container";
        dateContainer.style.marginBottom = "50px";

        groupedActivities[date].forEach((activity) => {
            const activityItem = document.createElement("div");
            activityItem.className = "activity-item";
            activityItem.style.marginTop = "10px";

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.className = "activity-checkbox";
            checkbox.checked = activity.completed;

            const activityText = document.createElement("span");
            activityText.textContent = `${activity.name} ${activity.reminderTime ? `- ${activity.reminderTime}` : ""}`;
            
            if (activity.completed) {
                activityText.style.textDecoration = "line-through";
                activityText.style.color = "#999";
            } else {
                activityText.style.textDecoration = "none";
                activityText.style.color = "#54473F";
            }

            checkbox.addEventListener("change", () => {
                activity.completed = checkbox.checked;
                if (activity.completed) {
                    activityText.style.textDecoration = "line-through";
                    activityText.style.color = "#999";
                } else {
                    activityText.style.textDecoration = "none";
                    activityText.style.color = "#54473F";
                }
                updateLocalStorage();
            });

            const deleteBtn = document.createElement("button");
            deleteBtn.innerHTML = "&#128465;";
            deleteBtn.className = "delete-button";
            
            deleteBtn.addEventListener("click", () => {
                if (confirm("Apakah Anda yakin ingin menghapus aktivitas ini?")) {
                    // Menghapus aktivitas berdasarkan ID
                    activities = activities.filter(a => a.id !== activity.id);
                    updateLocalStorage();
                    renderCalendar(); // Render ulang kalender setelah menghapus aktivitas
                }
            });

            activityItem.appendChild(checkbox);
            activityItem.appendChild(activityText);
            activityItem.appendChild(deleteBtn);
            dateContainer.appendChild(activityItem);
        });

        activityContainer.appendChild(dateContainer);
    });
}

logoutBtn.addEventListener("click", () => {
    window.location.href = 'login.html';
});

renderCalendar();
