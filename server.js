const express = require('express')
const fs = require('fs')
//this is a node library that can be used to create a unique ID
const uniqid = require('uniqid')
const path = require('path')
const app = express()
let noteContent = require('./db/db.json')
const PORT = process.env.PORT || 3001

// this section is meant to enstantiate deifferent parts of the app. allow the public file to be viewed as static and allows the server to parse json data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// this is for the root file path on the server, meant to keep the content meant for the main page on search
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);
//similar to the main page this works with the notes.html page to get the content for the note writing page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
)

//this is meant specifically to collect the data from the already writen notes and display it on the page
app.get('/api/notes',(req,res) =>{
res.json(noteContent)
});

// this is the etra step meant to remove a writen note, it is based on the function from class we used only reverse engineered to speciffically work for my purpose
app.delete('/api/notes/:id', (req,res) =>{
    
    let deleteId = req.params.id
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          const parsedNotes = JSON.parse(data);
          //this is the main difference here it talks about where it collects the data of notes finds the one you want to delete and then splices it from the data
            for(i=0;i<parsedNotes.length;i++){
                if(parsedNotes[i].id == deleteId){
                    parsedNotes.splice(i,1)
                }
            }
           
            noteContent = parsedNotes
          fs.writeFile(
            './db/db.json',
            JSON.stringify(parsedNotes, null, 4),
            (writeErr) =>
              writeErr
                ? console.error(writeErr)
                : console.info('Successfully updated Notes!')
          )
        }
      })
      res.json(noteContent)
})

// this is also cresated from a function we were tought in class, lesson 11 activity 20 where we posted something to an array we pulled from another page
// this is the inspiration for the delete function as well
app.post('/api/notes', (req, res) => {
    const {title,text} = req.body
    if(title && text){
        const newNote = {
            title,
            text,
            id: uniqid()
        }
    
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          const parsedNotes = JSON.parse(data);
          parsedNotes.push(newNote);
            noteContent = parsedNotes
          fs.writeFile(
            './db/db.json',
            JSON.stringify(parsedNotes, null, 3),
            (writeErr) =>
              writeErr
                ? console.error(writeErr)
                : console.info('Successfully updated Notes!')
          );
        }
      })
    }
    res.json(noteContent)
})



// this is where the server listens for changes in port links
app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} `)
);