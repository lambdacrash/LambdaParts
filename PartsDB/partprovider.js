var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

PartProvider = function(db) {
  this.db=db;
};


PartProvider.prototype.getCollection= function(callback) {
  this.db.collection('parts', function(error, part_collection) {
    if( error ) callback(error);
    else callback(null, part_collection);
  });
};

//find all parts
PartProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, part_collection) {
      if( error ) callback(error)
      else {
        part_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

//find an part by ID
PartProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, part_collection) {
      if( error ) callback(error)
      else {
        part_collection.findOne({_id: part_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};


//save new part
PartProvider.prototype.save = function(parts, callback) {
    this.getCollection(function(error, part_collection) {
      if( error ) callback(error)
      else {
        if( typeof(parts.length)=="undefined")
          parts = [parts];

        for( var i =0;i< parts.length;i++ ) {
          part = parts[i];
          part.created_at = new Date();
        }

        part_collection.insert(parts, function() {
          callback(null, parts);
        });
      }
    });
};

// update an part
PartProvider.prototype.update = function(partId, parts, callback) {
    this.getCollection(function(error, part_collection) {
      if( error ) callback(error);
      else {
        part_collection.update(
					{_id: part_collection.db.bson_serializer.ObjectID.createFromHexString(partId)},
					parts,
					function(error, parts) {
						if(error) callback(error);
						else callback(null, parts)       
					});
      }
    });
};

//delete part
PartProvider.prototype.delete = function(partId, callback) {
	this.getCollection(function(error, part_collection) {
		if(error) callback(error);
		else {
			part_collection.remove(
				{_id: part_collection.db.bson_serializer.ObjectID.createFromHexString(partId)},
				function(error, part){
					if(error) callback(error);
					else callback(null, part)
				});
			}
	});
};

exports.PartProvider = PartProvider;