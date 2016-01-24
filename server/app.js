var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var bp = require('body-parser');
var assert = require('assert');
var url = require('url');

var app = express();
// used to store the database collection that will be modified
var coll;

app.use(bp.json());
app.use('/', express.static(__dirname + '/../src'));

// Connect to database
MongoClient.connect('mongodb://localhost:27017/CodeFoundry', function (err, db) {
  if (!err) {
    // prints if successfully connects to database
    console.log('Connected');
  }
  coll = db.collection('demoDB');
});

/**
 * Takes the JSON from client side and inserts it as document into the database
 * @param - JSON object
 * @return - success/fail message
 */
app.post('/save', function(req, res) {
  coll.findOne({'title': req.body.title}, function(err, data) {
    if (!err) {
      if (!data) {
        coll.insert(req.body);  // insert if no errors, and data does not exists
        res.send('Entry saved.');
      } else {
        res.send('Another document has already taken that title.');
      }
    } else {
      res.send(err);
    }
  });
});

/**
 * Searches for documents relevant to user's query and returns them as JSON objects. 
 * Max objects: 10
 * @param - searchTitle[, freeOrPremium, programmingLanguage]
 * @return - JSON object of posts
 */
app.get('/load', function (req, res) {
  var qData = url.parse(req.url, true).query;
  // ig - case-insensitive, search for all matches
  var title = new RegExp(qData.searchString, 'ig');
  var type = new RegExp(qData.type, 'ig');
  if (qData.lang.localeCompare('Any') == 0) {
    lang = new RegExp('');
  } else {
    lang = qData.lang;
  }

  coll.find({'title': {$in: [title]}, 'type': {$in: [type]}, 'lang': {$in: [lang]}}).limit(10)
    .toArray(function(err, docs) {
    if (!err) {
      if (docs) {
        res.send(docs);
      } else {
        res.send('done');
      }
    } else {
      res.send(err);
    }
  });
});

app.listen('3000', function() {
  console.log('Listening on port 3000');
});