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

    // Schema
    var dictionarySchema = new mongoose.Schema({
        term: String,
        ipa: [String],
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

    });

    // Compile a 'Dictionary' model using the dictionarySchema as the structure.
    // Mongoose also creates a MongoDB collection called 'Dictionary' for these documents.
    var Dictionary = mongoose.model('Dictionary', dictionarySchema);

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