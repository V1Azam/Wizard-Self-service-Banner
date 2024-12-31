const express = require('express')
const app = express()

app.use(express.json());

let house = require("./data/houses.json");
let students = require("./data/students.json");


app.get('/randomHouse', function (req, resp) {
    let randomHouse = Math.floor(Math.random() * house.length);
    resp.send(house[randomHouse]);
})

app.post('/checkExistingStudent', function (req, resp) {
    let result = { name: false };
    for (let i = 0; i < students.length; ++i) {
        let currentName = students[i];
        if (currentName.name == req.body.name) {
            result = currentName;
            break;
        }
    }
    resp.json(result);
});

app.post('/callStudent', function (req, resp) {
    let group = [];
    let attribute = req.body[Object.keys(req.body)[1]];
    let key = Object.keys(req.body)[1];
    for (let i = 0; i < students.length; ++i) {
        let currentStudent = students[i];
        if (currentStudent[key] == attribute) {
            group.push(currentStudent);
        }
    }
    resp.json(group);
});


app.use(express.static('Client'));

app.listen(8090)