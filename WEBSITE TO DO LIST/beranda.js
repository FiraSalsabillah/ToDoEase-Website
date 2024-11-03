// Mendapatkan elemen logoutBtn
const logoutBtn = document.getElementById("logoutBtn");

// Menambahkan event listener untuk tombol logout
logoutBtn.addEventListener("click", (event) => {
    // Mencegah link default
    event.preventDefault();
    // Mengalihkan ke halaman login
    window.location.href = 'login.html';
});
