// custom modules
var tables = require('./js/tables'),
    query = require('./js/query');

// npm modules
var bodyParser = require('body-parser'),
    express = require('express'),
    path = require('path');

var app = express();

// this is used for parsing the JSON object from POST
app.use(bodyParser.json());

// serve static files
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, '/tables/')));

app.listen(8000);
console.log('Listening on port 8000');

app.route('/')
    .get(function(req, res){
      res.sendFile(__dirname + 'index.html');
    });

app.route('/tables/:tablename')
    .get(function(req, res){
      var tablename = req.params.tablename;
      var table = tables[tablename];
    })
    .post(function(req, res){
      var tablename = req.params.tablename;
      var table = tables[tablename];
      var data = req.body;

      query.append(table, data)
            .then(
                  () => {
                    res.json({success : "Inserted Successfully", status : 200});
                  },
                  (error) => {
                    console.log(error);
                  });
    });

app.route('*')
    .all(function(req, res){
      res.redirect('/');
    });
