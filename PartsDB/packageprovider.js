var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

PackageProvider = function(db) {
  this.db=db;
};



PackageProvider.prototype.getCollection= function(callback) {
  this.db.collection('packages', function(error, package_collection) {
    if( error ) callback(error);
    else callback(null, package_collection);
  });
};

//find all packages
PackageProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, package_collection) {
      if( error ) callback(error)
      else {
        package_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

//find an package by ID
PackageProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, package_collection) {
      if( error ) callback(error)
      else {
        package_collection.findOne({_id: package_collection.db.bson_serializer.ObjectID.createFromHexString(id)}, function(error, result) {
          if( error ) callback(error)
          else callback(null, result)
        });
      }
    });
};

//count results
PackageProvider.prototype.count = function(callback) {
    this.getCollection(function(error, package_collection) {
      if( error ) callback(error)
      else {
        package_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results.length)
        });
      }
    });
};

//save new package
PackageProvider.prototype.save = function(packages, callback) {
    this.getCollection(function(error, package_collection) {
      if( error ) callback(error)
      else {
        if( typeof(packages.length)=="undefined")
          packages = [packages];

        for( var i =0;i< packages.length;i++ ) {
          packages[i].created_at = new Date();
        }
          console.dir(packages)

        package_collection.insert(packages, function() {
          callback(null, packages);
        });
      }
    });
};

// update an package
PackageProvider.prototype.update = function(packageId, packages, callback) {
    this.getCollection(function(error, package_collection) {
      if( error ) callback(error);
      else {
        package_collection.update(
					{_id: package_collection.db.bson_serializer.ObjectID.createFromHexString(packageId)},
					packages,
					function(error, packages) {
						if(error) callback(error);
						else callback(null, packages)       
					});
      }
    });
};

//delete package
PackageProvider.prototype.delete = function(packageId, callback) {
  this.getCollection(function(error, package_collection) {
    if(error) callback(error);
    else {
      package_collection.remove(
        {_id: package_collection.db.bson_serializer.ObjectID.createFromHexString(packageId)},
        function(error, package){
          if(error) callback(error);
          else callback(null, package)
        });
      }
  });
};

//delete all packages
PackageProvider.prototype.deleteAll = function(callback) {
  this.getCollection(function(error, package_collection) {
    if(error) callback(error);
    else {
      package_collection.remove({ });
      }
  });
};

exports.PackageProvider = PackageProvider;