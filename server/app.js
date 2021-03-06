var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var bp = require('body-parser');
var assert = require('assert');
var url = require('url');
var cors = require('cors');

var app = express();
// used to store the database collection that will be modified
var coll;

app.use(bp.json());
app.use('/', express.static(__dirname + '/../src'));
app.use(cors());

// // Connect to database
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

  if(qData.searchString.length != 0) {
	  coll.find({'title': {$in: [title]}, 'lang': {$in: [lang]}}).limit(10).toArray(function(err, docs) {
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
	} else {
		res.send();
	}
});

/**
 * Increment the rating field of JSON object whenever user clicks the heart 
 * for the respective API
 * @param - ObjectId of document
 * @return - increment rating on webpage and database
 */
app.post('/rateupdate', function(req, res) {
  var oid = new ObjectID(req.body._id);
  coll.update({'_id': oid}, {$set: {'rating': req.body.rating}});
  res.send('done');
});

app.get('/loaduser', function(req, res) {
  coll.find({'author.id': "8346509f62h1"}).limit(5).toArray(function(err, docs) {
    if (!err) {
      if (docs) {
        res.send(docs);
      } else {
        res.send('User does not exist.');
      }
    } else {
      res.send(err);
    }
  });
});

app.get('/call', function(req, res) {
	var qData = url.parse(req.url, true).query;

	var oId = new ObjectID(qData.apiKey);
	coll.findOne({'_id': oId}, function(err, data) {
		if(err) {
			res.send("error");
		} else {
			if(data.lang.toLowerCase() == "html" || data.lang.toLowerCase() == "css") {
				res.send(data.code);
			} else {
				if(data.code.indexOf(" ") > data.code.indexOf("(")) {
					var paran = "(";
					paran += data.code;
					paran += ")();";
					eval(paran);
				} else {
					var functionCall = data.code.substr(data.code.indexOf(" ") + 1, data.code.indexOf("("));
					for(var prop in qData) {
						if(prop != "apiKey") {
							functionCall += prop + ",";
						}
					}
					functionCall += ");";
					eval(data.code);
					eval(functionCall);
				}

				res.send("success");
			}
		}
	})
});

app.listen('3000', function() {
  console.log('Listening on port 3000');
});