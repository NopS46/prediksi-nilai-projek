// Database simulasi (dalam implementasi nyata akan menggunakan database server)
let students = [];
let currentFormUrl = '';
let performanceChart;

// Authentication Manager
const authManager = {
    login: function() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Validasi input
        if (!username || !password) {
            alert('Mohon masukkan username dan password!');
            return;
        }
        
        if (username === 'guru' && password === 'admin123') {
            document.getElementById('loginSection').style.display = 'none';
            document.getElementById('dashboard').style.display = 'grid';
            mainDashboard.updateStatistics();
            mainDashboard.initChart();
            this.saveSession();
        } else {
            alert('Username atau password salah!\nUsername: guru\nPassword: admin123');
        }
    },
    
    logout: function() {
        document.getElementById('loginSection').style.display = 'block';
        document.getElementById('dashboard').style.display = 'none';
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
        this.clearSession();
    },
    
    saveSession: function() {
        // Dalam implementasi nyata, gunakan session/token yang aman
        sessionStorage.setItem('isLoggedIn', 'true');
    },
    
    clearSession: function() {
        sessionStorage.removeItem('isLoggedIn');
    },
    
    checkSession: function() {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn');
        if (isLoggedIn === 'true') {
            document.getElementById('loginSection').style.display = 'none';
            document.getElementById('dashboard').style.display = 'grid';
            mainDashboard.updateStatistics();
            mainDashboard.initChart();
        }
    }
};

// Data Manager
const dataManager = {
    exportToCSV: function() {
        if (students.length === 0) {
            alert('Tidak ada data untuk diekspor!');
            return;
        }
        
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Nama,Kompleksitas Proyek,Inovasi Solusi,Kualitas Implementasi,Kemampuan Debugging,Presentasi,Kreativitas (Prediksi),Problem Solving (Prediksi),Timestamp\n";
        
        students.forEach(student => {
            const creativityScore = student.predictions ? student.predictions.creativity : 'Belum diprediksi';
            const problemSolvingScore = student.predictions ? student.predictions.problemSolving : 'Belum diprediksi';
            
            csvContent += `${student.name},${student.features.projectComplexity},${student.features.solutionInnovation},${student.features.implementationQuality},${student.features.debuggingAbility},${student.features.presentationScore},${creativityScore},${problemSolvingScore},${student.timestamp}\n`;
        });
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `prediksi_nilai_siswa_${new Date().getTime()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        alert('Data berhasil diekspor ke file CSV!');
    },
    
    clearAllData: function() {
        if (confirm('PERINGATAN: Semua data siswa akan dihapus permanen. Yakin melanjutkan?')) {
            students = [];
            mainDashboard.updateStudentList();
            mainDashboard.updateStudentSelect();
            mainDashboard.updateStatistics();
            mainDashboard.updateChart();
            document.getElementById('predictionResult').innerHTML = '';
            alert('Semua data berhasil dihapus!');
        }
    },
    
    loadSampleData: function() {
        if (students.length > 0) {
            if (!confirm('Data sample akan menimpa data yang ada. Lanjutkan?')) {
                return;
            }
        }
        
        const sampleStudents = [
            {
                id: Date.now() - 4,
                name: 'Ahmad Rizky Pratama',
                features: { 
                    projectComplexity: 8, 
                    solutionInnovation: 9, 
                    implementationQuality: 7, 
                    debuggingAbility: 8, 
                    presentationScore: 8 
                },
                predictions: null,
                timestamp: new Date().toLocaleString('id-ID'),
                source: 'Manual'
            },
            {
                id: Date.now() - 3,
                name: 'Siti Nurhaliza',
                features: { 
                    projectComplexity: 7, 
                    solutionInnovation: 8, 
                    implementationQuality: 9, 
                    debuggingAbility: 7, 
                    presentationScore: 9 
                },
                predictions: null,
                timestamp: new Date().toLocaleString('id-ID'),
                source: 'Manual'
            },
            {
                id: Date.now() - 2,
                name: 'Budi Santoso',
                features: { 
                    projectComplexity: 6, 
                    solutionInnovation: 7, 
                    implementationQuality: 8, 
                    debuggingAbility: 9, 
                    presentationScore: 7 
                },
                predictions: null,
                timestamp: new Date().toLocaleString('id-ID'),
                source: 'Manual'
            },
            {
                id: Date.now() - 1,
                name: 'Dewi Sartika',
                features: { 
                    projectComplexity: 9, 
                    solutionInnovation: 8, 
                    implementationQuality: 8, 
                    debuggingAbility: 6, 
                    presentationScore: 8 
                },
                predictions: null,
                timestamp: new Date().toLocaleString('id-ID'),
                source: 'Manual'
            }
        ];
        
        students = sampleStudents;
        mainDashboard.updateStudentList();
        mainDashboard.updateStudentSelect();
        mainDashboard.updateStatistics();
        alert('Data sample berhasil dimuat!');
    }
};

// Algoritma Machine Learning Sederhana (Linear Regression)
class SimpleMLModel {
    constructor() {
        // Koefisien yang telah "dilatih" untuk prediksi
        this.creativityWeights = {
            projectComplexity: 0.25,
            solutionInnovation: 0.35,
            implementationQuality: 0.20,
            debuggingAbility: 0.15,
            presentationScore: 0.05
        };
        
        this.problemSolvingWeights = {
            projectComplexity: 0.20,
            solutionInnovation: 0.15,
            implementationQuality: 0.25,
            debuggingAbility: 0.35,
            presentationScore: 0.05
        };
    }
    
    predictCreativity(features) {
        let score = 0;
        for (let feature in this.creativityWeights) {
            score += features[feature] * this.creativityWeights[feature];
        }
        // Normalisasi ke skala 0-100 dengan sedikit randomness untuk variasi
        const baseScore = score * 10;
        const randomFactor = (Math.random() - 0.5) * 10; // ±5 poin
        return Math.min(Math.max(baseScore + randomFactor, 0), 100);
    }
    
    predictProblemSolving(features) {
        let score = 0;
        for (let feature in this.problemSolvingWeights) {
            score += features[feature] * this.problemSolvingWeights[feature];
        }
        // Normalisasi ke skala 0-100 dengan sedikit randomness untuk variasi
        const baseScore = score * 10;
        const randomFactor = (Math.random() - 0.5) * 10; // ±5 poin
        return Math.min(Math.max(baseScore + randomFactor, 0), 100);
    }
}

const mlModel = new SimpleMLModel();

// Main Dashboard Controller
const mainDashboard = {
    updateStatistics: function() {
        document.getElementById('totalStudents').textContent = students.length;
        
        const predictedStudents = students.filter(s => s.predictions);
        
        if (predictedStudents.length > 0) {
            const avgCreativity = predictedStudents.reduce((sum, s) => sum + s.predictions.creativity, 0) / predictedStudents.length;
            const avgProblemSolving = predictedStudents.reduce((sum, s) => sum + s.predictions.problemSolving, 0) / predictedStudents.length;
            
            document.getElementById('avgCreativity').textContent = Math.round(avgCreativity);
            document.getElementById('avgProblemSolving').textContent = Math.round(avgProblemSolving);
        } else {
            document.getElementById('avgCreativity').textContent = '0';
            document.getElementById('avgProblemSolving').textContent = '0';
        }
        
        document.getElementById('completedProjects').textContent = students.length;
    },
    
    initChart: function() {
        const ctx = document.getElementById('performanceChart').getContext('2d');
        
        if (performanceChart) {
            performanceChart.destroy();
        }
        
        performanceChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Kreativitas', 'Pemecahan Masalah'],
                datasets: [{
                    label: 'Rata-rata Nilai',
                    data: [0, 0],
                    backgroundColor: [
                        'rgba(102, 126, 234, 0.6)',
                        'rgba(118, 75, 162, 0.6)'
                    ],
                    borderColor: [
                        'rgba(102, 126, 234, 1)',
                        'rgba(118, 75, 162, 1)'
                    ],
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Performa Rata-rata Kelas'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            callback: function(value) {
                                return value + '%';
                            }
                        }
                    }
                }
            }
        });
    },
    
    updateChart: function() {
        if (!performanceChart) return;
        
        const predictedStudents = students.filter(s => s.predictions);
        
        if (predictedStudents.length > 0) {
            const avgCreativity = predictedStudents.reduce((sum, s) => sum + s.predictions.creativity, 0) / predictedStudents.length;
            const avgProblemSolving = predictedStudents.reduce((sum, s) => sum + s.predictions.problemSolving, 0) / predictedStudents.length;
            
            performanceChart.data.datasets[0].data = [Math.round(avgCreativity), Math.round(avgProblemSolving)];
        } else {
            performanceChart.data.datasets[0].data = [0, 0];
        }
        
        performanceChart.update();
    },
    
    updateStudentList: function() {
        const listDiv = document.getElementById('studentList');
        
        if (students.length === 0) {
            listDiv.innerHTML = '<div style="padding: 20px; text-align: center; color: #666;">Belum ada data siswa. Tambahkan data melalui form di atas atau melalui Google Form.</div>';
            return;
        }
        
        let html = '';
        students.forEach((student, index) => {
            const predictionText = student.predictions 
                ? `Kreativitas: ${student.predictions.creativity}/100, Problem Solving: ${student.predictions.problemSolving}/100`
                : 'Belum diprediksi';
                
            const avgScore = student.predictions 
                ? Math.round((student.predictions.creativity + student.predictions.problemSolving) / 2)
                : 'N/A';
                
            html += `
                <div class="student-item">
                    <div>
                        <strong>${student.name}</strong><br>
                        <small>Ditambahkan: ${student.timestamp}</small><br>
                        <small>Prediksi: ${predictionText}</small><br>
                        <small><strong>Nilai Rata-rata: ${avgScore}${avgScore !== 'N/A' ? '/100' : ''}</strong></small>
                    </div>
                    <button class="btn" onclick="removeStudent(${student.id})" title="Hapus siswa">🗑️</button>
                </div>
            `;
        });
        
        listDiv.innerHTML = html;
    },
    
    updateStudentSelect: function() {
        const select = document.getElementById('studentSelect');
        select.innerHTML = '<option value="">Pilih siswa...</option>';
        
        students.forEach(student => {
            select.innerHTML += `<option value="${student.id}">${student.name}</option>`;
        });
    }
};

// Student Management Functions
function addStudent() {
    const name = document.getElementById('studentName').value.trim();
    const projectComplexity = parseInt(document.getElementById('projectComplexity').value);
    const solutionInnovation = parseInt(document.getElementById('solutionInnovation').value);
    const implementationQuality = parseInt(document.getElementById('implementationQuality').value);
    const debuggingAbility = parseInt(document.getElementById('debuggingAbility').value);
    const presentationScore = parseInt(document.getElementById('presentationScore').value);
    
    // Validasi input
    if (!name) {
        alert('Mohon masukkan nama siswa!');
        return;
    }
    
    if (!projectComplexity || !solutionInnovation || !implementationQuality || !debuggingAbility || !presentationScore) {
        alert('Mohon lengkapi semua field dengan nilai 1-10!');
        return;
    }
    
    // Cek duplikasi nama
    if (students.some(s => s.name.toLowerCase() === name.toLowerCase())) {
        alert('Siswa dengan nama tersebut sudah ada!');
        return;
    }
    
    const student = {
        id: Date.now(),
        name: name,
        features: {
            projectComplexity,
            solutionInnovation,
            implementationQuality,
            debuggingAbility,
            presentationScore
        },
        predictions: null,
        timestamp: new Date().toLocaleString('id-ID'),
        source: 'Manual'
    };
    
    students.push(student);
    
    // Reset form
    document.getElementById('studentForm').reset();
    
    // Update UI
    mainDashboard.updateStudentList();
    mainDashboard.updateStudentSelect();
    mainDashboard.updateStatistics();
    
    alert(`Siswa ${name} berhasil ditambahkan!`);
}

function removeStudent(id) {
    const student = students.find(s => s.id == id);
    if (!student) return;
    
    if (confirm(`Yakin ingin menghapus data siswa "${student.name}"?`)) {
        students = students.filter(s => s.id !== id);
        mainDashboard.updateStudentList();
        mainDashboard.updateStudentSelect();
        mainDashboard.updateStatistics();
        mainDashboard.updateChart();
        
        // Clear prediction result if it was for the deleted student
        document.getElementById('predictionResult').innerHTML = '';
    }
}

// Prediction Functions
function predictScore() {
    const selectedId = document.getElementById('studentSelect').value;
    if (!selectedId) {
        alert('Pilih siswa terlebih dahulu!');
        return;
    }
    
    const student = students.find(s => s.id == selectedId);
    if (!student) {
        alert('Siswa tidak ditemukan!');
        return;
    }
    
    const creativityScore = mlModel.predictCreativity(student.features);
    const problemSolvingScore = mlModel.predictProblemSolving(student.features);
    
    student.predictions = {
        creativity: Math.round(creativityScore),
        problemSolving: Math.round(problemSolvingScore)
    };
    
    const avgScore = Math.round((student.predictions.creativity + student.predictions.problemSolving) / 2);
    
    const resultDiv = document.getElementById('predictionResult');
    resultDiv.innerHTML = `
        <div class="prediction-result">
            <h4>🎯 Hasil Prediksi untuk ${student.name}</h4>
            <p>🎨 <strong>Kreativitas:</strong> ${student.predictions.creativity}/100</p>
            <p>🧩 <strong>Pemecahan Masalah:</strong> ${student.predictions.problemSolving}/100</p>
            <p>📊 <strong>Nilai Rata-rata:</strong> ${avgScore}/100</p>
            <p style="margin-top: 15px; font-size: 0.9em; color: #666;">
                Prediksi berdasarkan analisis ML dari input: Kompleksitas (${student.features.projectComplexity}), 
                Inovasi (${student.features.solutionInnovation}), Implementasi (${student.features.implementationQuality}), 
                Debugging (${student.features.debuggingAbility}), Presentasi (${student.features.presentationScore})
            </p>
        </div>
    `;
    
    mainDashboard.updateStudentList();
    mainDashboard.updateStatistics();
    mainDashboard.updateChart();
}

function predictAllScores() {
    if (students.length === 0) {
        alert('Belum ada data siswa!');
        return;
    }
    
    let predictedCount = 0;
    students.forEach(student => {
        if (!student.predictions) {
            const creativityScore = mlModel.predictCreativity(student.features);
            const problemSolvingScore = mlModel.predictProblemSolving(student.features);
            
            student.predictions = {
                creativity: Math.round(creativityScore),
                problemSolving: Math.round(problemSolvingScore)
            };
            predictedCount++;
        }
    });
    
    mainDashboard.updateStudentList();
    mainDashboard.updateStatistics();
    mainDashboard.updateChart();
    
    if (predictedCount > 0) {
        alert(`Prediksi untuk ${predictedCount} siswa berhasil digenerate!`);
    } else {
        alert('Semua siswa sudah memiliki prediksi nilai!');
    }
}

// Google Form Management
function updateFormLink() {
    const url = document.getElementById('formUrl').value.trim();
    if (!url) {
        alert('Mohon masukkan URL Google Form!');
        return;
    }
    
    if (!url.includes('forms.google.com') && !url.includes('docs.google.com/forms')) {
        alert('Mohon masukkan link Google Form yang valid!');
        return;
    }
    
    currentFormUrl = url;
    document.getElementById('googleFormLink').href = url;
    document.getElementById('googleFormLink').target = '_blank';
    alert('Link Google Form berhasil diupdate!');
    document.getElementById('formUrl').value = '';
}

function simulateFormResponse() {
    const sampleNames = ['Ahmad Rizki', 'Siti Nurhaliza', 'Budi Santoso', 'Dewi Sartika', 'Andi Wijaya', 'Maya Indah', 'Rony Prakoso', 'Indira Sari'];
    const availableNames = sampleNames.filter(name => !students.some(s => s.name === name));
    
    if (availableNames.length === 0) {
        alert('Semua nama sample sudah digunakan!');
        return;
    }
    
    const randomName = availableNames[Math.floor(Math.random() * availableNames.length)];
    
    const student = {
        id: Date.now(),
        name: randomName,
        features: {
            projectComplexity: Math.floor(Math.random() * 6) + 5, // 5-10 untuk data yang lebih realistis
            solutionInnovation: Math.floor(Math.random() * 6) + 5,
            implementationQuality: Math.floor(Math.random() * 6) + 5,
            debuggingAbility: Math.floor(Math.random() * 6) + 5,
            presentationScore: Math.floor(Math.random() * 6) + 5
        },
        predictions: null,
        timestamp: new Date().toLocaleString('id-ID'),
        source: 'Google Form (Simulasi)'
    };
    
    students.push(student);
    
    mainDashboard.updateStudentList();
    mainDashboard.updateStudentSelect();
    mainDashboard.updateStatistics();
    
    alert(`Data simulasi dari Google Form berhasil ditambahkan!\nSiswa: ${randomName}`);
}

// Event Listeners dan Initialization
document.addEventListener('DOMContentLoaded', function() {
    // Check if user was previously logged in
    authManager.checkSession();
    
    // Load sample data for demo purposes
    if (students.length === 0) {
        dataManager.loadSampleData();
    }

    loadFormData();
    
    // Add enter key listener for login
    document.getElementById('password').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            authManager.login();
        }
    });
    
    // Add form validation
    const numberInputs = document.querySelectorAll('input[type="number"]');
    numberInputs.forEach(input => {
        input.addEventListener('input', function() {
            const value = parseInt(this.value);
            if (value < 1) this.value = 1;
            if (value > 10) this.value = 10;
        });
    });
});

// Utility Functions
function validateNumberInput(value, min = 1, max = 10) {
    const num = parseInt(value);
    return !isNaN(num) && num >= min && num <= max;
}

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    alert('Terjadi kesalahan dalam aplikasi. Silakan refresh halaman.');
});

// Prevent form submission on enter key (except login)
document.addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && e.target.tagName === 'INPUT' && e.target.type !== 'password') {
        e.preventDefault();
    }
});

function loadFormData() {
    const storedData = JSON.parse(localStorage.getItem('studentData')) || [];
    if (storedData.length > 0) {
        storedData.forEach(student => {
            // Cek duplikasi agar tidak double masuk
            if (!students.some(s => s.name === student.name)) {
                students.push(student);
            }
        });
        localStorage.removeItem('studentData');
        mainDashboard.updateStudentList();
        mainDashboard.updateStudentSelect();
        mainDashboard.updateStatistics();
        mainDashboard.updateChart();
        alert(`✅ ${storedData.length} data dari form berhasil dimuat ke dashboard!`);
    }
}
