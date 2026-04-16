const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ==================== ĐỌC/GHI FILE AN TOÀN ====================
const ACCOUNTS_FILE = path.join(__dirname, 'taikhoan.txt');
const SUBJECTS_FILE = path.join(__dirname, 'monhoc.txt');
const LOGS_FILE = path.join(__dirname, 'logs.txt');
const REQUESTS_FILE = path.join(__dirname, 'requests.txt');

function readFileJSON(file, defaultVal) {
    try {
        if (!fs.existsSync(file)) {
            writeFileJSON(file, defaultVal);
            return defaultVal;
        }
        const data = fs.readFileSync(file, 'utf8');
        if (!data || data.trim() === '') {
            writeFileJSON(file, defaultVal);
            return defaultVal;
        }
        return JSON.parse(data);
    } catch (err) {
        console.error(`Lỗi đọc file ${file}:`, err.message);
        return defaultVal;
    }
}

function writeFileJSON(file, data) {
    try {
        fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error(`Lỗi ghi file ${file}:`, err.message);
    }
}

// ==================== KHỞI TẠO DỮ LIỆU ====================
let accounts = readFileJSON(ACCOUNTS_FILE, []);
let subjects = readFileJSON(SUBJECTS_FILE, []);
let logs = readFileJSON(LOGS_FILE, []);
let requests = readFileJSON(REQUESTS_FILE, []);

function saveAccounts() { writeFileJSON(ACCOUNTS_FILE, accounts); }
function saveSubjects() { writeFileJSON(SUBJECTS_FILE, subjects); }
function saveLogs() { writeFileJSON(LOGS_FILE, logs); }
function saveRequests() { writeFileJSON(REQUESTS_FILE, requests); }

function addLog(action, username = 'System') {
    const timestamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
    logs.unshift({ id: Date.now(), timestamp, action, user: username });
    if (logs.length > 100) logs = logs.slice(0, 100);
    saveLogs();
}

// 1. Dữ liệu Tài khoản chuẩn (Đã có Nguyễn Quý Thành, Trần Văn Tiến...)
if (accounts.length === 0) {
    accounts = [
        { id: 1, username: 'admin', password: 'Admin123@', fullName: 'Quản trị hệ thống', role: 'admin' },
        { id: 2, username: 'phongdaotao', password: '123456Ak@', fullName: 'Phòng Quản lý Sinh viên', role: 'training' },
        { id: 3, username: 'khoa_cntt', password: '123456Ak@', fullName: 'Khoa Công nghệ thông tin', role: 'faculty', facultyName: 'Công nghệ thông tin' },
        { id: 4, username: 'khoa_dientu', password: '123456Ak@', fullName: 'Khoa Điện - Điện tử', role: 'faculty', facultyName: 'Điện - Điện tử' },
        { id: 5, username: 'khoa_kinhte', password: '123456Ak@', fullName: 'Khoa Kinh tế', role: 'faculty', facultyName: 'Kinh tế' },
        { id: 6, username: 'khoa_ngonngu', password: '123456Ak@', fullName: 'Khoa Ngôn ngữ', role: 'faculty', facultyName: 'Ngôn ngữ' },
        { id: 7, username: 'TranVanTien', password: '123456Ak@', fullName: 'Trần Văn Tiến', role: 'lecturer', department: 'Công nghệ thông tin' },
        { id: 8, username: 'NguyenQuyThanh', password: '123456Ak@', fullName: 'Nguyễn Quý Thành', role: 'lecturer', department: 'Điện - Điện tử' },
        { id: 9, username: 'NguyenVietTruong', password: '123456Ak@', fullName: 'Nguyễn Việt Trường', role: 'lecturer', department: 'Ngôn ngữ' }
    ];
    saveAccounts();
}

// 2. Dữ liệu Môn học chuẩn (15 môn, Khoa là mảng [])
if (subjects.length === 0) {
    subjects = [
        { id: 1, code: 'CS101', name: 'Lập trình Web nâng cao', faculty: ['Công nghệ thông tin'], credits: 3, lecturer: 'TS. Nguyễn Văn A', status: 'active' },
        { id: 2, code: 'EE201', name: 'Mạch điện tử', faculty: ['Điện - Điện tử'], credits: 4, lecturer: 'ThS. Trần Văn B', status: 'active' },
        { id: 3, code: 'EC101', name: 'Kinh tế vi mô', faculty: ['Kinh tế'], credits: 3, lecturer: 'PGS. Lê Thị C', status: 'active' },
        { id: 4, code: 'FL101', name: 'Tiếng Anh chuyên ngành', faculty: ['Ngôn ngữ'], credits: 5, lecturer: 'Sarah Johnson', status: 'active' },
        { id: 5, code: 'CS102', name: 'Phân tích thiết kế hệ thống', faculty: ['Công nghệ thông tin'], credits: 2, lecturer: 'TS. Nguyễn Văn A', status: 'active' },
        { id: 6, code: 'EE107', name: 'Bảo trì hệ thống điện', faculty: ['Điện - Điện tử'], credits: 3, lecturer: 'Nguyễn Văn C', status: 'active' },
        { id: 7, code: 'DE100', name: 'Giáo dục thể chất', faculty: ['Điện - Điện tử', 'Công nghệ thông tin', 'Ngôn ngữ', 'Kinh tế'], credits: 3, lecturer: 'Nguyễn Văn C', status: 'active' },
        { id: 8, code: 'MATH101', name: 'Toán cao cấp A1', faculty: ['Công nghệ thông tin', 'Điện - Điện tử'], credits: 3, lecturer: 'TS. Trần Thị Toán', status: 'active' },
        { id: 9, code: 'CS201', name: 'Cơ sở dữ liệu', faculty: ['Công nghệ thông tin'], credits: 3, lecturer: 'ThS. Lê Cơ Sở', status: 'active' },
        { id: 10, code: 'EC102', name: 'Kinh tế vĩ mô', faculty: ['Kinh tế'], credits: 3, lecturer: 'TS. Phạm Kinh Tế', status: 'active' },
        { id: 11, code: 'FL202', name: 'Tiếng Nhật giao tiếp 1', faculty: ['Ngôn ngữ'], credits: 4, lecturer: 'Yamada Yuki', status: 'active' },
        { id: 12, code: 'EE305', name: 'Vi điều khiển và Ứng dụng', faculty: ['Điện - Điện tử'], credits: 3, lecturer: 'ThS. Hoàng Vi Mạch', status: 'active' },
        { id: 13, code: 'SKILL101', name: 'Kỹ năng giao tiếp', faculty: ['Kinh tế', 'Ngôn ngữ', 'Công nghệ thông tin'], credits: 2, lecturer: 'ThS. Nguyễn Kỹ Năng', status: 'active' },
        { id: 14, code: 'CS302', name: 'Trí tuệ nhân tạo', faculty: ['Công nghệ thông tin'], credits: 3, lecturer: 'PGS. Robot Nguyễn', status: 'active' },
        { id: 15, code: 'LAW101', name: 'Pháp luật đại cương', faculty: ['Điện - Điện tử', 'Công nghệ thông tin', 'Ngôn ngữ', 'Kinh tế'], credits: 2, lecturer: 'Luật sư Trần Văn Luật', status: 'active' }
    ];
    saveSubjects();
}

if (logs.length === 0) addLog('Khởi tạo hệ thống');

// ==================== ROUTES TRANG TĨNH (ĐÃ SỬA LỖI ĐƯỜNG DẪN PUBLIC) ====================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.use(express.static(path.join(__dirname, 'public'), {
    index: false,
    setHeaders: (res, filepath) => {
        if (filepath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        } else if (filepath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));

// ==================== API ENDPOINTS ====================
app.get('/health', (req, res) => res.json({ status: 'OK' }));

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = accounts.find(acc => acc.username === username && acc.password === password);
    if (user) {
        const { password, ...safeUser } = user;
        addLog(`Đăng nhập: ${username}`, username);
        res.json({ success: true, user: safeUser });
    } else {
        res.status(401).json({ success: false, message: 'Sai tên đăng nhập hoặc mật khẩu' });
    }
});

app.post('/api/register', (req, res) => {
    const { username, password, fullName, role, facultyName, department, lecturerCode, birthDate } = req.body;
    if (accounts.find(acc => acc.username === username)) {
        return res.status(400).json({ success: false, message: 'Tên đăng nhập đã tồn tại' });
    }
    const newId = accounts.length > 0 ? Math.max(...accounts.map(a => a.id)) + 1 : 1;
    const newUser = { id: newId, username, password, fullName, role };
    if (role === 'faculty') newUser.facultyName = facultyName;
    if (role === 'lecturer') {
        newUser.department = department;
        if (lecturerCode) newUser.lecturerCode = lecturerCode;
        if (birthDate) newUser.birthDate = birthDate;
    }
    accounts.push(newUser);
    saveAccounts();
    addLog(`Đăng ký tài khoản mới: ${username} (${role})`, username);
    res.json({ success: true });
});

// --- Quản lý Môn học ---
app.get('/api/subjects', (req, res) => res.json(subjects));

app.post('/api/subjects', (req, res) => {
    const newId = subjects.length > 0 ? Math.max(...subjects.map(s => s.id)) + 1 : 1;
    const newSub = { id: newId, ...req.body, status: 'active' };
    
    // Tự động bọc faculty thành mảng nếu bị gửi lên dạng chuỗi
    if (typeof newSub.faculty === 'string') {
        newSub.faculty = [newSub.faculty];
    }

    subjects.push(newSub);
    saveSubjects();
    addLog(`Thêm môn học: ${newSub.name}`, req.body.username || 'System');
    res.json({ success: true, subject: newSub });
});

app.put('/api/subjects/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = subjects.findIndex(s => s.id === id);
    if (index !== -1) {
        const updatedData = { ...req.body };
        if (typeof updatedData.faculty === 'string') {
            updatedData.faculty = [updatedData.faculty];
        }

        subjects[index] = { ...subjects[index], ...updatedData };
        saveSubjects();
        addLog(`Cập nhật môn học: ${subjects[index].name}`, req.body.username || 'System');
        res.json({ success: true });
    } else {
        res.status(404).json({ success: false, message: 'Không tìm thấy môn học' });
    }
});

app.delete('/api/subjects/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const sub = subjects.find(s => s.id === id);
    subjects = subjects.filter(s => s.id !== id);
    saveSubjects();
    addLog(`Xóa môn học: ${sub?.name}`, req.body.username || 'System');
    res.json({ success: true });
});

// --- Quản lý Tài khoản ---
app.get('/api/users', (req, res) => {
    const safeUsers = accounts.map(({ id, username, fullName, role, facultyName, department }) =>
        ({ id, username, fullName, role, facultyName, department }));
    res.json(safeUsers);
});

app.post('/api/users', (req, res) => {
    const { username, password, fullName, role, facultyName, department } = req.body;
    if (accounts.find(acc => acc.username === username)) {
        return res.status(400).json({ success: false, message: 'Username đã tồn tại' });
    }
    const newId = accounts.length > 0 ? Math.max(...accounts.map(a => a.id)) + 1 : 1;
    const newUser = { id: newId, username, password: password || '123', fullName, role };
    if (role === 'faculty') newUser.facultyName = facultyName;
    if (role === 'lecturer') newUser.department = department;
    accounts.push(newUser);
    saveAccounts();
    addLog(`Thêm tài khoản: ${username} (${role})`, req.body.adminUser || 'Admin');
    res.json({ success: true });
});

app.put('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = accounts.findIndex(u => u.id === id);
    if (index !== -1) {
        accounts[index] = { ...accounts[index], ...req.body };
        saveAccounts();
        addLog(`Cập nhật tài khoản: ${accounts[index].username}`, req.body.adminUser || 'Admin');
        res.json({ success: true });
    } else {
        res.status(404).json({ success: false, message: 'Không tìm thấy user' });
    }
});

app.delete('/api/users/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = accounts.find(u => u.id === id);
    accounts = accounts.filter(u => u.id !== id);
    saveAccounts();
    addLog(`Xóa tài khoản: ${user?.username}`, req.body.adminUser || 'Admin');
    res.json({ success: true });
});

// --- Quản lý Logs & Requests ---
app.get('/api/logs', (req, res) => res.json(logs.slice(0, 50)));
app.get('/api/requests', (req, res) => res.json(requests));

app.post('/api/requests', (req, res) => {
    const newId = requests.length > 0 ? Math.max(...requests.map(r => r.id)) + 1 : 1;
    const newReq = { id: newId, ...req.body, status: 'pending', createdAt: new Date().toISOString() };
    requests.push(newReq);
    saveRequests();
    addLog(`Gửi yêu cầu cập nhật môn ID ${req.body.subjectId}`, req.body.requestedBy);
    res.json({ success: true });
});

app.put('/api/requests/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = requests.findIndex(r => r.id === id);
    if (index !== -1) {
        requests[index] = { ...requests[index], ...req.body };
        saveRequests();
        addLog(`Xử lý yêu cầu ID ${id}: ${req.body.status}`, req.body.adminUser || 'Admin');
        res.json({ success: true });
    } else {
        res.status(404).json({ success: false, message: 'Không tìm thấy request' });
    }
});

app.get('*', (req, res) => {
    if (req.path.includes('.')) {
        return res.status(404).send('File not found');
    }
    res.redirect('/');
});


app.listen(PORT, '0.0.0.0', () => {
    console.log(` Server đang chạy tại port ${PORT}`);
    console.log(` Tài khoản: ${accounts.length}, Môn học: ${subjects.length}`);
});