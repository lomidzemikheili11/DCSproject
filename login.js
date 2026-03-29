// Everrest API-ს სწორი მისამართი ავტორიზაციისთვის
const BASE_URL = "https://api.everrest.educata.dev/auth";

const loginForm = document.querySelector(".login-box");

if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // ამოვიღოთ მონაცემები შენი HTML-ის ID-ების მიხედვით
        const emailInput = document.getElementById("loginEmail");
        const passwordInput = document.getElementById("loginPassword");

        if (!emailInput || !passwordInput) {
            alert("შეცდომა: HTML-ში ინპუტების ID-ები არასწორია!");
            return;
        }

        const email = emailInput.value;
        const password = passwordInput.value;

        try {
            // ყურადღება: ენდპოინთი არის /sign_in
            const response = await fetch(`${BASE_URL}/sign_in`, {
                method: "POST",
                headers: { 
                    "Content-Type": "application/json",
                    "accept": "application/json" 
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                // წარმატებული შესვლა - ვინახავთ Token-ს
                localStorage.setItem("token", data.access_token);
                
                alert("წარმატებით შეხვედით!");
                
                // გადამისამართება მთავარ გვერდზე
                window.location.href = "index.html"; 
            } else {
                // შეცდომების მართვა
                if (response.status === 401) {
                    alert("არასწორი მეილი/პაროლი ან მეილი ჯერ არ არის ვერიფიცირებული!");
                } else if (response.status === 404) {
                    alert("სერვერზე მისამართი ვერ მოიძებნა (404). შეამოწმე BASE_URL.");
                } else {
                    alert("შეცდომა: " + (data.message || "შესვლა ვერ მოხერხდა"));
                }
                console.error("Login Error Details:", data);
            }
        } catch (error) {
            console.error("Network error:", error);
            alert("სერვერთან კავშირი ვერ დამყარდა.");
        }
    });
}