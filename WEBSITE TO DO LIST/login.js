function handleSubmit(event) {
    event.preventDefault(); // Mencegah pengiriman form default

    // Simulasi proses login (ini bisa diganti dengan validasi login nyata)
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Misal: jika email dan password benar, arahkan ke beranda
    if (email && password) {
        // Arahkan ke halaman beranda
        window.location.href = 'beranda.html'; // Ganti dengan nama file beranda yang sesuai
    } else {
        alert('Masukkan email dan password yang valid.');
    }
}
