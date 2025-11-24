const express = require('express');
const app = express();
const port = process.PORT || 3000;

app.use(express.static('public'));
app.listen(port, () => console.log("Servidor corriendo en http://localhost:3000"));
app.listen(port, () => console.log("|||||||||||||||||||||||||||||||||||||||||"));
app.listen(port, () => console.log("App SmartTasks corrindo ヾ(⌐■_■)ノ♪ "));