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

function tab(event, tabName) {
    let tabcontent;
    let tablink;

    tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    tablink = document.getElementsByClassName("tablink");
    for (let i = 0; i < tablink.length; i++) {
        tablink[i].className = tablink[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    event.currentTarget.className += " active";
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

// Set default tab to London on page load
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".tablink").click();
});