const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    res.send("Hello World !, cooco");
});
app.listen(port, () => {
    console.log(`Ecoute sur le port ${port}`)
})
