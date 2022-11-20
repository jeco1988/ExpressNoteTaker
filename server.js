const express = require("express");
const fs = require("fs");
const path = require("path");
const database = require("./db/db")

var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.static('public'));

// parses data to JSON file

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// index html
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

// notes html
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/notes.html"));
})

app.route("/api/notes")
    // get notes list
    .get(function (req, res) {
        res.json(database);
    })

    // add new note to db.json
    .post(function (req, res) {
        let jsonFilePath = path.join(__dirname, "/db/db.json");
        let newNote = req.body;

        let highestId = 99;
        for (let i = 0; i < database.length; i++) {
            let individualNote = database[i];

            if (individualNote.id > highestId) {
                highestId = individualNote.id;
            }
        }
        // assigns ID to newNote
        newNote.id = highestId + 1;
        database.push(newNote)

        // write to db.json
        fs.writeFile(jsonFilePath, JSON.stringify(database), function (err) {

            if (err) {
                return console.log(err);
            }
            console.log("Your note was saved!");
        });
        // give response - new note. 
        res.json(newNote);
    });

// delete notes
app.delete("/api/notes/:id", function (req, res) {
    let jsonFilePath = path.join(__dirname, "/db/db.json");
    // delete note by id
    for (let i = 0; i < database.length; i++) {

        if (database[i].id == req.params.id) {
            database.splice(i, 1);
            break;
        }
    }
    // write to db.json
    fs.writeFileSync(jsonFilePath, JSON.stringify(database), function (err) {

        if (err) {
            return console.log(err);
        } else {
            console.log("Your note was deleted!");
        }
    });
    res.json(database);
});

// listening function
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});