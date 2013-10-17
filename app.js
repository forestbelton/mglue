var express = require('express'),
    os = require('os'),
    crypto = require('crypto'),
    mongo = require('mongodb');

mongo.MongoClient.connect(process.env.MONGOHQ_URL, function(err, db) {
    if(err)
        throw err;

    db.createCollection('posts', function(err, coll) {
        if(err)
            throw err;

        var app = express.createServer();

        app.use(express.bodyParser());
        app.use(express.static(__dirname + '/public'));

        app.use(function(req, res, next) {
            console.log('[' + new Date() + '] ' + req.socket.remoteAddress + ' - ' + req.originalUrl);
            next();
        });

        app.set('view engine', 'ejs');

        app.post('/new', function(req, res) {
            if(req.param('contents', false) === false) {
                res.send('Fuck off', 500);
                return;
            }
            /* TODO: Handle error on insert here */
            var contents = req.param('contents'),
                hash = crypto.createHash('sha1').update(contents + new Date()).digest('hex');
            coll.insert({hash: hash, contents: contents}, function(err) {
                res.send(JSON.stringify({ hash: hash }));
            });
        });

        app.get('/:hash', function(req, res) {
            if(!req.params.hash) {
                res.send('Fuck off', 500);
                return;
            }
            coll.findOne({hash: req.params.hash}, function(err, doc) {
                if(err) {
                    res.send('Paste not found', 404);
                } else {
                    res.render('layout', {
                        contents:  doc.contents,
                        separator: os.EOL
                    });
                }
            });
        });

        app.get('*', function(req, res) {
            res.render('layout', {contents: '', separator: os.EOL});
        });

        app.listen(process.env.PORT);
    });
});
