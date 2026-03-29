const AUTH_URL = "https://api.everrest.educata.dev/auth";

async function checkUserStatus() {
    const token = localStorage.getItem("token");
    const userContainer = document.getElementById("user-profile");
    // ვპოულობთ კონკრეტულად რეგისტრაციის ბლოკს ID-ით
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

                // 1. მომხმარებლის ავატარის გამოჩენა ნავიგაციაში
                if (userContainer) {
                    userContainer.innerHTML = `
                        <div style="display: flex; align-items: center; gap: 12px;">
                            <img src="${userData.avatar}" 
                                 onerror="this.src='https://ui-avatars.com/api/?name=${userData.firstName}'"
                                 style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover; border: 2px solid orange;">
                            <button id="logout-btn" style="background: #ff4747; color: white; border: none; padding: 6px 10px; cursor: pointer; border-radius: 4px; font-size: 13px;">Log Out</button>
                        </div>
                    `;

                    document.getElementById("logout-btn").addEventListener("click", () => {
                        localStorage.removeItem("token");
                        window.location.reload();
                    });
                }

                // 2. მხოლოდ რეგისტრაციის ღილაკის გაქრობა
                if (authBox) {
                    // visual-hidden კლასის გამოყენება სტილების შესანარჩუნებლად, ან display: none;
                    authBox.style.display = "none";
                    console.log("Registration button hidden successfully.");
                } else {
                    console.error("ვერ ვიპოვე 'auth-box-to-hide' ID-ის მქონე ელემენტი HTML-ში!");
                }

            } else {
                localStorage.removeItem("token");
            }
        } catch (error) {
            console.error("Auth error in checkUserStatus:", error);
        }
    }
}

// ვიძახებთ ფუნქციას მას შემდეგ, რაც DOM სრულად ჩაიტვირთება
document.addEventListener("DOMContentLoaded", checkUserStatus);