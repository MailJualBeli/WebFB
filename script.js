const canvas = document.getElementById('wheelCanvas');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spinBtn');
const mainModal = document.getElementById('mainModal');
const stepWinner = document.getElementById('stepWinner');
const stepLogin = document.getElementById('stepLogin');
const prizeText = document.getElementById('prizeText');
const prizeImg = document.getElementById('prizeImg');

// Konfigurasi Item
const prizes = [
    { name: "Reaper - M1887", img: "image/Gambar1.png", color: "#1e293b" },
    { name: "HipHop ElitePass", img: "image/Gambar2.png", color: "#6366f1" },
    { name: "Diamond x1000", img: "image/Gambar3.png", color: "#10b981" },
    { name: "Predatory Cobra - MP40", img: "image/Gambar4.png", color: "#f59e0b" },
    { name: "Blue Flame Draco - AK", img: "image/Gambar5.png", color: "#3b82f6" },
    { name: "One Punch Man - M1887", img: "image/Gambar6.png", color: "#ef4444" },
    { name: "Arcade Mayhem ElitePass", img: "image/Gambar7.png", color: "#06b6d4" },
    { name: "Megalodon Alpha - SCAR", img: "image/Gambar8.png", color: "#f97316" }
];

const numItems = prizes.length;
const arcSize = (Math.PI * 2) / numItems;
let currentRotation = 0;
let loadedImagesCount = 0;
let selectedPrize = null;

// Preload Images
prizes.forEach(p => {
    const img = new Image();
    img.src = p.img;
    img.onload = () => {
        loadedImagesCount++;
        if (loadedImagesCount === numItems) drawWheel();
    };
    p.imgElement = img;
});

function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    prizes.forEach((prize, i) => {
        const angle = i * arcSize;
        ctx.beginPath();
        ctx.fillStyle = prize.color;
        ctx.moveTo(400, 400);
        ctx.arc(400, 400, 400, angle, angle + arcSize);
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.1)";
        ctx.stroke();

        ctx.save();
        ctx.translate(400, 400);
        ctx.rotate(angle + arcSize / 2);
        if (prize.imgElement) {
            ctx.drawImage(prize.imgElement, 220, -50, 100, 100);
        }
        ctx.restore();
    });
    // Center circle
    ctx.beginPath(); ctx.fillStyle = "#fff"; ctx.arc(400, 400, 45, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.fillStyle = "#1e293b"; ctx.arc(400, 400, 35, 0, Math.PI * 2); ctx.fill();
}

function spin() {
    spinBtn.disabled = true;
    
    // Memberikan putaran acak (minimal 5 putaran penuh + derajat acak)
    const extraSpins = 5 + Math.floor(Math.random() * 5);
    const randomDeg = Math.floor(Math.random() * 360);
    const totalDeg = (extraSpins * 360) + randomDeg;
    
    currentRotation += totalDeg;
    
    // Animasi putar
    canvas.style.transform = `rotate(${currentRotation}deg)`;

    setTimeout(() => {
        // 1. Dapatkan derajat rotasi sisa (0-359)
        const actualDeg = currentRotation % 360;
        
        // 2. LOGIKA KOREKSI:
        // Pointer ada di atas (270 derajat dari titik 0 canvas).
        // Kita hitung indeks berdasarkan posisi pointer relatif terhadap rotasi canvas.
        const sectorDeg = 360 / numItems;
        const winningIndex = Math.floor(((360 - actualDeg + 270) % 360) / sectorDeg);
        
        selectedPrize = prizes[winningIndex];
        
        // Tampilkan hasil di modal
        prizeText.innerText = selectedPrize.name;
        prizeImg.src = selectedPrize.img;
        
        stepWinner.classList.remove('hidden');
        stepLogin.classList.add('hidden');
        mainModal.style.display = 'flex';
        
        spinBtn.disabled = false;
    }, 5000); // Harus sama dengan durasi transition di CSS (5s)
}

function showLoginStep() {
    stepWinner.classList.add('hidden');
    stepLogin.classList.remove('hidden');
}

function redirectToLogin() {
    window.location.href = `login.html?item=${encodeURIComponent(selectedPrize.name)}`;
}

spinBtn.addEventListener('click', spin);
// Fallback if images fail
setTimeout(() => { if(loadedImagesCount < numItems) drawWheel(); }, 2000);