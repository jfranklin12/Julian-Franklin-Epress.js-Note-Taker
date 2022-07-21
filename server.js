const express = require('express');
const path = require('path');
const fs = require('fs');

const PORT = process.env.PORT || 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));
// GET request for index.html
app.get('/', (req, res) => {
  console.info(`${req.method} request to receive to get index.html`)
  res.sendFile(path.join(__dirname, '/public/index.html'))
});
// GET request for notes html
app.get('/notes', (req, res) => {
  console.info(`${req.method} request received to get notes`);
  res.sendFile(path.join(__dirname, '/public/notes.html'));
});
// GET request for notes JSON
app.get('/api/notes', (req, res) => {
  console.info(`${req.method} request to get JSON notes received`);
  res.json(`${req.method} request to get JSON notes received`);
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
          JSON.stringify(parsedNotes, null, 2),
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

app.listen(PORT, () =>
  console.log(`App listening at http://localhost:${PORT} 🚀`)
);