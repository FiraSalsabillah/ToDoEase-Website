// Mendapatkan konteks untuk grafik
const ctxCompleted = document.getElementById('completedTasksChart').getContext('2d');
const ctxPending = document.getElementById('pendingTasksChart').getContext('2d');

// Contoh data aktivitas yang disimpan di localStorage
let activities = JSON.parse(localStorage.getItem("activities")) || [];

// Memeriksa apakah localStorage kosong, jika iya, maka menyimpan data contoh
if (activities.length === 0) {
    activities = [
        { title: 'Finish project', completed: true, date: '2024-11-02' },
        { title: 'Start new task', completed: false, date: '2024-11-02' },
        { title: 'Review documents', completed: true, date: '2024-11-01' },
        { title: 'Meeting with team', completed: false, date: '2024-11-01' },
    ];
    localStorage.setItem("activities", JSON.stringify(activities));
}

// Fungsi untuk memperbarui grafik berdasarkan tanggal
function updateCharts(selectedDate) {
    const activitiesForDate = activities.filter(activity => activity.date === selectedDate);
    const completedTasks = activitiesForDate.filter(activity => activity.completed).length;
    const totalTasks = activitiesForDate.length;

    if (totalTasks === 0) {
        alert("Tidak ada aktivitas yang ditemukan untuk tanggal yang dipilih.");
        completedTasksChart.data.datasets[0].data = [0, 100];
        completedTasksChart.update();
        pendingTasksChart.data.datasets[0].data = [100, 0];
        pendingTasksChart.update();
        document.querySelectorAll('.container-chart-percentage')[0].textContent = `0%`;
        document.querySelectorAll('.container-chart-percentage')[1].textContent = `100%`;
        return;
    }

    const completedPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
    const remainingCompleted = 100 - completedPercentage;

    completedTasksChart.data.datasets[0].data = [completedPercentage, remainingCompleted];
    completedTasksChart.update();

    const pendingPercentage = 100 - completedPercentage;
    pendingTasksChart.data.datasets[0].data = [pendingPercentage, remainingCompleted];
    pendingTasksChart.update();

    document.querySelectorAll('.container-chart-percentage')[0].textContent = `${Math.round(completedPercentage)}%`;
    document.querySelectorAll('.container-chart-percentage')[1].textContent = `${Math.round(pendingPercentage)}%`;
}

// Fungsi untuk memperbarui grafik mingguan
function updateWeeklyCharts() {
    const completedTasksPerDay = Array(7).fill(0);
    const pendingTasksPerDay = Array(7).fill(0);

    const activities = JSON.parse(localStorage.getItem("activities")) || [];
    activities.forEach(activity => {
        const dayIndex = new Date(activity.date).getDay();
        if (activity.completed) {
            completedTasksPerDay[dayIndex]++;
        } else {
            pendingTasksPerDay[dayIndex]++;
        }
    });

    weeklyCompletedChart.data.datasets[0].data = completedTasksPerDay;
    weeklyCompletedChart.update();

    weeklyPendingChart.data.datasets[0].data = pendingTasksPerDay;
    weeklyPendingChart.update();
}

// Event listener untuk tombol Load Report
document.getElementById('loadReportBtn').addEventListener('click', () => {
    const selectedDate = document.getElementById('reportDate').value;
    if (selectedDate) {
        updateCharts(selectedDate);
        updateWeeklyCharts(); // Memperbarui grafik mingguan setiap kali data harian diperbarui
    } else {
        alert("Please select a date.");
    }
});

// Inisialisasi grafik saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    const initialDate = new Date().toISOString().split('T')[0];
    document.getElementById('reportDate').value = initialDate;
    updateCharts(initialDate);
    updateWeeklyCharts();
});

// Inisialisasi grafik donat
const completedTasksChart = new Chart(ctxCompleted, {
    type: 'doughnut',
    data: {
        labels: ['Completed', 'Remaining'],
        datasets: [{
            label: 'Tasks',
            data: [0, 100],
            backgroundColor: ['#798645', '#DED0B6'],
            borderWidth: 0
        }]
    },
    options: {
        cutout: '80%',
        responsive: true,
        plugins: {
            tooltip: { enabled: false },
            legend: { display: false }
        }
    }
});

const pendingTasksChart = new Chart(ctxPending, {
    type: 'doughnut',
    data: {
        labels: ['Pending', 'Remaining'],
        datasets: [{
            label: 'Tasks',
            data: [100, 0],
            backgroundColor: ['#803D3B', '#DED0B6'],
            borderWidth: 0
        }]
    },
    options: {
        cutout: '80%',
        responsive: true,
        plugins: {
            tooltip: { enabled: false },
            legend: { display: false }
        }
    }
});

// Inisialisasi grafik mingguan
const weeklyCompletedChart = new Chart(
    document.getElementById('weeklyCompletedChart'),
    {
        type: 'line',
        data: {
            labels: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
            datasets: [{
                label: 'Tugas Selesai',
                data: Array(7).fill(0),
                borderColor: '#9d93c4',
                backgroundColor: 'rgba(157, 147, 196, 0.2)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(0, 0, 0, 0.1)' } },
                x: { grid: { display: false } }
            }
        }
    }
);

const weeklyPendingChart = new Chart(
    document.getElementById('weeklyPendingChart'),
    {
        type: 'line',
        data: {
            labels: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
            datasets: [{
                label: 'Tugas Tertunda',
                data: Array(7).fill(0),
                borderColor: '#CA8787',
                backgroundColor: 'rgba(202, 135, 135, 0.2)',
                tension: 0.4,
                fill: true
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: {
                y: { beginAtZero: true, grid: { color: 'rgba(0, 0, 0, 0.1)' } },
                x: { grid: { display: false } }
            }
        }
    }
);

logoutBtn.addEventListener("click", () => {
    window.location.href = 'login.html';
});

