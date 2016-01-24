var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var bp = require('body-parser');
var assert = require('assert');
var url = require('url');

var app = express();
// used to store the database collection that will be modified
var coll;

app.use(bp.json());
app.use('/', express.static(__dirname + '/../src'));

// // Connect to database
// MongoClient.connect('mongodb://localhost:27017/CodeFoundry', function (err, db) {
//   if (!err) {
//     // prints if successfully connects to database
//     console.log('Connected');
//   }
//   coll = db.collection('demoDB');
// });

// /**
//  * Takes the JSON from client side and inserts it as document into the database
//  * @param - JSON object
//  * @return - success/fail message
//  */
// app.post('/save', function(req, res) {
//   coll.findOne({'title': req.body.title}, function(err, data) {
//     if (!err) {
//       if (!data) {
//         coll.insert(req.body);  // insert if no errors, and data does not exists
//         res.send('Entry saved.');
//       } else {
//         res.send('Another document has already taken that title.');
//       }
//     } else {
//       res.send(err);
//     }
//   });
// });

<<<<<<< HEAD
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
  if (qData.type == 'Any') {
    type = new RegExp('');
  } else {
    type = qData.type;;
  }
  if (qData.lang == 'Any') {
    lang = new RegExp('');
  } else {
    lang = qData.lang;
  }

  coll.find({'title': {$in: [title]}, 'type': {$in: [type]}, 'lang': {$in: [lang]}}).limit(10).toArray(function(err, docs) {
    if (!err) {
      if (docs) {
        res.send(docs);
      } else {
        res.send('No APIs of that sort.');
      }
    } else {
      res.send(err);
    }
  });
});
=======
// *
//  * Searches for documents relevant to user's query and returns them as JSON objects. 
//  * Max objects: 10
//  * @param - searchTitle[, freeOrPremium, programmingLanguage]
//  * @return - JSON object of posts
 
// app.get('/load', function (req, res) {
//   var qData = url.parse(req.url, true).query;
//   // ig - case-insensitive, search for all matches
//   var title = new RegExp(qData.searchString, 'ig');
//   var type = new RegExp(qData.type, 'ig');
//   if (qData.lang.localeCompare('Any') == 0) {
//     lang = new RegExp('');
//   } else {
//     lang = qData.lang;
//   }

//   coll.find({'title': {$in: [title]}, 'type': {$in: [type]}, 'lang': {$in: [lang]}}).limit(10)
//     .toArray(function(err, docs) {
//     if (!err) {
//       if (docs) {
//         res.send(docs);
//       } else {
//         res.send('done');
//       }
//     } else {
//       res.send(err);
//     }
//   });
// });
>>>>>>> e6d037b1dd980c3e7fe204ff10fa2b1805341742

/**
 * Increment the rating field of JSON object whenever user clicks the heart 
 * for the respective API
 * @param - ObjectId of document
 * @return - increment rating on webpage and database
 */
app.post('/rateupdate', function(req, res) {
  var oid = new ObjectID(req.body._id);
  coll.update({'_id': oid}, {$set: {'rating': req.body.rating + 1}});
  res.send('done');
});

app.listen('3000', function() {
  console.log('Listening on port 3000');
});