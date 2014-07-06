var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

ResultProvider = function(db) {
  this.db=db;
};


ResultProvider.prototype.getCollection= function(callback) {
  this.db.collection('results', function(error, result_collection) {
    if( error ) callback(error);
    else callback(null, result_collection);
  });
};

//find all results
ResultProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, result_collection) {
      if( error ) callback(error)
      else {
        result_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};
//count results
ResultProvider.prototype.count = function(callback) {
    this.getCollection(function(error, result_collection) {
      if( error ) callback(error)
      else {
        result_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results.length)
        });
      }
    });
};

//find an result by ID
ResultProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, result_collection) {
      if( error ) callback(error)
      else {
        result_collection.findOne({_id: id}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

//find an result by sessionID
ResultProvider.prototype.findBySId = function(sid, callback) {
    this.getCollection(function(error, result_collection) {
      if( error ) callback(error)
      else {
        result_collection.find({sid: sid}, function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};


//save new result
ResultProvider.prototype.save = function(results, callback) {
    this.getCollection(function(error, result_collection) {
      if( error ) callback(error)
      else {
        if( typeof(results.length)=="undefined")
          results = [results];

        for( var i =0;i< results.length;i++ ) {
          result = results[i];
          result.created_at = new Date();
        }

        result_collection.insert(results, function() {
          callback(null, results);
        });
      }
    });
};

// update an result
ResultProvider.prototype.update = function(resultId, results, callback) {
    this.getCollection(function(error, result_collection) {
      if( error ) callback(error);
      else {
        result_collection.update(
					{_id: result_collection.db.bson_serializer.ObjectID.createFromHexString(resultId)},
					results,
					function(error, results) {
						if(error) callback(error);
						else callback(null, results)       
					});
      }
    });
};

//delete result
ResultProvider.prototype.delete = function(resultId, callback) {
  this.getCollection(function(error, result_collection) {
    if(error) callback(error);
    else {
      result_collection.remove(
        {_id: result_collection.db.bson_serializer.ObjectID.createFromHexString(resultId)},
        function(error, result){
          if(error) callback(error);
          else callback(null, result)
        });
      }
  });
};

//delete result
ResultProvider.prototype.deleteAll = function(resultId, callback) {
  this.getCollection(function(error, result_collection) {
    if(error) callback(error);
    else {
      result_collection.remove();
      }
  });
};
//delete result
ResultProvider.prototype.deleteSession = function(sId, callback) {
  this.getCollection(function(error, result_collection) {
    if(error) callback(error);
    else {
      result_collection.remove(
        {sid: sId},
        function(error, result){
          if(error) callback(error);
          else callback(null, result)
        });
      }
  });
};

exports.ResultProvider = ResultProvider;