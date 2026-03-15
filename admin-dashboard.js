// default password
if (!localStorage.getItem("adminPassword")) {
    localStorage.setItem("adminPassword", "admin123");
}

// Admin data storage (in real app, this would be from a database)
let admins = JSON.parse(localStorage.getItem('admins')) || [];

// Initialize dashboard
document.addEventListener('DOMContentLoaded', function () {
    loadAdmins();
    updateDashboardStats();
});

// Show section
function showSection(sectionId, event) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    document.getElementById(sectionId).classList.add('active');

    if (event) {
        event.target.classList.add('active');
    }
}


// Open Add Admin Modal
function openAddAdminModal() {
    const modal = document.getElementById('addAdminModal');
    modal.classList.add('active');
}

// Close Add Admin Modal
function closeAddAdminModal() {
    const modal = document.getElementById('addAdminModal');
    modal.classList.remove('active');
    document.getElementById('addAdminForm').reset();
}

// Close modal when clicking outside
window.onclick = function (event) {
    const modal = document.getElementById('addAdminModal');
    if (event.target == modal) {
        modal.classList.remove('active');
    }
}

// Add new admin
function addAdmin(event) {
    event.preventDefault();

    const newAdmin = {
        id: Date.now(),
        name: document.getElementById('adminName').value,
        email: document.getElementById('adminEmail').value,
        phone: document.getElementById('adminPhone').value,
        role: document.getElementById('adminRole').value,
        password: document.getElementById('adminPassword').value,
        status: 'Active'
    };

    admins.push(newAdmin);
    localStorage.setItem('admins', JSON.stringify(admins));

    loadAdmins();
    updateDashboardStats();
    closeAddAdminModal();

    alert("Admin added successfully!");
}


// Load and display admins
function loadAdmins() {
    const tableBody = document.getElementById('adminTableBody');
    tableBody.innerHTML = '';

    if (admins.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">No admins added yet</td></tr>';
        return;
    }

    admins.forEach(admin => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${admin.name}</td>
            <td>${admin.email}</td>
            <td>${admin.phone || '-'}</td>
            <td><span class="badge">${admin.role}</span></td>
            <td><span class="status-badge status-active">${admin.status}</span></td>
            <td>
                <button class="btn btn-warning" onclick="editAdmin(${admin.id})">Edit</button>
                <button class="btn btn-danger" onclick="deleteAdmin(${admin.id})">Delete</button>
            </td>
        `;
        tableBody.appendChild(row);
    });
}

// Edit admin (placeholder function)
function editAdmin(id) {

    const admin = admins.find(a => a.id === id);

    if (!admin) return;

    document.getElementById("editAdminId").value = admin.id;
    document.getElementById("editAdminName").value = admin.name;
    document.getElementById("editAdminEmail").value = admin.email;
    document.getElementById("editAdminPhone").value = admin.phone;
    document.getElementById("editAdminRole").value = admin.role;

    document.getElementById("editAdminModal").classList.add("active");
}

function closeEditAdminModal(){
    document.getElementById("editAdminModal").classList.remove("active");
}

function saveAdminEdit(event){

    event.preventDefault();

    const id = Number(document.getElementById("editAdminId").value);

    const admin = admins.find(a => a.id === id);

    admin.name = document.getElementById("editAdminName").value;
    admin.email = document.getElementById("editAdminEmail").value;
    admin.phone = document.getElementById("editAdminPhone").value;
    admin.role = document.getElementById("editAdminRole").value;

    localStorage.setItem("admins", JSON.stringify(admins));

    loadAdmins();

    closeEditAdminModal();

    alert("Admin updated!");
}


// Delete admin
function deleteAdmin(id) {
    if (confirm('Are you sure you want to delete this admin?')) {
        admins = admins.filter(a => a.id !== id);
        localStorage.setItem('admins', JSON.stringify(admins));
        loadAdmins();
        updateDashboardStats();
        alert('Admin deleted successfully!');
    }
}

// Update dashboard statistics
function updateDashboardStats() {
    document.getElementById('totalAdmins').textContent = admins.length;
    document.getElementById('activeSessions').textContent = '0'; // Placeholder
}

// Save settings
function saveSettings() {
    alert('Settings saved successfully!');
}

// Logout
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        // In real app, clear session and redirect to login
        alert('Logged out successfully!');
        window.location.href = 'login.html';
    }
}

function checkAdminPassword() {

    const entered = document.getElementById("adminLoginPassword").value;
    const saved = localStorage.getItem("adminPassword");

    if (entered === saved) {

        document.getElementById("adminLogin").style.display = "none";
        document.getElementById("adminPanel").style.display = "flex";

    } else {

        document.getElementById("loginError").textContent = "Wrong Password";

    }
}

// Change admin password

function changePassword() {

    const newPassword = document.getElementById("newAdminPassword").value;

    if (newPassword.length < 4) {
        alert("Password must be at least 4 characters");
        return;
    }

    localStorage.setItem("adminPassword", newPassword);

    alert("Password changed successfully!");

    document.getElementById("newAdminPassword").value = "";
}
