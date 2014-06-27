/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , PartProvider = require('./partprovider').PartProvider;

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.set('view options', {layout: false});
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(require('stylus').middleware(__dirname + '/public'));
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

var partProvider = new PartProvider('localhost', 27017);

//Routes

//index
app.get('/', function(req, res){
  partProvider.findAll(function(error, emps){
      res.render('index', {
            title: 'Parts',
            parts:emps
        });
  });
});

//new part
app.get('/part/new', function(req, res) {
    res.render('part_new', {
        title: 'New Part'
    });
});

//save new part
app.post('/part/new', function(req, res){
    partProvider.save({
        title: req.param('ref'),
        descr: req.param('descr')
    }, function( error, docs) {
        res.redirect('/')
    });
});

//update an part
app.get('/part/:id/edit', function(req, res) {
	partProvider.findById(req.param('_id'), function(error, part) {
		res.render('part_edit',
		{ 
			title: part.ref,
			part: part
		});
	});
});

//save updated part
app.post('/part/:id/edit', function(req, res) {
	partProvider.update(req.param('_id'),{
		title: req.param('ref'),
		descr: req.param('descr')
	}, function(error, docs) {
		res.redirect('/')
	});
});

//delete an part
app.post('/part/:id/delete', function(req, res) {
	partProvider.delete(req.param('_id'), function(error, docs) {
		res.redirect('/')
	});
});

app.listen(process.env.PORT || 3000);
