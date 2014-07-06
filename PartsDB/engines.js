 var crypto = require('crypto')
 var request = require('request');

 var farnelapikey = "a6hmms7wrjnnhawpeffurqxz";
 var farnelBaseImage = "http://fr.farnell.com/productimages/farnell/standard";
 var farnelUrl = "http://api.element14.com//catalog/products?term=any%3A";
 var farnelComplement = "&storeInfo.id=uk.farnell.com&resultsSettings.offset=0&resultsSettings.numberOfResults=25&resultsSettings.refinements.filters=&resultsSettings.responseGroup=large&callInfo.omitXmlSchema=false&callInfo.callback=&callInfo.responseDataFormat=json&callinfo.apiKey=";

 var octopartapikey = "dc6360bd";
 var octopartBaseImage = "";
 var octopartUrl = "http://octopart.com/api/v3/parts/search?callback=?&apikey=";
 var octopartComplement = "&start=0&limit=25&q=";

 engines = function() {};

 engines.prototype.createFarnelUrl = function(query) {
     return farnelUrl + query + farnelComplement + farnelapikey;
 }
 engines.prototype.createOctoUrl = function(query) {
     return octopartUrl + octopartapikey + octopartComplement + query;
 }

 engines.prototype.octoSearch = function(ref, brand, qty, box, callback) {
     var query = encodeURIComponent(ref + "+" + brand);
     var url = this.createOctoUrl(query);
     console.log(url)
     request({
         url: url,
         json: true,
         async: false,
     }, function(error, response, body) {
         var parts = [];
         var sid = crypto.randomBytes(20).toString('hex');
         if (!error && response.statusCode === 200) {

         }
         callback(parts, error, url, sid);
     });
 }


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
                         "specs": body.keywordSearchReturn.products[i]["attributes"],
                         "image": farnelBaseImage + body.keywordSearchReturn.products[i].image.baseName,
                     });
                 }
             }
         }
         callback(parts, error, url, sid);
     });
 }

 exports.engines = engines;