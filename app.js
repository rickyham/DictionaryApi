/**
 * Module dependencies.
 */

var express = require('express'),
    routes = require('./routes'),
    content = require('./routes/content'),
    http = require('http'),
    path = require('path'),
    app = express();

// database connection
var mongoose = require('mongoose');
mongoose.connect("mongodb://dictionary:dictionary121@ds031329.mongolab.com:31329/dictionary");

// Connect to database
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', function callback() {
    console.log("Mother Fucker DB is Connected!");
});

// Environments variables
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/:id', content.retriveContent);

http.createServer(function (req, res) {
    res.writeHead(200, {
        'Content-Type': 'text/plain',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET'
    });

});

app.listen(app.get('port'));

console.log("Listening on port " + app.get('port'));