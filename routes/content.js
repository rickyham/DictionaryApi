/*
 * Manage Content.
 */

var App = App || {};

App.ManageContent = (function () {

    var _private = {},
        _public = {};

    _public.setHeaderInfo = function (res, obj) {
        obj.methods = obj.methods || 'GET, PUT, POST';
        res.setHeader('Content-Type', 'application/json');
        res.setHeader("Access-Control-Allow-Origin", '*');
        res.setHeader("Access-Control-Allow-Methods", obj.methods);
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
                if (!resp || !resp.suggestions) {

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

                } else if (resp.suggestions) {

                    App.ManageContent.setHeaderInfo(res, {
                        status: 200,
                        send: resp
                    });

                } else {

                    App.ManageContent.setHeaderInfo(res, {
                        status: 200,
                        send: {
                            request: id,
                            result: null,
                        }
                    });

                }

            });

            // Found content from database – send this!
        } else {
            App.ManageContent.setHeaderInfo(res, {
                status: 200,
                send: respObjDb
            });
        }

    });
};


exports.logQuery = function (req, res) {

    // Clear
    mongoose.models = {};
    mongoose.modelSchemas = {};

    // Schema
    var logQuerySchema = new mongoose.Schema({
        content: {
            selected: String,
            context: String,
            contextHtml: String,
            closeContext: String
        },
        meta: {
            uuid: String,
            appVersion: String,
            timestamp: String,
            page: {
                domain: String,
                url: String,
                title: String,
                referrer: String,
            },
            eventType: String,
            location: {
                area_code: String,
                city: String,
                country_code: String,
                country_name: String,
                ip: String,
                latitude: Number,
                longitude: Number,
                metro_code: String,
                region_code: String,
                region_name: String,
                zipcode: String
            },
            navigator: {
                appCodeName: String,
                appName: String,
                appVersion: String,
                cookieEnabled: Boolean,
                doNotTrack: String,
                language: String,
                onLine: Boolean,
                platform: String,
                product: String,
                productSub: String,
                userAgnt: String,
                vendor: String,
                vendorSub: String
            },
            options: {
                automaticallyPlaySound: Boolean,
                popupClickKey: String,
                hideWithEscape: Boolean,
                showExamples: Boolean,
                showPOS: Boolean,
                showIPA: Boolean,
                showRelated: Boolean,
                showSynonyms: Boolean,
                showAntonyms: Boolean,
                showLinks: Boolean,
                showEtymology: Boolean
            }

        }

    });

    var LogQuery = mongoose.model('QueryLogs', logQuerySchema);

    logQuery = new LogQuery(req.body);

    logQuery.save(function (err) {
        if (err) return handleError(err);
        LogQuery.findById(logQuery, function (err, doc) {
            if (err) return handleError(err);
            App.ManageContent.setHeaderInfo(res, {
                status: 200,
                methods: 'POST',
                send: {
                    status: 'success'
                }
            });
        });
    });

};