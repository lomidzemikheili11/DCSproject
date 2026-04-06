const AUTH_URL = "https://api.everrest.educata.dev/auth";

async function checkUserStatus() {
    const token = localStorage.getItem("token");
    const userContainer = document.getElementById("user-profile");
    const authBox = document.getElementById("auth-box-to-hide");

    if (token) {
        try {
            const response = await fetch(AUTH_URL, {
                method: "GET",
                headers: {
                    "accept": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });

            if (response.ok) {
                const userData = await response.json();

                if (userContainer) {
                    userContainer.innerHTML = `
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <img src="${userData.avatar}" 
                                 onerror="this.src='https://ui-avatars.com/api/?name=${userData.firstName}'"
                                 style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid orange;">

                            <button id="logout-btn" style="background: none; border: none; cursor: pointer; color: white; padding: 0; display: flex;">
                                <svg width="25px" height="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M14 20H6C4.89543 20 4 19.1046 4 18V6C4 4.89543 4.89543 4 6 4H14M10 12H21M21 12L18 9M21 12L18 15" 
                                          stroke="currentColor" 
                                          stroke-width="2" 
                                          stroke-linecap="round" 
                                          stroke-linejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    `;

                    // Logout ფუნქციონალი
                    document.getElementById('logout-btn').addEventListener('click', () => {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        window.location.reload();
                    });
                }

                if (authBox) {
                    authBox.style.display = "none";
                }
            }
        } catch (e) {
            console.error("Auth status error:", e);
        }
    }
}

document.addEventListener('DOMContentLoaded', checkUserStatus);