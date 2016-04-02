/**
 * Created by randy on 3/21/16.
 */
var express = require('express'),
    app = express(),
    engines = require('consolidate'),
    MongoClient = require('mongodb').MongoClient,
    bodyParser = require('body-parser'),
    assert = require('assert');

app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect('mongodb://localhost:27017/video' , function (err, db) {
    
    assert.equal(null, err);
    console.log('Successfully connected to MongoDB');
    //Error Handler
    function errorHandler(err, req, res, next) {
        console.error(err.message);
        console.error(err.stack);
        res.status(500).render('error_template', { error: err });
    }
    
    app.get('/movies', function (req, res, next) {
        db.collection('movies').find({}).toArray(function (err, docs) {
            res.render('movies', { 'movies': docs });
        });
    });
    
    app.post('/movies', function (req, res, next) {
        var movie = req.body.movie;
        if (typeof movie === 'undefined') {
            next ('Please enter a movie!');
        } else {
            res.send('You have added ' + movie);
        }
    });

    // app.use(function (req, res) {
    //     res.sendStatus(404);
    // });

    app.use(errorHandler);

    var server = app.listen(3000, function () {
        var port = server.address().port;
        console.log('Express server listening on port %s.', port);
    })
})