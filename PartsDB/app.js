/**
 * Module dependencies.
 */

 var express = require('express')
 var request = require('request')
 var routes = require('./routes')
 , user = require('./routes/user')
 , http = require('http')
 , path = require('path')
 , PackageProvider = require('./packageprovider').PackageProvider
 , ResultProvider = require('./resultprovider').ResultProvider
 , engines = require('./engines').engines
 , PartProvider = require('./partprovider').PartProvider;
 var app = express();
 var host = "localhost"
 var port = 27017
 var farnellapikey = "a6hmms7wrjnnhawpeffurqxz";
 var farnelBaseImage = "http://fr.farnell.com/productimages/farnell/standard";
 // app.db= new Db('node-mongo-part', new Server(host, port, {safe: true}, {auto_reconnect: true}, {}));
 // app.db.open(function(){});
 var tingo = require("tingodb")({});
 app.db = new tingo.Db('./db/', {} );

 app.configure(function(){
 	app.set('port', process.env.PORT || 3000);
 	app.set('views', __dirname + '/views');
 	app.set('view engine', 'jade');
 	app.set("view options", {layout: false});
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

 var partProvider = new PartProvider(app.db);
 var packageProvider = new PackageProvider(app.db);
 var resultProvider = new ResultProvider(app.db);
 var engines = new engines();

//Routes

//index
app.get('/', function(req, res){
	partProvider.findAll(function(error, parts){
		if( parts === undefined ){
			parts = []
		}
		packageProvider.findAll(function(error, packs){
			if( packs === undefined ){
				packs = []
			}
			res.render('index', {
				title: 'Parts',
				parts:parts,
				packages:packs
			});
		});
	});
});

// init of packages
app.get('/packages/init', function(req, res){
	var p = [ {"ref":"2FF"}, {"ref":"3FF"}, {"ref":"4FF"}, {"ref":"BGA"}, {"ref":"D2PAK"}, {"ref":"D3PAK"}, {"ref":"DDPAK"}, {"ref":"DPAK"}, {"ref":"DIP"}, {"ref":"DO-204AC"}, {"ref":"DO-214AA"}, {"ref":"DO-214AB"}, {"ref":"DO-214AC"}, {"ref":"DO-15"}, {"ref":"DO-35"}, {"ref":"DO-41"}, {"ref":"DPACK"}, {"ref":"E-Line"}, {"ref":"EEP"}, {"ref":"EIA"}, {"ref":"Embedded-SIM"}, {"ref":"FF"}, {"ref":"HC-49/U-S"}, {"ref":"LFCSP"}, {"ref":"LGA"}, {"ref":"MELF"}, {"ref":"Micro"}, {"ref":"Micro-MELF"}, {"ref":"Micro3"}, {"ref":"Micro-SIM"}, {"ref":"Mini-DIP"}, {"ref":"Mini-MELF"}, {"ref":"Mini-SIM"}, {"ref":"MSE"}, {"ref":"MSOP"}, {"ref":"Nano-SIM"}, {"ref":"PP3"}, {"ref":"PP9"}, {"ref":"QFN"}, {"ref":"QIP"}, {"ref":"RM"}, {"ref":"SC-104A"}, {"ref":"SC-108A"}, {"ref":"SC-109B"}, {"ref":"SC-109D"}, {"ref":"SC-110A"}, {"ref":"SC-116A"}, {"ref":"SC-59"}, {"ref":"SC-70"}, {"ref":"SC-74A"}, {"ref":"SC-79"}, {"ref":"SC-90A"}, {"ref":"SIP"}, {"ref":"SMA"}, {"ref":"SMB"}, {"ref":"SMC"}, {"ref":"SMD-220"}, {"ref":"SMD35"}, {"ref":"SMini3-G1-B"}, {"ref":"SNAPHAT"}, {"ref":"SO"}, {"ref":"SOD-110"}, {"ref":"SOD-128"}, {"ref":"SOD-323"}, {"ref":"SOD-723"}, {"ref":"SOD-80"}, {"ref":"SOD-87"}, {"ref":"SOIC"}, {"ref":"SOJ"}, {"ref":"SON"}, {"ref":"SOP-4"}, {"ref":"SOT-1040-1"}, {"ref":"SOT-1193"}, {"ref":"SOT-223"}, {"ref":"SOT-23"}, {"ref":"SOT-25"}, {"ref":"SOT-26"}, {"ref":"SOT-28"}, {"ref":"SOT-323"}, {"ref":"SOT-363"}, {"ref":"SOT-523F"}, {"ref":"SOT-563"}, {"ref":"SOT-753"}, {"ref":"SOT-762-1"}, {"ref":"SOT-886"}, {"ref":"SOT-902"}, {"ref":"SOT-923"}, {"ref":"SPM23"}, {"ref":"TO-205AD"}, {"ref":"TO-220AB"}, {"ref":"TO-220AC"}, {"ref":"TO-220F"}, {"ref":"TO-226"}, {"ref":"TO-252"}, {"ref":"TO-261AA"}, {"ref":"TO-263"}, {"ref":"TO-268"}, {"ref":"TO-279"}, {"ref":"TO-277A"}, {"ref":"TO-3"}, {"ref":"TO-39"}, {"ref":"TO-92"}, {"ref":"TO-93"}, {"ref":"TO-Leadless"}, {"ref":"TO-PMOD-7"}, {"ref":"TSOC"}, {"ref":"TSSOP"}, {"ref":"TQFP"}, {"ref":"uMAX"}, {"ref":"uSOP"}, {"ref":"UQFN"}, {"ref":"VQFN"}, {"ref":"WOG"}, {"ref":"0603"}, {"ref":"1005"}, {"ref":"1608"}, {"ref":"2012"}, {"ref":"2518"}, {"ref":"3216"}, {"ref":"3225"}, {"ref":"4516"}, {"ref":"4532"}, {"ref":"5025"}, {"ref":"6432"}]
	packageProvider.deleteAll();
	packageProvider.save(p, function( error, docs) {
		res.redirect('/')
	});
});
// list of packages
app.get('/packages/list', function(req, res){
	packageProvider.findAll(function(error, packs){
		res.setHeader('Content-Type', 'application/json');
		res.end(JSON.stringify(packs));
	});
});
app.get('/packages/list/stringarray', function(req, res){
	packageProvider.findAll(function(error, packs){
		res.setHeader('Content-Type', 'application/json');
		var s = "["
		for(p in packs){
			s += "\""+packs[p].ref+"\","
		}
		s += "]"
		res.end(s);
	});
});
// clear all
app.get('/clear/all', function(req, res){
	partProvider.deleteAll(function(err){});
	resultProvider.deleteAll(function(err){});
	res.redirect('/')
});
// status
app.get('/status', function(req, res){
	partProvider.count(function(err, partcount){
		packageProvider.count(function(err, packagecount){
			resultProvider.count(function(err, resultcount){
				res.setHeader('Content-Type', 'application/json');
				res.end(JSON.stringify({ parts: partcount, packages: packagecount, results: resultcount}));
			});
		});
	});
});

//result
app.get('/result/:id/edit', function(req, res) {
	resultProvider.findById(req.param('id'), function(error, part) {
		partProvider.save(
			part, 
			function( error, docs) {
				resultProvider.deleteSession(part.sid, function(error, result) {
					res.redirect('/part/'+part._id+'/edit')
				});
			});

	});
});
//wizard
app.get('/wizard', function(req, res) {
	res.render('wizard', {
		title: 'Wizard',
	});
});

//wizard
app.post('/wizard', function(req, res) {
	var search = {};
	search.ref = req.param("ref");
	search.brand = req.param("brand");
	search.qty = req.param("qty");
	search.box = req.param("box");
	//search
	engines.farnelSearch(search.ref, search.brand, search.qty, search.box, function(parts, error, url, sid){
		// and render results
		resultProvider.save(
			parts
			, function( error, docs) {
				resultProvider.count(function(err, count){console.log("count "+count)}),
				res.render('wizard', {
					title: 'Wizard',
					search: search,
					parts: parts,
				});
			});
	});
	
});

//new part
app.get('/part/new', function(req, res) {
	packageProvider.findAll(function(error, packs){
		res.render('part_new', {
			title: 'New Part',
			packages:packs
		});
	});
});

//save new part
app.post('/part/new', function(req, res){
	partProvider.save({
		ref: req.param('ref'),
		descr: req.param('descr'),
		pack: req.param('pack'),
		qty: req.param('qty'),
		price: req.param('price'),
		box: req.param('box'),
		brand: req.param('brand')
	}, function( error, docs) {
		res.redirect('/')
	});
});

//view a part
app.get('/part/:id/view', function(req, res) {
	var props = [];
	partProvider.findById(req.param('id'), function(error, part) {
		for(var p in part){
			props.push({"prop":p, "val":part[p]})
		}
		res.render('part_view',
		{ 
			title: part.ref,
			part: part,
			props: props
		});
	});
});
//update a part
app.get('/part/:id/edit', function(req, res) {
	var props = [];
	partProvider.findById(req.param('id'), function(error, part) {
		for(var p in part){
			props.push({"prop":p, "val":part[p]})
		}
		res.render('part_edit',
		{ 
			title: part.ref,
			part: part,
			props: props
		});
	});
});

//save updated part
app.post('/part/:id/edit', function(req, res) {
	partProvider.findById(req.param('id'), function(error, part) {
		part.ref= req.param('ref'),
		part.descr= req.param('descr'),
		part.pack= req.param('pack'),
		part.qty= req.param('qty'),
		part.price= req.param('price'),
		part.box= req.param('box'),
		part.brand= req.param('brand')
		partProvider.update(req.param('id'),
			part	
			, function(error, docs) {
				res.redirect('/')
			});
	});
});

//delete an part
app.post('/part/:id/delete', function(req, res) {
	partProvider.delete(req.param('_id'), function(error, docs) {
		res.redirect('/')
	});
});

app.listen(process.env.PORT || 3000);


