const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const mysql = require('mysql');

// Setup MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'turingan_spotinode'
});

// Serve static files from the "public" directory
app.use(express.static('public'));

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');  // Store files in "public/uploads"
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));  // Unique file name
    }
});

const upload = multer({ storage: storage });

// Route to handle adding a new song
app.post('/add-song', upload.single('song_file'), (req, res) => {
    const { title, artist, album } = req.body;
    const song_url = `/uploads/${req.file.filename}`;  // Save file path

    const query = `INSERT INTO songs (title, artist, album, song_url) VALUES (?, ?, ?, ?)`;
    db.query(query, [title, artist, album, song_url], (err, result) => {
        if (err) throw err;
        res.send('Song added successfully');
    });
});

// Corrected route to fetch all songs
app.get('/songs', (req, res) => {
    const query = `SELECT * FROM songs`;
    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.listen(4002, () => {
    console.log('Server started on http://localhost:4002');
});
