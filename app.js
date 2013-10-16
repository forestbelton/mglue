var express = require('express');
var sqlite3 = require('sqlite3');
var crypto  = require('crypto');

var app = express.createServer();
var db  = new sqlite3.Database('posts.db');

app.use(express.bodyParser());
app.use(express.static(__dirname + '/public'));

app.use(function(req, res, next) {
    console.log('[' + new Date() + '] ' + req.socket.remoteAddress + ' - ' + req.originalUrl);
    next();
});
app.set('view engine', 'ejs');

app.post('/new', function(req, res) {
    if(!req.param('contents', false)) {
        res.send('Fuck off', 500);
        return;
    }

    var contents = req.param('contents'),
        hash = crypto.createHash('sha1').update(contents + new Date()).digest('hex');
    db.serialize(function() {
        db.run('CREATE TABLE IF NOT EXISTS pastes (hash TEXT, contents TEXT)');
        db.run('INSERT INTO pastes VALUES (?, ?)', hash, contents);
    });

    res.send(JSON.stringify({ hash: hash }));
});

app.get('/:hash', function(req, res) {
    if(!req.params.hash) {
        res.send('Fuck off', 500);
        return;
    }

    var hash = req.params.hash;
    db.serialize(function() {
        db.run('CREATE TABLE IF NOT EXISTS pastes (hash TEXT, contents TEXT)');
        db.get('SELECT contents FROM pastes WHERE hash = ?', hash, function(err, row) {
            if(typeof row !== 'undefined') {
                res.render('layout', {contents: row.contents});
            } else {
                res.send('Paste not found', 404);
            }
        });
    });
});

app.get('*', function(req, res) {
    res.render('layout', {contents: ''});
});

app.listen(3000);
