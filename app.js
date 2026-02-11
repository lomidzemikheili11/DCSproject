document.addEventListener("DOMContentLoaded", () => {
    const burger = document.getElementById("burgerToggle");
    const homeMenu = document.querySelector(".HOME");

    burger.addEventListener("change", () => {
        if (burger.checked) {
            homeMenu.style.display = "flex";
        } else {
            homeMenu.style.display = "none";
        }
    });
});

const API_URL = "https://698899bb780e8375a688b3a0.mockapi.io/file/";

 function downloadFile() {
    fetch(API_URL + "1")
      .then(response => response.json())
      .then(data => {
        window.location.href = data.DownloadURL;
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }

  function downloadFile2() {
    fetch(API_URL + "2")
      .then(response => response.json())
      .then(data => {
        window.location.href = data.DownloadURL;
      })
      .catch(error => {
        console.error("Error:", error);
      });
  }