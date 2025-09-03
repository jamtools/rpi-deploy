import express from 'express';
const app = express();

app.get('/', (req, res) => {
    res.send('this is working now yay! so excited lets go\n');
});

app.listen(3000, '0.0.0.0', () => {
    console.log('Server started on port 3000');
});
