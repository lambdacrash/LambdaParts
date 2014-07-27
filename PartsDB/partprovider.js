var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;

PartProvider = function(db) {
    this.db = db;
};


PartProvider.prototype.getCollection = function(callback) {
    this.db.collection('parts', function(error, part_collection) {
        if (error) callback(error);
        else callback(null, part_collection);
    });
};

//find all parts
PartProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, part_collection) {
        if (error) callback(error)
        else {
            part_collection.find().toArray(function(error, results) {
                if (error) callback(error)
                else callback(null, results)
            });
        }
    });
};

//find an part by ID
PartProvider.prototype.findById = function(id, callback) {
    this.getCollection(function(error, part_collection) {
        if (error) callback(error)
        else {
            part_collection.findOne({
                _id: id
            }, function(error, result) {
                if (error) callback(error)
                else callback(null, result)
            });
        }
    });
};


//save new part
PartProvider.prototype.save = function(parts, callback) {
    this.getCollection(function(error, part_collection) {
        if (error) callback(error)
        else {
            if (typeof(parts.length) == "undefined")
                parts = [parts];

            for (var i = 0; i < parts.length; i++) {
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
        if (error) callback(error);
        else {
            part_collection.update({
                    _id: partId
                },
                parts,
                function(error, parts) {
                    if (error) callback(error);
                    else callback(null, parts)
                });
        }
    });
};
//count results
PartProvider.prototype.count = function(callback) {
    this.getCollection(function(error, part_collection) {
        if (error) callback(error)
        else {
            part_collection.find().toArray(function(error, results) {
                if (error) callback(error)
                else callback(null, results.length)
            });
        }
    });
};
//delete part
PartProvider.prototype.deleteAll = function(callback) {
    this.getCollection(function(error, part_collection) {
        if (error) callback(error);
        else {
            part_collection.remove();
        }
    });
};

//search
PartProvider.prototype.search = function(query, callback) {
    this.getCollection(function(error, part_collection) {
        if (error) callback(error)
        else {
            part_collection.find({
                $or: [{
                    ref: new RegExp(query, 'gi')
                }, {
                    descr: new RegExp(query, 'gi')
                }, {
                    descriptions: new RegExp(query, 'gi')
                }]
            }).toArray(function(error, results) {
                if (error) callback(error)
                else callback(null, results)
            });
        }
    });
};
//delete part
PartProvider.prototype.delete = function(partId, callback) {
    this.getCollection(function(error, part_collection) {
        if (error) callback(error);
        else {
            part_collection.remove({
                    _id: partId
                },
                function(error, part) {
                    if (error) callback(error);
                    else callback(null, part)
                });
        }
    });
};

exports.PartProvider = PartProvider;