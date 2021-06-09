const PORT = process.env.PORT || 3001;
const fs = require("fs");
const path = require("path");
const express = require("express");
const uniqid = require("uniqid");
const app = express();
// const allNotes = require(".db/db.json");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "/assets")));

// app.get("/api/notes", (req, res) => {
//   res.json(allNotes.slice(1));
// });

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "notes.html"));
});

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "index.html"));
// });

app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", (error, data) => {
    if (error) {
      console.error(error);
    } else {
      res.send(data);
    }
  });
});

// function createNewNote(body, notesArray) {
//   const newNote = body;
//   if (!Array.isArray(notesArray)) notesArray = [];

//   if (notesArray.length === 0) notesArray.push(0);

//   body.id = notesArray[0];
//   notesArray[0]++;

//   notesArray.push(newNote);
//   fs.writeFileSync(
//     path.join(__dirname, "./db/db.json"),
//     JSON.stringify(notesArray, null, 2)
//   );
//   return newNote;
// }

app.post("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", (error, data) => {
    if (error) {
      console.error(error);
    } else {
      let notes = JSON.parse(data);
      console.log(notes);
      let newNote = req.body;
      newNote["id"] = uniqid();
      notes.push(newNote);
      fs.writeFile("db/db.json", JSON.stringify(notes), (err) =>
        err
          ? console.error(err)
          : console.log("New Note has been stored in database (db)")
      );
      res.json(newNote);
    }
  });
});

function deleteNote(id, notesArray) {
const newNotes = notesArray.filter((note)=>{
return note.id !==id; 
})
console.log(newNotes);

  for (let i = 0; i < notesArray.length; i++) {
    let note = notesArray[i];

    if (note.id == id) {
      notesArray.splice(i, 1);
      fs.writeFileSync(
        path.join(__dirname, "db/db.json"),
        JSON.stringify(notesArray, null, 2)
      );

      // break;
    }
  }
}

app.delete("/api/notes/:id", (req, res) => {
  console.log("deleting")
  fs.readFile("./db/db.json", "utf8", (error, data) => {
    if (error) {
      console.error(error);
    } else {
      deleteNote(req.params.id, JSON.parse(data));
  res.json({ok:true});
    }
  })
});

app.listen(PORT, () => {
  console.log(`API server on port ${PORT}`);
});