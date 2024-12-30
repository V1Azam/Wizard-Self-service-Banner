const nameInput = document.getElementById("login");
let regInstead = document.getElementById('studentNotFound')

function setUpStudentPage(obj) {
    regInstead.style.display = "none";
    document.getElementById('loginStudent').style.display = "none";
    document.getElementById('successfulLogin').style.display = "block";
    document.getElementById('loggedInStudent').innerHTML = obj.name;
    if (obj.gender == "Male") {
        document.getElementById('genderPic').src = "./assets/img/male.png";
    } else {
        document.getElementById('genderPic').src = "./assets/img/female.png";
    }
    document.getElementById('bio').innerHTML = ("You like " + obj.favSweet + "!");
}

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
    if (responseData.name) {
        setUpStudentPage(responseData);
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