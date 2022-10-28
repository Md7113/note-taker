const express = require('express')
const fs = require('fs')
const uniqid = require('uniqid')
const path = require('path')
const app = express()
let noteContent = require('./db/db.json')
//add or horoku stuff
const PORT = process.env.port || 3001

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/index.html'))
);

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
)

app.get('/api/notes',(req,res) =>{
res.json(noteContent)
});

app.delete('/api/notes/:id', (req,res) =>{
    
    let deleteId = req.params.id
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
          console.error(err);
        } else {
          const parsedNotes = JSON.parse(data);
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




app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} `)
);