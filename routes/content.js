<<<<<<< HEAD
/*
 * Manage Content.
 */

var App = App || {};

App.ManageContent = (function () {

    var _private = {},
        _public = {};

    _public.setHeaderInfo = function (res, obj) {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader("Access-Control-Allow-Origin", '*');
        res.setHeader("Access-Control-Allow-Methods", 'GET,PUT,POST');
        res.statusCode = obj.status;
        res.send(obj.send);
    };

    _public.sendAjaxRequest = function (url, method, data, callback) {
        
        var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
        var xmlhttp = new XMLHttpRequest();

        xmlhttp.onreadystatechange = function () {
        
            switch (xmlhttp.readyState) {

            case 1:
                //  console.log("server connection established");
                break;
            case 2:
                //   console.log("request recieved");
                break;
            case 3:
                //   console.log("proccessing request");
                break;
            case 4:
                    
                if (xmlhttp.status === 200) {
                    callback([xmlhttp.responseText]);
                }
                break;

            }

        };

        xmlhttp.open(method, url, true);

        if (data !== undefined && data !== '') {
            xmlhttp.send(data);
        } else {
            xmlhttp.send();
        }

    };

    return _public;

}());

var mongoose = require('mongoose');

exports.retriveContent = function (req, res) {
    var id = req.params.id;

    // Clear
    mongoose.models = {};
    mongoose.modelSchemas = {};

=======

/*
 * GET Content.
 */

var mongoose = require('mongoose');

exports.findOne = function(req, res){
    var id = req.params.id;    
    
    // Clear
    mongoose.models = {};
    mongoose.modelSchemas = {};
    
>>>>>>> ba5f9410477471a5f851a1a57abcd6a757b2cf9e
    // Schema
    var dictionarySchema = new mongoose.Schema({
        term: String,
        ipa: [String],
<<<<<<< HEAD
        meanings: [{
            content: String,
            type: {
                type: String
            }
        }],
        ethmology: String,
        related: [String],
        synonyms: [String],
        audio: [{
            type: {
                type: String
            },
            file: String
        }]
=======
        meanings: [{content: String, type: { type: String } }],
        ethmology: String,
        related: [String],
        synonyms: [String],
        audio: [{ type: { type: String }, file: String}]    
>>>>>>> ba5f9410477471a5f851a1a57abcd6a757b2cf9e
    });

    // Compile a 'Dictionary' model using the dictionarySchema as the structure.
    // Mongoose also creates a MongoDB collection called 'Dictionary' for these documents.
    var Dictionary = mongoose.model('Dictionary', dictionarySchema);
<<<<<<< HEAD

    // Find a single dictionary item by "term".
    Dictionary.findOne({
        term: id
    }, function (err, respObjDb) {
        if (err) {
            console.log(err);
        }

        //No data found
        if (!respObjDb) {

            // If there is no data in our database – qurey open APIs
            var dictionaryApiUrl = 'http://dictionary-lookup.org/%query%',
                url = dictionaryApiUrl.replace('%query%', id);

            // Send ajax req to open API
            App.ManageContent.sendAjaxRequest(url, "GET", "", function (resp) {
                resp = JSON.parse(resp);

                // No data found
                if (!resp) {

                    App.ManageContent.setHeaderInfo(res, {
                        status: 200,
                        send: {
                            request: id,
                            result: null
                        }
                    });

                } else {

                    // Save content to database
                    var dictionary = new Dictionary(resp);

                    dictionary.save(function (err, resp) {
                        if (err) {
                            console.log(err);
                        }

                        App.ManageContent.setHeaderInfo(res, {
                            status: 200,
                            send: resp
                        });

                    });

                }

            });

            // Found data from database – send this!
        } else {
            App.ManageContent.setHeaderInfo(res, {
                status: 200,
                send: respObjDb
            });
        }

    });
};
=======
    
    // Find a single dictionary item by "term".
    Dictionary.findOne({ term: id }, function(err, respObj) {
        if (err){
            console.log("no data to return");
        }
        if (!respObj){ 
            console.log(respObj);
            res.setHeader('Content-Type', 'application/json');
            res.setHeader("Access-Control-Allow-Origin", '*');
            res.setHeader("Access-Control-Allow-Methods", 'GET,PUT,POST');
            res.statusCode = 200;
            res.send({ request: id , result: null });
        }else{           
            res.setHeader('Content-Type', 'application/json');
            res.setHeader("Access-Control-Allow-Origin", '*');
            res.setHeader("Access-Control-Allow-Methods", 'GET,PUT,POST');
            res.statusCode = 200;
            res.send(respObj);

        }
          
    });
};

exports.addContent = function (req, res){
    
    if (req.method == 'POST') {
        
        // Clear
        mongoose.models = {};
        mongoose.modelSchemas = {};
        
        var body = '';
        
        // get the Posted data & store in var body
        req.on('data', function (data) {
            body += data;

            var dictionarySchema = new mongoose.Schema({
                term: String,
                ipa: [String],
                meanings: [{content: String, type: { type: String } }],
                ethmology: String,
                related: [String],
                synonyms: [String],
                audio: [{ type: { type: String }, file: String}]    
            });

            // Compile a 'Dictionary' model using the dictionarySchema as the structure.
            // Mongoose also creates a MongoDB collection called 'Dictionary' for these documents.
            var Dictionary = mongoose.model('Dictionary', dictionarySchema);
            var parsedObj = JSON.parse(body);
            var dictionary = new Dictionary(parsedObj);
            
            // Check if word already exist
            console.log(parsedObj.term);
            
            dictionary.save(function (err, respObj) {
                if(err) console.log(err);
                res.send([{status: "Successfully Saved" }]);
            });
            
        });
        
    }
    
    res.setHeader('Content-Type', 'application/json');
    res.setHeader("Access-Control-Allow-Origin", '*');
    res.setHeader("Access-Control-Allow-Methods", 'POST');
    res.statusCode = 200;
    
    
};


function add(){
    
    // Schema
    var dictionarySchema = new mongoose.Schema({
        term: String,
        ipa: [String],
        meanings: [{content: String, type: { type: String } }],
        ethmology: String,
        related: [String],
        synonyms: [String],
        audio: [{ type: { type: String }, file: String}]    
    });

    // Compile a 'Dictionary' model using the dictionarySchema as the structure.
    // Mongoose also creates a MongoDB collection called 'Dictionary' for these documents.
    var Dictionary = mongoose.model('Dictionary', dictionarySchema);
    
    var dictionary = new Dictionary({
        term: 'dictionary',
        ipa: ['/ˈdɪkʃən(ə)ɹi/', '/ˈdɪkʃənɛɹi/'],
        meanings: [{ content: 'A <a href="http://en.wiktionary.org/wiki/reference%20work">reference work</a> with a list of <a href="http://en.wiktionary.org/wiki/word">words</a> from one or more languages, normally ordered <a href="http://en.wiktionary.org/wiki/alphabetical">alphabetically</a> and explaining each word\'s meaning and sometimes containing information on its etymology, usage, translations, and other data.', type: 'noun'}],
        etymology: 'Medieval Latin <a href="http://en.wiktionary.org/wiki/dictionarium">dictionarium</a> from Latin <a href="http://en.wiktionary.org/wiki/dictionarius">dictionarius</a> from <a href="http://en.wiktionary.org/wiki/dictio">dictio</a>&nbsp;(“speaking”) from <a href="http://en.wiktionary.org/wiki/dictus">dictus</a>, perfect past participle of <a href="http://en.wiktionary.org/wiki/dico">dīcō</a>&nbsp;(“speak”) + <a href="http://en.wiktionary.org/wiki/-arium">-arium</a>&nbsp;(“room, place”).',
        related: ['encyclopedic dictionary', 'fictionary '],
        synonyms: ['wordbook'],
        audio: [{ type: 'Us', file: 'en-us-dictionary.ogg'}]
    });
//
    dictionary.save(function(err, respObj) {
      if (err) return console.error(err);
      console.dir(respObj);
    });
}
>>>>>>> ba5f9410477471a5f851a1a57abcd6a757b2cf9e
