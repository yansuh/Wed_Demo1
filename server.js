const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ==================== CẤU HÌNH FILE DỮ LIỆU ====================
const ACCOUNTS_FILE = path.join(__dirname, 'taikhoan.txt');
// 🔁 ĐỔI TÊN FILE MÔN HỌC ĐỂ ÉP TẠO MỚI
const SUBJECTS_FILE = path.join(__dirname, 'monhoc_v2.txt');
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
        console.error(`Lỗi đọc ${file}:`, err.message);
        return defaultVal;
    }
}

function writeFileJSON(file, data) {
    try {
        fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error(`Lỗi ghi ${file}:`, err.message);
    }
}

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

// ==================== DỮ LIỆU MẪU MỞ RỘNG (60 môn) ====================
const DEFAULT_ACCOUNTS = [
    { id: 1, username: 'admin', password: 'Admin123@', fullName: 'Quản trị hệ thống', role: 'admin' },
    { id: 2, username: 'phongdaotao', password: '123', fullName: 'Phòng Quản lý Sinh viên', role: 'training' },
    { id: 3, username: 'khoa_cntt', password: '123', fullName: 'Khoa Công nghệ thông tin', role: 'faculty', facultyName: 'Công nghệ thông tin' },
    { id: 4, username: 'khoa_dientu', password: '123', fullName: 'Khoa Điện - Điện tử', role: 'faculty', facultyName: 'Điện - Điện tử' },
    { id: 5, username: 'khoa_kinhte', password: '123', fullName: 'Khoa Kinh tế', role: 'faculty', facultyName: 'Kinh tế' },
    { id: 6, username: 'khoa_ngonngu', password: '123', fullName: 'Khoa Ngôn ngữ', role: 'faculty', facultyName: 'Ngôn ngữ' },
    { id: 7, username: 'giangvien_cntt', password: '123', fullName: 'Nguyễn Văn A', role: 'lecturer', department: 'Công nghệ thông tin' },
    { id: 8, username: 'giangvien_kinhte', password: '123', fullName: 'Trần Thị B', role: 'lecturer', department: 'Kinh tế' },
    { id: 9, username: 'giangvien_dientu', password: '123', fullName: 'Lê Văn C', role: 'lecturer', department: 'Điện - Điện tử' },
    { id: 10, username: 'giangvien_ngonngu', password: '123', fullName: 'Phạm Thị D', role: 'lecturer', department: 'Ngôn ngữ' }
];

const DEFAULT_SUBJECTS = [
    // CNTT
    { id: 1, code: 'CS101', name: 'Nhập môn lập trình', faculty: 'Công nghệ thông tin', credits: 3, lecturer: 'ThS. Nguyễn Văn An', status: 'active' },
    { id: 2, code: 'CS102', name: 'Cấu trúc dữ liệu và giải thuật', faculty: 'Công nghệ thông tin', credits: 4, lecturer: 'TS. Trần Minh Tuấn', status: 'active' },
    { id: 3, code: 'CS201', name: 'Lập trình hướng đối tượng', faculty: 'Công nghệ thông tin', credits: 3, lecturer: 'PGS. Lê Thị Hương', status: 'active' },
    { id: 4, code: 'CS202', name: 'Cơ sở dữ liệu', faculty: 'Công nghệ thông tin', credits: 4, lecturer: 'ThS. Phạm Văn Hùng', status: 'active' },
    { id: 5, code: 'CS301', name: 'Mạng máy tính', faculty: 'Công nghệ thông tin', credits: 3, lecturer: 'TS. Nguyễn Hoàng Nam', status: 'active' },
    { id: 6, code: 'CS302', name: 'Hệ điều hành', faculty: 'Công nghệ thông tin', credits: 3, lecturer: 'ThS. Vũ Thị Lan', status: 'active' },
    { id: 7, code: 'CS401', name: 'Trí tuệ nhân tạo', faculty: 'Công nghệ thông tin', credits: 3, lecturer: 'GS. Trần Đình Long', status: 'active' },
    { id: 8, code: 'CS402', name: 'An toàn bảo mật thông tin', faculty: 'Công nghệ thông tin', credits: 3, lecturer: 'TS. Lê Minh Đức', status: 'active' },
    { id: 9, code: 'CS303', name: 'Phát triển ứng dụng Web', faculty: 'Công nghệ thông tin', credits: 3, lecturer: 'ThS. Nguyễn Thị Web', status: 'active' },
    { id: 10, code: 'CS304', name: 'Phân tích thiết kế hệ thống', faculty: 'Công nghệ thông tin', credits: 3, lecturer: 'TS. Trần Thiết Kế', status: 'active' },
    { id: 11, code: 'CS203', name: 'Kiến trúc máy tính', faculty: 'Công nghệ thông tin', credits: 3, lecturer: 'ThS. Hoàng Vi Xử', status: 'active' },
    { id: 12, code: 'CS204', name: 'Lập trình Python', faculty: 'Công nghệ thông tin', credits: 3, lecturer: 'ThS. Lê Python', status: 'active' },
    // Điện - Điện tử
    { id: 13, code: 'EE101', name: 'Lý thuyết mạch điện', faculty: 'Điện - Điện tử', credits: 3, lecturer: 'PGS. Nguyễn Đức Thắng', status: 'active' },
    { id: 14, code: 'EE102', name: 'Điện tử cơ bản', faculty: 'Điện - Điện tử', credits: 3, lecturer: 'ThS. Phạm Thị Mai', status: 'active' },
    { id: 15, code: 'EE201', name: 'Vi xử lý - Vi điều khiển', faculty: 'Điện - Điện tử', credits: 4, lecturer: 'TS. Trần Quang Huy', status: 'active' },
    { id: 16, code: 'EE202', name: 'Kỹ thuật đo lường', faculty: 'Điện - Điện tử', credits: 3, lecturer: 'ThS. Lê Văn Thành', status: 'active' },
    { id: 17, code: 'EE301', name: 'Hệ thống cung cấp điện', faculty: 'Điện - Điện tử', credits: 3, lecturer: 'TS. Hoàng Minh Tuấn', status: 'active' },
    { id: 18, code: 'EE302', name: 'Truyền động điện', faculty: 'Điện - Điện tử', credits: 3, lecturer: 'ThS. Nguyễn Thị Hoa', status: 'active' },
    { id: 19, code: 'EE203', name: 'Máy điện', faculty: 'Điện - Điện tử', credits: 3, lecturer: 'TS. Vũ Văn Quay', status: 'active' },
    { id: 20, code: 'EE204', name: 'Điện tử công suất', faculty: 'Điện - Điện tử', credits: 3, lecturer: 'ThS. Trần Công Suất', status: 'active' },
    { id: 21, code: 'EE303', name: 'Kỹ thuật số', faculty: 'Điện - Điện tử', credits: 3, lecturer: 'TS. Lê Số Hóa', status: 'active' },
    { id: 22, code: 'EE304', name: 'Bảo trì hệ thống điện', faculty: 'Điện - Điện tử', credits: 2, lecturer: 'ThS. Phạm Bảo Trì', status: 'active' },
    // Kinh tế
    { id: 23, code: 'EC101', name: 'Kinh tế vi mô', faculty: 'Kinh tế', credits: 3, lecturer: 'TS. Phạm Thị Dung', status: 'active' },
    { id: 24, code: 'EC102', name: 'Kinh tế vĩ mô', faculty: 'Kinh tế', credits: 3, lecturer: 'TS. Hoàng Văn Em', status: 'active' },
    { id: 25, code: 'EC201', name: 'Nguyên lý kế toán', faculty: 'Kinh tế', credits: 3, lecturer: 'ThS. Trần Thị Kim', status: 'active' },
    { id: 26, code: 'EC202', name: 'Marketing căn bản', faculty: 'Kinh tế', credits: 3, lecturer: 'PGS. Lê Văn Phúc', status: 'active' },
    { id: 27, code: 'EC301', name: 'Tài chính doanh nghiệp', faculty: 'Kinh tế', credits: 3, lecturer: 'TS. Nguyễn Hữu Thọ', status: 'active' },
    { id: 28, code: 'EC302', name: 'Quản trị học', faculty: 'Kinh tế', credits: 3, lecturer: 'ThS. Phạm Anh Tuấn', status: 'active' },
    { id: 29, code: 'EC401', name: 'Kinh tế quốc tế', faculty: 'Kinh tế', credits: 3, lecturer: 'TS. Lê Thị Hồng', status: 'active' },
    { id: 30, code: 'EC402', name: 'Thương mại điện tử', faculty: 'Kinh tế', credits: 3, lecturer: 'ThS. Trần Minh Hoàng', status: 'active' },
    { id: 31, code: 'EC303', name: 'Luật kinh tế', faculty: 'Kinh tế', credits: 2, lecturer: 'Luật sư Nguyễn Văn Luật', status: 'active' },
    { id: 32, code: 'EC304', name: 'Khởi nghiệp đổi mới sáng tạo', faculty: 'Kinh tế', credits: 3, lecturer: 'TS. Trần Khởi Nghiệp', status: 'active' },
    // Ngôn ngữ
    { id: 33, code: 'FL101', name: 'Tiếng Anh cơ bản 1', faculty: 'Ngôn ngữ', credits: 3, lecturer: 'Cô Sarah Johnson', status: 'active' },
    { id: 34, code: 'FL102', name: 'Tiếng Anh cơ bản 2', faculty: 'Ngôn ngữ', credits: 3, lecturer: 'Thầy David Smith', status: 'active' },
    { id: 35, code: 'FL201', name: 'Tiếng Anh thương mại', faculty: 'Ngôn ngữ', credits: 3, lecturer: 'Cô Emily Davis', status: 'active' },
    { id: 36, code: 'FL202', name: 'Tiếng Trung cơ bản', faculty: 'Ngôn ngữ', credits: 3, lecturer: 'ThS. Lý Minh', status: 'active' },
    { id: 37, code: 'FL301', name: 'Tiếng Hàn cơ bản', faculty: 'Ngôn ngữ', credits: 3, lecturer: 'Cô Park Ji Yeon', status: 'active' },
    { id: 38, code: 'FL302', name: 'Ngữ âm học', faculty: 'Ngôn ngữ', credits: 2, lecturer: 'TS. Nguyễn Thị Lan', status: 'active' },
    { id: 39, code: 'FL203', name: 'Ngữ pháp tiếng Anh nâng cao', faculty: 'Ngôn ngữ', credits: 3, lecturer: 'ThS. Trần Ngữ Pháp', status: 'active' },
    { id: 40, code: 'FL204', name: 'Biên dịch cơ bản', faculty: 'Ngôn ngữ', credits: 2, lecturer: 'ThS. Lê Dịch Thuật', status: 'active' },
    { id: 41, code: 'FL303', name: 'Văn hóa Anh - Mỹ', faculty: 'Ngôn ngữ', credits: 2, lecturer: 'TS. John Văn Hóa', status: 'active' },
    { id: 42, code: 'FL304', name: 'Tiếng Nhật giao tiếp', faculty: 'Ngôn ngữ', credits: 3, lecturer: 'Yamada Yuki', status: 'active' },
    // Môn chung (bản sao cho từng khoa)
    { id: 43, code: 'PE_CNTT', name: 'Giáo dục thể chất', faculty: 'Công nghệ thông tin', credits: 2, lecturer: 'ThS. Nguyễn Văn Khỏe', status: 'active' },
    { id: 44, code: 'PE_DT', name: 'Giáo dục thể chất', faculty: 'Điện - Điện tử', credits: 2, lecturer: 'ThS. Nguyễn Văn Khỏe', status: 'active' },
    { id: 45, code: 'PE_KT', name: 'Giáo dục thể chất', faculty: 'Kinh tế', credits: 2, lecturer: 'ThS. Nguyễn Văn Khỏe', status: 'active' },
    { id: 46, code: 'PE_NN', name: 'Giáo dục thể chất', faculty: 'Ngôn ngữ', credits: 2, lecturer: 'ThS. Nguyễn Văn Khỏe', status: 'active' },
    { id: 47, code: 'QP_CNTT', name: 'Giáo dục quốc phòng an ninh', faculty: 'Công nghệ thông tin', credits: 3, lecturer: 'Đại tá Trần Quốc Bảo', status: 'active' },
    { id: 48, code: 'QP_DT', name: 'Giáo dục quốc phòng an ninh', faculty: 'Điện - Điện tử', credits: 3, lecturer: 'Đại tá Trần Quốc Bảo', status: 'active' },
    { id: 49, code: 'QP_KT', name: 'Giáo dục quốc phòng an ninh', faculty: 'Kinh tế', credits: 3, lecturer: 'Đại tá Trần Quốc Bảo', status: 'active' },
    { id: 50, code: 'QP_NN', name: 'Giáo dục quốc phòng an ninh', faculty: 'Ngôn ngữ', credits: 3, lecturer: 'Đại tá Trần Quốc Bảo', status: 'active' },
    { id: 51, code: 'SKILL_CNTT', name: 'Kỹ năng mềm', faculty: 'Công nghệ thông tin', credits: 2, lecturer: 'ThS. Lê Thị Hạnh', status: 'active' },
    { id: 52, code: 'SKILL_DT', name: 'Kỹ năng mềm', faculty: 'Điện - Điện tử', credits: 2, lecturer: 'ThS. Lê Thị Hạnh', status: 'active' },
    { id: 53, code: 'SKILL_KT', name: 'Kỹ năng mềm', faculty: 'Kinh tế', credits: 2, lecturer: 'ThS. Lê Thị Hạnh', status: 'active' },
    { id: 54, code: 'SKILL_NN', name: 'Kỹ năng mềm', faculty: 'Ngôn ngữ', credits: 2, lecturer: 'ThS. Lê Thị Hạnh', status: 'active' },
    { id: 55, code: 'LAW_CNTT', name: 'Pháp luật đại cương', faculty: 'Công nghệ thông tin', credits: 2, lecturer: 'Luật sư Trần Văn Luật', status: 'active' },
    { id: 56, code: 'LAW_DT', name: 'Pháp luật đại cương', faculty: 'Điện - Điện tử', credits: 2, lecturer: 'Luật sư Trần Văn Luật', status: 'active' },
    { id: 57, code: 'LAW_KT', name: 'Pháp luật đại cương', faculty: 'Kinh tế', credits: 2, lecturer: 'Luật sư Trần Văn Luật', status: 'active' },
    { id: 58, code: 'LAW_NN', name: 'Pháp luật đại cương', faculty: 'Ngôn ngữ', credits: 2, lecturer: 'Luật sư Trần Văn Luật', status: 'active' },
    { id: 59, code: 'MATH_CNTT', name: 'Toán cao cấp A1', faculty: 'Công nghệ thông tin', credits: 3, lecturer: 'TS. Trần Thị Toán', status: 'active' },
    { id: 60, code: 'MATH_DT', name: 'Toán cao cấp A1', faculty: 'Điện - Điện tử', credits: 3, lecturer: 'TS. Trần Thị Toán', status: 'active' },
];

if (accounts.length === 0) { accounts = DEFAULT_ACCOUNTS; saveAccounts(); }
if (subjects.length === 0) { subjects = DEFAULT_SUBJECTS; saveSubjects(); }
if (logs.length === 0) addLog('Khởi tạo hệ thống');

console.log(`📊 Tài khoản: ${accounts.length}, Môn học: ${subjects.length}`);

// ==================== ROUTES TRANG TĨNH ====================
const PUBLIC_PATH = path.join(__dirname, 'public');
app.use(express.static(PUBLIC_PATH, { index: false }));

app.get('/', (req, res) => res.sendFile(path.join(PUBLIC_PATH, 'login.html')));
app.get('/login', (req, res) => res.sendFile(path.join(PUBLIC_PATH, 'login.html')));
app.get('/register', (req, res) => res.sendFile(path.join(PUBLIC_PATH, 'register.html')));
app.get('/dashboard', (req, res) => res.sendFile(path.join(PUBLIC_PATH, 'dashboard.html')));

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

app.get('/api/subjects', (req, res) => res.json(subjects));

app.post('/api/subjects', (req, res) => {
    const newId = subjects.length > 0 ? Math.max(...subjects.map(s => s.id)) + 1 : 1;
    const newSub = { id: newId, ...req.body, status: 'active' };
    subjects.push(newSub);
    saveSubjects();
    addLog(`Thêm môn học: ${newSub.name}`, req.body.username || 'System');
    res.json({ success: true, subject: newSub });
});

app.put('/api/subjects/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = subjects.findIndex(s => s.id === id);
    if (index !== -1) {
        subjects[index] = { ...subjects[index], ...req.body };
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

app.use((req, res) => {
    if (path.extname(req.path)) return res.status(404).send('File not found');
    res.redirect('/');
});

app.listen(PORT, '0.0.0.0', () => console.log(`✅ Server chạy tại port ${PORT}`));