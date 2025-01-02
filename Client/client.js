//Set default tab to first tab on page load
document.addEventListener("DOMContentLoaded", function () {
    document.querySelector(".tablink").click();
});

//auto inserts command to syle an id for display
function visual(elem, act) {
    document.getElementById(elem).style.setProperty("display", act, "important");
}

//fulfills and returns a student with all their properties 
async function newStudent(formData) {
    let fullStudentDetails = formData;
    fullStudentDetails.stash = "robe";
    let randomHouse = await loadHouse();
    fullStudentDetails.house = randomHouse.house
    return (fullStudentDetails);
}

//randomly returns a house
async function loadHouse(event) {
    let currentHouse = await fetch('/randomHouse');
    let newHouse = await currentHouse.json();
    return (newHouse);
}

//setup of student page
async function setUpStudentPage(obj) {
    //shows logged in students page while hiding log in and register
    visual('studentNotFound', "none");
    visual('loginStudent', "none");
    visual('registerNewStudent', "none");
    visual('successfulLogin', "block");

    //adds profile image, name and bio(favorite sweet)
    document.getElementById('loggedInStudent').innerHTML = obj.name;
    if (obj.gender == "Male") {
        document.getElementById('genderPic').src = "./assets/img/male.png";
    } else {
        document.getElementById('genderPic').src = "./assets/img/female.png";
    }
    document.getElementById('bio').innerHTML = ("You like " + obj.favSweet + "!");

    //initialisation of fresher tab
    document.getElementById('scrollTitleFreshers').innerHTML = ("Students of 2025");
    listOfCommonStudents("stash", "freshersBox", obj);

    //initialisation of mastery tab
    document.getElementById('scrollTitleMastery').innerHTML = ("Meet your " + obj.specialisation + " classmates of 2025");
    listOfCommonStudents("specialisation", "masteryBox", obj);

    //initialisation of house tab
    document.getElementById('scrollTitleHouse').innerHTML = ("Meet your " + obj.house + " family of 2025");
    listOfCommonStudents("house", "houseBox", obj);
}

//create a div for each common student
function commonStudentbox(box, currentSweet, commonSweet, name, gender, currentHouse) {
    let commonStudent = document.createElement('div');
    commonStudent.classList.add("commonStudentBoxes");

    //shows fav sweet of hovered student and compares with current student
    let commonStudentSweet = document.createElement('span');
    commonStudentSweet.classList.add("commonStudentBoxesSweet");
    if (currentSweet == commonSweet) {
        commonStudentSweet.innerText = "You both love " + commonSweet + "!";
    } else {
        commonStudentSweet.innerText = "Loves " + commonSweet + "!";
    }
    commonStudent.appendChild(commonStudentSweet);

    //adds gender pfp for each student
    let img = document.createElement('img');
    if (gender == "Male") {
        img.src = "./assets/img/male.png";
    } else {
        img.src = "./assets/img/female.png";
    }
    img.classList.add("commonStudentGender")
    commonStudent.appendChild(img);

    //adds name of student
    let text = document.createElement('p');
    text.innerText = name;
    text.classList.add("commonStudentName");
    text.classList.add("mb-0");

    //personalizes house tab with house colours
    if (box == "houseBox") {
        let houseInfo = personaliseHouse(currentHouse);
        commonStudent.style.outline = "10px solid" + houseInfo.colourPalette[0];
        commonStudent.style.backgroundColor = houseInfo.colourPalette[1];

        document.getElementById('houseBox').style.backgroundColor = houseInfo.colourPalette[3];

        //special font colour for huffelpuff to be more visible
        if (houseInfo.colourPalette[2]) {
            text.classList.add("text-black");
        } else (
            text.classList.add("text-white")
        );
    } else {
        text.classList.add("text-white");
    }

    commonStudent.appendChild(text);

    //adds the common student div to tab
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

function personaliseHouse(house) {
    let housePackage = {};
    let outline, inner, text, scrollBoxColour;
    if (house == 'Gryffindor' || house == 'Hufflepuff') {
        if (house == 'Gryffindor') {
            outline = '#BB8E47';
            inner = '#A72227';
            scrollBoxColour = '#8f2428';
        } else {
            outline = '#050000';
            inner = '#FEC305';
            text = '#050000';
            scrollBoxColour = '#e2b522';
        }
    } else {
        outline = '#FFFFFF';
        if (house == 'Slytherin') {
            inner = '#365D3E';
            scrollBoxColour = '#2c4731';
        } else {
            inner = '#22285C';
            scrollBoxColour = '#373b67';
        }
    }
    housePackage.banner = ("./Client/assets/img/houseImgs/" + house);
    housePackage.colourPalette = [outline, inner, text, scrollBoxColour];
    return (housePackage);
}

//Gets a list of students who share the same attribute given from the current student and creates each student box within the tab content div
async function listOfCommonStudents(attribute, whichBox, obj) {
    let checkCommonAttribute = JSON.stringify({ name: obj.name, [attribute]: obj[attribute] });
    let fullList = await getStudentDetails(checkCommonAttribute);
    for (let i = 0; i < Object.keys(fullList).length; ++i) {

        //in every scenario except the full freshers list, ignores the current student
        if ((obj.name == fullList[i].name) && (attribute != "stash")) {
            continue;
        } else {

            //ensure current student is not compared to themselves in the freshers tab for favorite sweet 
            if (obj.name == fullList[i].name) {
                commonStudentbox(whichBox, '', fullList[i].favSweet, fullList[i].name, fullList[i].gender, obj.house)
            }
            else {
                commonStudentbox(whichBox, obj.favSweet, fullList[i].favSweet, fullList[i].name, fullList[i].gender, obj.house)
            }
        }
    }
}

//filters which request is asked through how many properties were given 
async function getStudentDetails(InputJSON) {
    let parsedData = JSON.parse(InputJSON);
    let command;

    //checks if student exists in JSON file returning that students details
    if (Object.keys(parsedData).length == 1) {
        command = '/checkExistingStudent';
    }

    //returns a list of students with the common attribute value
    else {
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
const nameInputLogin = document.getElementById("login");
nameInputLogin.addEventListener("submit", async function (event) {
    event.preventDefault();
    let nameInputLoginData = new FormData(nameInputLogin)
    let nameInputLoginJSON = JSON.stringify(Object.fromEntries(nameInputLoginData.entries()));

    let responseData = await getStudentDetails(nameInputLoginJSON);
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

//event for registering
const nameInputRegister = document.getElementById("register");
nameInputRegister.addEventListener("submit", async function (event) {
    event.preventDefault();
    let nameInputRegisterData = new FormData(nameInputRegister);
    let nameInputRegisterJSON = JSON.stringify(Object.fromEntries(nameInputRegisterData.entries()));

    let formData = JSON.parse(nameInputRegisterJSON);
    let nameDataJSON = JSON.stringify({ "name": formData.name });
    let response = await fetch('/checkExistingStudent',
        {
            method: 'Post',
            headers: {
                "Content-Type": "application/json"
            },
            body: nameDataJSON
        });

    let responseData = await response.json();

    if (responseData.name) {
        visual('studentAlrExists', "block");
    } else {
        let newStudentData = await newStudent(formData);
        let newStudentDataJSON = JSON.stringify({
            "name": newStudentData.name, "gender": newStudentData.gender,
            "favSweet": newStudentData.favSweet, "specialisation": newStudentData.specialisation,
            "stash": newStudentData.stash, "house": newStudentData.house
        });
        fetch('/addStudent',
            {
                method: 'Post',
                headers: {
                    "Content-Type": "application/json"
                },
                body: newStudentDataJSON
            });
        setUpStudentPage(newStudentData);
    }
});

//event for pressing logout after successful login OR login instead after attempt to register existing student
document.getElementById("logoutLink").onclick = document.getElementById("loginLink").onclick = function (event) {
    event.preventDefault();
    document.getElementById("login").reset();
    document.getElementById("register").reset();
    visual('loginStudent', "block");
    visual('login', "block");
    visual('registerNewStudent', "none");
    visual('successfulLogin', "none");
    visual('studentAlrExists', "none");
    document.getElementById("masteryBox").innerHTML = "";
    document.getElementById("houseBox").innerHTML = "";
};