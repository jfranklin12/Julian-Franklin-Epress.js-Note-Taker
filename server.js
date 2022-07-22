const express = require('express');
const path = require('path');
const fs = require('fs');
const router = require('express').Router();
const { v4: uuidv4 } = require('uuid')

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

// GET request for notes html
app.get('/notes', (req, res) => {
  console.info(`${req.method} request received to get notes`);
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});
// GET request for notes JSON
app.get('/api/notes', (req, res) => {
  console.info(`${req.method} request to get JSON notes received`);
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
  if(err) {
    console.error(err);
  } else {
    res.json(JSON.parse(data));
  }
  });
});


// Read json file and allow new notes to be created in the json file 
app.post('/api/notes', (req, res) => {
  console.info(`${req.method} request received to add a note`);

  const { title, text } = req.body;

  // Create note if all the propertiies are present
  if (title && text) {
    const newNote = {
      title,
      text,
      id: uuidv4(),
    };

    // Obtain created notes and covert string to JSON object
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedNotes = JSON.parse(data);

        // Add a new note
        parsedNotes.push(newNote);

        // Write updated notes back to the file
        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNotes, null, 3),
          (writeErr) =>
            writeErr ? console.error(writeErr) : console.info('Successfully updated notes!')
        );
      };
    });

    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting note');
  }
});

// delete note
app.delete('/api/notes/:id', (req, res) => {
  console.info(`${req.method} request to delete note`);
  fs.readFile('./db/db.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err)
    } else {
      const newArray = JSON.parse(data).filter(note => {
        if(note.id === req.params.id) {
        return false
        } else
        return true
      })

      fs.writeFile(
        './db/db.json',
        JSON.stringify(newArray, null, 3),
        (writeErr) =>
          writeErr ? console.error(writeErr) : console.info('Successfully updated notes!')
      );
      res.json(newArray);
      

    }
  });
});
// GET request for index.html
router.get('*', (req, res) => {
  console.info(`${req.method} request to receive to get index.html`)
  res.sendFile(path.join(__dirname, '/public/index.html'))
});

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);