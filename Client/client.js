const nameInput = document.getElementById("login");

//auto inserts commande to syle an id for display
function visual(elem, act) {
    document.getElementById(elem).style.display = act;
}

//setup of student page
async function setUpStudentPage(obj) {
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

    document.getElementById('scrollTitleFreshers').innerHTML = ("Students of 2025");
    listOfCommonStudents("stash", "freshersBox", obj);

    document.getElementById('scrollTitleMastery').innerHTML = ("Meet your " + obj.specialisation + " classmates of 2025");
    listOfCommonStudents("specialisation", "masteryBox", obj);


    document.getElementById('scrollTitleHouse').innerHTML = ("Meet your " + obj.house + " family of 2025");
    listOfCommonStudents("house", "houseBox", obj);
}

//create a div for each common student
function commonStudentbox(box, currentSweet, commonSweet, name, gender, currentName) {
    let commonStudent = document.createElement('div');
    commonStudent.classList.add("commonStudentBoxes");

    let commonStudentSweet = document.createElement('span');
    commonStudentSweet.classList.add("commonStudentBoxesSweet");
    if (currentSweet == commonSweet) {
        commonStudentSweet.innerText = "You both love " + commonSweet + "!";
    } else {
        commonStudentSweet.innerText = "Loves " + commonSweet + "!";
    }
    commonStudent.appendChild(commonStudentSweet);

    let img = document.createElement('img');
    if (gender == "Male") {
        img.src = "./assets/img/male.png";
    } else {
        img.src = "./assets/img/female.png";
    }
    img.classList.add("commonStudentGender")
    commonStudent.appendChild(img);

    let text = document.createElement('p');
    text.innerText = name;
    text.classList.add("commonStudentName");
    text.classList.add("mb-0");
    text.classList.add("text-white");
    commonStudent.appendChild(text);

    document.getElementById(box).appendChild(commonStudent);

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

async function listOfCommonStudents(attribute, whichBox, obj) {
    let checkCommonAttribute = JSON.stringify({ name: obj.name, [attribute]: obj[attribute] });
    let fullList = await getStudentDetails(checkCommonAttribute);
    for (let i = 0; i < Object.keys(fullList).length; ++i) {

        if ((obj.name == fullList[i].name) && (attribute != "stash")) {
            continue;
        } else {
            commonStudentbox(whichBox, obj.favSweet, fullList[i].favSweet, fullList[i].name, fullList[i].gender, obj.name)
        }
    }
}

//name goes in, returns a student is found returns and .name = false if not
async function getStudentDetails(InputJSON) {
    let parsedData = JSON.parse(InputJSON);
    let command;
    if (Object.keys(parsedData).length == 1) {
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
            body: InputJSON
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
};

document.getElementById("loginLink").onclick = function (event) {
    event.preventDefault();
    document.getElementById("login").reset();
    visual('loginStudent', "block");
    visual('successfulLogin', "none");
    document.getElementById("masteryBox").innerHTML = "";
    document.getElementById("houseBox").innerHTML = "";
    document.querySelector(".tablink").click();
};

// Set default tab to first tab on page load
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".tablink").click();
});