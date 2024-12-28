const nameInput = document.getElementById("login");
nameInput.addEventListener("submit", async function (event) {
    event.preventDefault();
    let regInstead = document.getElementById('studentNotFound')
    let nameInputData = new FormData(nameInput)
    let nameInputJSON = JSON.stringify(Object.fromEntries(nameInputData.entries()));
    console.log(nameInputJSON)
    let response = await fetch('/checkExistingStudent',
        {
            method: 'Post',
            headers: {
                "Content-Type": "application/json"
            },
            body: nameInputJSON
        });
    let responseData = await response.json();
    console.log(responseData.exists);
    if (responseData.exists) {
        regInstead.style.display = "none";
    } else {
        regInstead.style.display = "block";
    }
});
