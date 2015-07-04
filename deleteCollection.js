// This is called by package.json post-install script to clean the database

var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;
 
//connect away
MongoClient.connect('mongodb://localhost/sensor', function(err, db) {
  if(err) throw err;

  db.dropCollection("sensor", function() {
  	process.exit(0);
  });
})