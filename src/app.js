require("dotenv").config();
const express = require('./express');
const app = express();
const path = require('path');



const PORT = process.env.PORT || 3000;

// app.use
app.use((req, res, next) => {
  console.log('Middleware executed!');
  next();
});

// get method
app.get('/', (req, res) => {
  res.end('Hello, Node coders!');
});

// post method
app.post('/', (req, res) => {
    const { name } = req.body;
    res.end(`Creating a new coder: ${name}`);
});

// put method
app.put('/', (req, res) => {
    const { name } = req.body;
    res.end(`Updating coder with name: ${name}`);
});

// delete method
app.delete('/', (req, res) => {
    const { name } = req.body;
    res.end(`Deleting coder ${name}`);
});




//   Route handler
app.get('/url/:id', (req, res) => {
    console.log('Request Body:', req.body);
    console.log('Request Params:', req.params);
    console.log('Request Headers:', req.headers);
    console.log('Request Query:', req.query);
    res.end('Route handler');
});


// res.send
app.get('/send', (req, res) => {
    res.send('Hello, Node coders');
});

//  res.json and res.status
app.get('/user', (req, res) => {
    const user = [
      { surname:'Dehqonova', name: 'Zahro' }
    ];
    res.status(200).json(user);
});

// res.sendfile
app.get('/file', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


  
app.listen(3000, () => {
  console.log(`Server is listening on PORT ${PORT}`);
});
