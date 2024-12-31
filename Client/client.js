const nameInput = document.getElementById("login");

//auto inserts commande to syle an id for display
function visual(elem, act) {
    document.getElementById(elem).style.display = act;
}

//setup of student page
function setUpStudentPage(obj) {
    visual('studentNotFound', "none");
    visual('loginStudent', "none");
    visual('successfulLogin', "block");
    document.getElementById('loggedInStudent').innerHTML = obj.name;

    if (obj.gender == "Male") {
        document.getElementById('genderPic').src = "./assets/img/male.png";
    } else {
        document.getElementById('genderPic').src = "./assets/img/female.png";
    }
    document.getElementById('bio').innerHTML = ("You like " + obj.favSweet + "!");

    document.getElementById('scrollTitleMastery').innerHTML = (obj.specialisation + " students of 2025");



    document.getElementById('scrollTitleHouse').innerHTML = (obj.house + " students of 2025");
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

    visual(tabName, "block");
    event.currentTarget.className += " active";
}

//name goes in, returns a student is found returns .name = false if not
async function getStudentDetails(nameInputJSON) {
    let parsedData = JSON.parse(nameInputJSON);
    let command;
    if (Object.keys(parsedData).length = 1) {
        command = '/checkExistingStudent';
    } else {
        command = '/callStudent';
    }
    let response = await fetch(command,
        {
            method: 'Post',
            headers: {
                "Content-Type": "application/json"
            },
            body: nameInputJSON
        });

    let responseData = await response.json();
    return (responseData);
}

//event for logging in
nameInput.addEventListener("submit", async function (event) {
    event.preventDefault();
    let nameInputData = new FormData(nameInput)
    let nameInputJSON = JSON.stringify(Object.fromEntries(nameInputData.entries()));

    let responseData = await getStudentDetails(nameInputJSON);
    if (responseData.name) {
        setUpStudentPage(responseData);
    } else {
        visual('studentNotFound', "block");
    }
});

//event for pressing register
document.getElementById("registerLink").onclick = function (event) {
    event.preventDefault();
    visual('registerNewStudent', "block");
    visual('login', "none");
    visual('studentNotFound', "none");
}

// Set default tab to first tab on page load
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".tablink").click();
});