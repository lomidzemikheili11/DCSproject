const API_URL = "https://69cd2b0dddc3cabb7bd23b56.mockapi.io/plane-cards";
let favoritePlanesData = []; 

async function drawFavs() {
    const box = document.getElementById('favorites-container');
    if (!box) return;

    const stored = localStorage.getItem('favorites');
    const ids = stored ? JSON.parse(stored).map(String) : [];

    if (ids.length === 0) {
        box.innerHTML = "<h2 style='color:white; text-align:center; grid-column: 1/-1;'>სია ცარიელია</h2>";
        return;
    }

    try {
        const res = await fetch(API_URL);
        const allPlanes = await res.json();
        
        // ვინახავთ მხოლოდ დაგულებულებს
        favoritePlanesData = allPlanes.filter(p => ids.includes(String(p.id)));
        renderCards(favoritePlanesData);
    } catch (e) {
        console.error("Error:", e);
    }
}

function renderCards(planes) {
    const box = document.getElementById('favorites-container');
    if (planes.length === 0) {
        box.innerHTML = "<h2 style='color:white; text-align:center; grid-column: 1/-1;'>შედეგი ვერ მოიძებნა</h2>";
        return;
    }

    box.innerHTML = planes.map(p => `
        <div class="plane-card" onclick="flipCard(this)">
            <div class="card-inner">
                <div class="card-front">
                    <div class="heart-icon active" onclick="deleteThis(event, '${p.id}')" style="color: #ff4757;">
                        ❤
                    </div>
                    <img src="${p.image}" class="plane-img">
                    <div class="plane-name-overlay">${p.name}</div>
                </div>
                <div class="card-back">
                    <h3>${p.name}</h3>
                    <p class="type-badge" style="color:#ff9d00; margin-bottom:10px;">${p.type}</p>
                    <p style="font-size: 13px;">${p.description || 'No description'}</p>
                </div>
            </div>
        </div>
    `).join('');
}

// დატრიალების ფუნქცია
function flipCard(el) {
    if (event.target.classList.contains('heart-icon')) return;
    el.classList.toggle('is-flipped');
}

function filterPlanes() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const selectedType = document.getElementById('typeFilter').value;

    const filtered = favoritePlanesData.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm);
        const matchesType = (selectedType === 'all' || p.type === selectedType);
        return matchesSearch && matchesType;
    });

    renderCards(filtered);
}

function deleteThis(event, id) {
    event.stopPropagation();
    let favs = JSON.parse(localStorage.getItem('favorites')) || [];
    favs = favs.filter(i => String(i) !== String(id));
    localStorage.setItem('favorites', JSON.stringify(favs));
    drawFavs(); 
}

document.addEventListener('DOMContentLoaded', drawFavs);