
/*
 * GET Content.
 */

var mongoose = require('mongoose');

exports.findOne = function(req, res){
    var id = req.params.id;    
    
    // Clear
    mongoose.models = {};
    mongoose.modelSchemas = {};
    
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

//exports.addContent = function (req, res){
//    
//    if (req.method == 'POST') {
//        
//        // Clear
//        mongoose.models = {};
//        mongoose.modelSchemas = {};
//        
//        var body = '';
//        
//        // get the Posted data & store in var body
//        req.on('data', function (data) {
//            body += data;
//
//            var dictionarySchema = new mongoose.Schema({
//                term: String,
//                ipa: [String],
//                meanings: [{content: String, type: { type: String } }],
//                ethmology: String,
//                related: [String],
//                synonyms: [String],
//                audio: [{ type: { type: String }, file: String}]    
//            });
//
//            // Compile a 'Dictionary' model using the dictionarySchema as the structure.
//            // Mongoose also creates a MongoDB collection called 'Dictionary' for these documents.
//            var Dictionary = mongoose.model('Dictionary', dictionarySchema);
//            var parsedObj = JSON.parse(body);
//            var dictionary = new Dictionary(parsedObj);
//            
//            // Check if word already exist
//            console.log(parsedObj.term);
//            
//            dictionary.save(function (err, respObj) {
//                if(err) console.log(err);
//                res.send([{status: "Successfully Saved" }]);
//            });
//            
//        });
//        
//    }
//    
//    res.setHeader('Content-Type', 'application/json');
//    res.setHeader("Access-Control-Allow-Origin", '*');
//    res.setHeader("Access-Control-Allow-Methods", 'POST');
//    res.statusCode = 200;
//    
//    
//};


//function add(){
//    
//    // Schema
//    var dictionarySchema = new mongoose.Schema({
//        term: String,
//        ipa: [String],
//        meanings: [{content: String, type: { type: String } }],
//        ethmology: String,
//        related: [String],
//        synonyms: [String],
//        audio: [{ type: { type: String }, file: String}]    
//    });
//
//    // Compile a 'Dictionary' model using the dictionarySchema as the structure.
//    // Mongoose also creates a MongoDB collection called 'Dictionary' for these documents.
//    var Dictionary = mongoose.model('Dictionary', dictionarySchema);
//    
//    var dictionary = new Dictionary({
//        term: 'dictionary',
//        ipa: ['/ˈdɪkʃən(ə)ɹi/', '/ˈdɪkʃənɛɹi/'],
//        meanings: [{ content: 'A <a href="http://en.wiktionary.org/wiki/reference%20work">reference work</a> with a list of <a href="http://en.wiktionary.org/wiki/word">words</a> from one or more languages, normally ordered <a href="http://en.wiktionary.org/wiki/alphabetical">alphabetically</a> and explaining each word\'s meaning and sometimes containing information on its etymology, usage, translations, and other data.', type: 'noun'}],
//        etymology: 'Medieval Latin <a href="http://en.wiktionary.org/wiki/dictionarium">dictionarium</a> from Latin <a href="http://en.wiktionary.org/wiki/dictionarius">dictionarius</a> from <a href="http://en.wiktionary.org/wiki/dictio">dictio</a>&nbsp;(“speaking”) from <a href="http://en.wiktionary.org/wiki/dictus">dictus</a>, perfect past participle of <a href="http://en.wiktionary.org/wiki/dico">dīcō</a>&nbsp;(“speak”) + <a href="http://en.wiktionary.org/wiki/-arium">-arium</a>&nbsp;(“room, place”).',
//        related: ['encyclopedic dictionary', 'fictionary '],
//        synonyms: ['wordbook'],
//        audio: [{ type: 'Us', file: 'en-us-dictionary.ogg'}]
//    });
////
//    dictionary.save(function(err, respObj) {
//      if (err) return console.error(err);
//      console.dir(respObj);
//    });
//}