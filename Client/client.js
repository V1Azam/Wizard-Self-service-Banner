const nameInput = document.getElementById("login");
let regInstead = document.getElementById('studentNotFound')
nameInput.addEventListener("submit", async function (event) {
    event.preventDefault();
    let nameInputData = new FormData(nameInput)
    let nameInputJSON = JSON.stringify(Object.fromEntries(nameInputData.entries()));
    let response = await fetch('/checkExistingStudent',
        {
            method: 'Post',
            headers: {
                "Content-Type": "application/json"
            },
            body: nameInputJSON
        });
    let responseData = await response.json();
    if (responseData.exists) {
        console.log(regInstead.style.display);
        regInstead.style.display = "none";
        document.getElementById('loginStudent').style.display = "none";
        document.getElementById('login').style.display = "none";
    } else {
        regInstead.style.display = "block";
    }
});

document.getElementById("registerLink").onclick = function (event) {
    event.preventDefault();
    document.getElementById('registerNewStudent').style.display = "block";
    document.getElementById('login').style.display = "none"
    regInstead.style.display = "none";
}