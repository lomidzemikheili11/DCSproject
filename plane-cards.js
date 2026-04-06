const API_URL = "https://69cd2b0dddc3cabb7bd23b56.mockapi.io/plane-cards";
let allPlanesData = [];

async function loadPlanes() {
    try {
        const res = await fetch(API_URL);
        allPlanesData = await res.json();
        renderPlanes(allPlanesData);
    } catch (error) {
        console.error("API Error:", error);
    }
}

function renderPlanes(planes) {
    const container = document.getElementById('planes-container');
    if (!container) return;

    const rawFavs = localStorage.getItem('favorites');
    const favorites = rawFavs ? JSON.parse(rawFavs).map(String) : [];

    if (planes.length === 0) {
        container.innerHTML = "<h2 style='color:white; text-align:center; grid-column:1/-1;'>No planes found</h2>";
        return;
    }

    container.innerHTML = planes.map(plane => {
        const isFavorite = favorites.includes(String(plane.id));
        return `
            <div class="plane-card" onclick="flipCard(this)">
                <div class="card-inner">
                    <div class="card-front">
                        <div class="heart-icon ${isFavorite ? 'active' : ''}" 
                             onclick="toggleFavorite(event, '${plane.id}')"
                             style="color: ${isFavorite ? '#ff4757' : 'rgba(255,255,255,0.7)'};">
                            ❤
                        </div>
                        <img src="${plane.image}" class="plane-img">
                        <div class="plane-name-overlay">${plane.name}</div>
                    </div>
                    <div class="card-back">
                        <h3>${plane.name}</h3>
                        <p class="type-badge" style="color:#ff9d00; margin-bottom:10px;">${plane.type}</p>
                        <p style="font-size: 13px;">${plane.description || 'No description available'}</p>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function filterPlanes() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const selectedType = document.getElementById('typeFilter').value;

    const filtered = allPlanesData.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm);
        const matchesType = (selectedType === 'all' || p.type === selectedType);
        return matchesSearch && matchesType;
    });

    renderPlanes(filtered);
}

function flipCard(el) {
    if (event.target.classList.contains('heart-icon')) return;
    el.classList.toggle('is-flipped');
}

function toggleFavorite(event, id) {
    event.stopPropagation();
    
    let favs = JSON.parse(localStorage.getItem('favorites')) || [];
    const planeId = String(id);
    const icon = event.currentTarget;

    const token = localStorage.getItem("token");
    if (!token) {
        alert("გთხოვთ გაიაროთ ავტორიზაცია !");
        window.location.href = "login.html"; 
        return;
    }

    if (favs.includes(planeId)) {
        favs = favs.filter(i => i !== planeId);
        icon.style.color = 'rgba(255,255,255,0.7)';
        icon.classList.remove('active');
    } else {
        favs.push(planeId);
        icon.style.color = '#ff4757';
        icon.classList.add('active');
    }

    localStorage.setItem('favorites', JSON.stringify(favs));
}

document.addEventListener('DOMContentLoaded', loadPlanes);