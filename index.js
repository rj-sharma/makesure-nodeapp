const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
// Port
const port = process.env.PORT || 5000

// Init app
const app = express();

const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const url = 'mongodb://localhost:27017/makesure';  // developer
//const url = 'mongodb://admin:admin@ds121118.mlab.com:21118/makesure-db';  // production
 
// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

// View Setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Connect to mongodb
MongoClient.connect(url, (err, client) => {
  console.log('MongoDB Connected...');
  if(err) throw err;

  db = client.db('makesure'); //name of database
  Makesure=db.collection('makesurecollection');//name of collection in database

  app.listen(port, () => {
    console.log('Server running on port '+port);
  });
});


//Home route
app.get('/', (req, res, next) => {
  Makesure.find({}).toArray((err, makesurecollection) => {
    if(err){
      return console.log(err);
    }
     res.render('index',{
      makesurecollection: makesurecollection
    });
  });
});

app.post('/sorted/add', (req, res, next) => {
  // Create a task
  const sorted = {
    text: req.body.text,//gives text value frm form using 'body-parser
    //body: req.body.body//gives body value frm form using 'body-parser
  }

   // Insert a task
  Makesure.insert(sorted, (err, result) => {
    if(err){
      return console.log(err);
    }
    console.log('Added...');
    res.redirect('/');
  });
});



app.delete('/sorted/delete/:id', (req, res, next) => {
  const query = {_id: ObjectID(req.params.id)}
  Makesure.deleteOne(query, (err, response) => {
    if(err){
      return console.log(err);
    }
    console.log('Removed');
    res.send(200);
  });
});


app.get('/sorted/edit/:id', (req, res, next) => {
   const query = {_id: ObjectID(req.params.id)}
  Makesure.find(query).next((err, sorted) => {
    if(err){
      return console.log(err);
    }
     res.render('edit',{ //rendering edit view
      sorted: sorted
    });
  });
});



app.post('/sorted/edit/:id', (req, res, next) => {
  const query = {_id: ObjectID(req.params.id)}
  // Create a task
  const sorted = {
    text: req.body.text,
    //body: req.body.body
  }

  // Update a task
  Makesure.updateOne(query, {$set:sorted}, (err, result) => {
    if(err){
      return console.log(err);
    }
    console.log('Updated...');
    res.redirect('/');
  });
});
