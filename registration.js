const BASE_URL = "https://api.everrest.educata.dev/auth";

const registerForm = document.querySelector(".register-box");

if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        // ინპუტებიდან მნიშვნელობების ამოღება
        const firstName = document.getElementById("firstName").value;
        const lastName = document.getElementById("lastName").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        
        // დამატებითი ველები, რომლებიც API-ს სჭირდება (html-ში თუ არ გაქვს, დაამატე)
        const age = document.getElementById("age") ? document.getElementById("age").value : 20;
        const gender = document.getElementById("gender") ? document.getElementById("gender").value : "MALE";
        const address = document.getElementById("address") ? document.getElementById("address").value : "Tbilisi";
        const phone = document.getElementById("phone") ? document.getElementById("phone").value : "+995555112233";
        const zipcode = document.getElementById("zipcode") ? document.getElementById("zipcode").value : "0100";
        const avatar = document.getElementById("avatar") ? document.getElementById("avatar").value : "https://goo.su/v6SBy";

        // 1. პაროლების დამთხვევის შემოწმება
        if (password !== confirmPassword) {
            alert("პაროლები არ ემთხვევა!");
            return;
        }

        // 2. ტელეფონის ნომრის ფორმატირება (რომ 400 შეცდომა არ ამოაგდოს)
        let formattedPhone = phone;
        if (!formattedPhone.startsWith('+')) {
            formattedPhone = '+' + formattedPhone;
        }

        // 3. მონაცემთა ობიექტის მომზადება
        const userData = {
            firstName,
            lastName,
            email,
            password,
            age: parseInt(age), // აუცილებელია იყოს რიცხვი
            gender,
            address,
            phone: formattedPhone, // უნდა იწყებოდეს +-ით
            zipcode,
            avatar
        };

        try {
            // 4. მოთხოვნის გაგზავნა (სწორი მისამართია sign_up)
            const response = await fetch(`${BASE_URL}/sign_up`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "accept": "application/json"
                },
                body: JSON.stringify(userData)
            });

            const data = await response.json();

            // 5. პასუხის დამუშავება
            if (response.ok || response.status === 201) {
                alert("რეგისტრაცია წარმატებულია! გთხოვთ, შეამოწმოთ მეილი და დააჭიროთ ვერიფიკაციის ღილაკს.");
                window.location.href = "login.html"; 
            } else {
                // 6. დუბლიკატი მეილის შემოწმება (409 Conflict)
                if (response.status === 409 || (data.errorKeys && data.errorKeys.includes("errors.email_in_use"))) {
                    alert("ეს ელ-ფოსტა უკვე გამოყენებულია! სცადეთ სხვა.");
                } else {
                    alert("შეცდომა: " + (data.message || "მონაცემები არასწორია"));
                }
                console.error("Server Error:", data);
            }
        } catch (error) {
            console.error("Network Error:", error);
            alert("სერვერთან კავშირი ვერ დამყარდა.");
        }
    });
}