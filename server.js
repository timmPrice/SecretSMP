import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url); 
const __dirname = path.dirname(__filename);        

app.use(express.json());
// serve html and js
app.use(express.static(path.join(__dirname, 'public')));

// serve all of node_modules
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')));

// get skins from usernames.txt
function getSkins() {
    const nameFilePath = path.join(process.cwd(), 'usernames.txt')
    try {
        const usernames = fs.readFileSync(nameFilePath, 'utf-8')
            .split('\n')
            .map(line => line.trim())
            .filter(Boolean);
        return usernames.map(username => `https://minotar.net/skin/${username}`);
    } catch (error) {
        console.error('Error reading usernames.txt:', error); 
        return [];
    }
}

let currentPlayers = []

app.get('/api/skins', (req, res) => {
    const skins = getSkins();
    res.json(skins)
});

app.post('/api/active', (req, res) => {
    const { players } = req.body;
        
    if (!Array.isArray(players)) return res.status(400).send("Invalid json");

    currentPlayers = players;
    console.log(currentPlayers);
    res.sendStatus(200);
});

app.get('/api/active', (req, res) => {
    res.json({ players: currentPlayers });
});

app.use(express.static('public'));

app.listen(PORT, () =>  {
    console.log(`server running @ http://localhost:${PORT}`);
});
