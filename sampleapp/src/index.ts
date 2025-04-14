import express from 'express';
const app = express();

app.get('/', (req, res) => {
    res.send('yeah but like yeah man yay dude lol\n');
});

app.listen(3000);
