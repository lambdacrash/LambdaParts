 var crypto = require('crypto')
 var request = require('request');
 var octopart = require("octopart");
 var easySoap = require('easysoap');

 var farnelapikey = "a6hmms7wrjnnhawpeffurqxz";
 var farnelBaseImage = "http://fr.farnell.com/productimages/farnell/standard";
 var farnelUrl = "http://api.element14.com//catalog/products?term=any%3A";
 var farnelComplement = "&storeInfo.id=uk.farnell.com&resultsSettings.offset=0&resultsSettings.numberOfResults=25&resultsSettings.refinements.filters=&resultsSettings.responseGroup=large&callInfo.omitXmlSchema=false&callInfo.callback=&callInfo.responseDataFormat=json&callinfo.apiKey=";

 var octopartapikey = "dc6360bd";
 var octopartBaseImage = "";
 var octopartUrl = "http://octopart.com/api/v3/parts/search?callback=?&apikey=";
 var octopartComplement = "&start=0&limit=25";
 octopart.apikey = octopartapikey;

 engines = function() {};

 engines.prototype.createFarnelUrl = function(query) {
     return farnelUrl + query + farnelComplement + farnelapikey;
 }
 engines.prototype.createOctoUrl = function(query) {
     return octopartUrl + octopartapikey + octopartComplement + query;
 }

 engines.prototype.octoSearch = function(ref, brand, qty, box, callback) {
     var queries = [{
         reference: '1',
         mpn_or_sku: ref,
         brand: brand
     }, ];

     octopart.parts.match(queries, {
         exact_only: true,
         show: ['uid', 'mpn', 'manufacturer', 'short_description', 'descriptions', 'datasheets', 'reference_designs', 'cad_models', 'specs']
     }).success(function(body) {
         var uids = "";
         var ids = [];
         for (var i = 0; i < body.results.length; i++) {
             console.log("Result", i, body.results[i].items);
             console.log("-------------------------------")
             console.dir(body.results[i].items)

             for (var j = 0; j < body.results[i].items.length; j++) {
                 console.log(body.results[i].items[j].uid)
                 uids += "uid%5B%5D=" + body.results[i].items[j].uid + "&"
                 ids.push(body.results[i].items[j].uid)
             }
         }
         octopart.parts.get(ids, {
             exact_only: true,
             show: ['uid', 'mpn', 'manufacturer', 'short_description', 'descriptions', 'datasheets', 'reference_designs', 'cad_models', 'specs']
         }).success(function(body) {
             console.log("OCTOPART")
             console.dir(body)
         }).failure(function(err) {
             console.log(err)
         })

         uids = uids.substring(0, uids.length - 1);
         var url = "http://octopart.com/api/v3/parts/get_multi/";
         url += "?apikey=" + octopartapikey + "&";
         url += uids
         url += "&include[]=short_description";
         url += "&include[]=descriptions";
         url += "&include[]=reference_designs";
         url += "&include[]=specs";
         url += "&include[]=cad_models";
         url += "&callback=?";
         console.log(url)
         request({
             url: url,
             json: true,
         }, function(err, response, body) {
             var b = body.substring(2)
             b = b.substring(0, b.length - 1)
             console.dir(b)
             console.dir(JSON.parse(b))
         })
     }).failure(function(err) {
         console.log("Ooops....", err);
     });
 }

 var clientParams = {
     host: 'api.mouser.com',
     path: '/service/searchapi.asmx',
     wsdl: '/service/searchapi.asmx?WSDL',
     header: [{
         'ParterID': 'afd744a8-f773-4a0f-997b-a0db3d4718cd'
     }]
 };
 //soap client options
 var clientOptions = {
     secure: false //is https or http
 };

 engines.prototype.farnelSearch = function(ref, brand, qty, box, callback) {
     var query = encodeURIComponent(ref + " " + brand);
     var url = this.createFarnelUrl(query);
     request({
         url: url,
         json: true,
         async: false,
     }, function(error, response, body) {
         var parts = [];
         var sid = crypto.randomBytes(20).toString('hex');
         if (!error && response.statusCode === 200) {
             if (body.keywordSearchReturn.numberOfResults >= 1) {
                 for (var i = 0; i < body.keywordSearchReturn.products.length; i++) {
                     var newRef = ref;
                     var re = new RegExp(".*?\\s(" + ref + ".*?)\\s", "gi");
                     var r = re.exec(body.keywordSearchReturn.products[i].displayName)
                     if (r != undefined && r.length == 2)
                         newRef = r[1];
                     var price = 0;
                     var prices = body.keywordSearchReturn.products[i].prices;
                     if (prices && prices.length >= 1)
                         price = prices[0].cost
                     var img = "";
                     if (body.keywordSearchReturn.products[i].image) {
                         img = farnelBaseImage + body.keywordSearchReturn.products[i].image.baseName;
                     }
                     parts.push({
                         "_id": crypto.randomBytes(20).toString('hex'),
                         "sid": sid,
                         "qty": qty,
                         "pack": "",
                         "box": box,
                         "price": price,
                         "ref": body.keywordSearchReturn.products[i].translatedManufacturerPartNumber,
                         "brand": body.keywordSearchReturn.products[i].brandName,
                         "vendor": body.keywordSearchReturn.products[i].vendorName,
                         "datasheets": body.keywordSearchReturn.products[i].datasheets,
                         "descr": body.keywordSearchReturn.products[i].displayName,
                         "specs": body.keywordSearchReturn.products[i]["attributes "],
                         "image": img,
                     });
                 }
             }
         }
         callback(parts, error, url, sid);
     });
 }

 engines.prototype.mouserSearch = function(ref, brand, qty, box, callback) {
     var query = encodeURIComponent(ref + " " + brand);
     var url = this.createFarnelUrl(query);
     var SoapClient = new easySoap.Client(clientParams, clientOptions);

     SoapClient.call({
         'method': 'soapMethod2',
         'params': {
             'mouserPartNumber': 'UA78M33CKCS',
         }
     })
         .done(

             //success
             function(res) {
                 res.data // response data as array
                 console.dir(res.data)
                 res.response // full response data (including xml)
                 res.header // response header
             },

             //method fail
             function(err) {
                 console.log(err);
             }
     );
 }

 exports.engines = engines;