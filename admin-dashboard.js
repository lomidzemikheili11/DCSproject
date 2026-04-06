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

//filters

function filterAdmins() {
    const nameFilter = document.getElementById('adminSearchInput').value.toLowerCase();
    const roleFilter = document.getElementById('adminRoleFilter').value;

    const tableBody = document.getElementById('adminTableBody');
    tableBody.innerHTML = '';

    const filteredAdmins = admins.filter(admin => {
        const matchesName = admin.name.toLowerCase().includes(nameFilter);
        const matchesRole = roleFilter === '' || admin.role === roleFilter;
        return matchesName && matchesRole;
    });

    if (filteredAdmins.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: 20px;">No admins found</td></tr>';
        return;
    }

    filteredAdmins.forEach(admin => {
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


// plane-cards
const API_URL = "https://69cd2b0dddc3cabb7bd23b56.mockapi.io/plane-cards";

// 2. ცხრილის შევსება (თვითმფრინავების სია)
async function fetchAdminPlanes() {
    try {
        const res = await fetch(API_URL);
        const planes = await res.json();
        const tableBody = document.getElementById('apiPlanesTable');
        
        if (!tableBody) return;

        tableBody.innerHTML = planes.map(plane => `
            <tr>
                <td><img src="${plane.image}" width="60" style="border-radius:4px; border: 1px solid #ddd;"></td>
                <td style="color: #333; font-weight: bold;">${plane.name}</td>
                <td style="color: #555;">${plane.type}</td>
                <td>
                    <button class="btn btn-warning" onclick="editPlane('${plane.id}')">Edit</button>
                    <button class="btn btn-danger" onclick="deletePlane('${plane.id}')">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error("მონაცემების წამოღება ვერ მოხერხდა:", error);
    }
}

// 3. მოდალის გახსნა (ახალი თვითმფრინავისთვის)
function openPlaneModal() {
    const modal = document.getElementById('planeModal');
    const saveBtn = document.querySelector('.btn-save');
    
    // ფორმის გასუფთავება
    document.getElementById('pName').value = "";
    document.getElementById('pImage').value = "";
    document.getElementById('pType').value = "Fighter";
    document.getElementById('pDesc').value = "";

    // ღილაკის დაბრუნება საწყის მდგომარეობაზე
    saveBtn.innerText = "Save Aircraft";
    saveBtn.onclick = savePlane;

    modal.style.display = 'flex';
}

// 4. მოდალის დახურვა
function closePlaneModal() {
    document.getElementById('planeModal').style.display = 'none';
}

// 5. ახალი თვითმფრინავის შენახვა (POST)
async function savePlane() {
    const data = {
        name: document.getElementById('pName').value,
        image: document.getElementById('pImage').value,
        type: document.getElementById('pType').value,
        description: document.getElementById('pDesc').value
    };

    if (!data.name || !data.image) {
        alert("Please fill in Name and Image URL!");
        return;
    }

    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });

    if (res.ok) {
        alert("Aircraft added!");
        closePlaneModal();
        fetchAdminPlanes();
    }
}

// 6. რედაქტირება (ინფორმაციის ამოღება და ჩასმა ფორმაში)
async function editPlane(id) {
    try {
        const res = await fetch(`${API_URL}/${id}`);
        const plane = await res.json();

        // ინპუტების შევსება
        document.getElementById('pName').value = plane.name;
        document.getElementById('pImage').value = plane.image;
        document.getElementById('pType').value = plane.type;
        document.getElementById('pDesc').value = plane.description;

        // ღილაკის გადაკეთება "Update"-ზე
        const saveBtn = document.querySelector('.btn-save');
        saveBtn.innerText = "Update Aircraft";
        saveBtn.onclick = () => updatePlane(id);

        document.getElementById('planeModal').style.display = 'flex';
    } catch (error) {
        alert("Error loading aircraft data!");
    }
}

// 7. განახლება (PUT)
async function updatePlane(id) {
    const updatedData = {
        name: document.getElementById('pName').value,
        image: document.getElementById('pImage').value,
        type: document.getElementById('pType').value,
        description: document.getElementById('pDesc').value
    };

    const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
    });

    if (res.ok) {
        alert("Aircraft updated!");
        closePlaneModal();
        fetchAdminPlanes();
    }
}

// 8. წაშლა (DELETE)
async function deletePlane(id) {
    if (confirm("Are you sure you want to delete this aircraft?")) {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        fetchAdminPlanes();
    }
}

// 9. საწყისი ჩატვირთვა
document.addEventListener('DOMContentLoaded', fetchAdminPlanes);

// 10. ფანჯრის გარეთ კლიკზე დახურვა
window.onclick = function(event) {
    const modal = document.getElementById('planeModal');
    if (event.target == modal) {
        closePlaneModal();
    }
}