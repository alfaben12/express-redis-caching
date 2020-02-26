const express = require('express');
const app = express();
const request = require('superagent');
const redis = require('redis');
const client = redis.createClient();
const REDISKEY = 'WRI:testing'

function getUserRepos(req, res) {
    request.get(`https://my-json-server.typicode.com/typicode/demo/posts`, function (err, response) {
        if (err) throw err;
        var data = response.text

        client.setex(REDISKEY, 3600, data); // menyimpan data di redis dengan format string

        res.json(JSON.parse(data));
    });
};

function cache(req, res, next) {
    client.get(REDISKEY, function (err, data) {
        if (err) throw err;

        if (data != null) {
            res.send(JSON.parse(data));
        } else {
            next();
        }
    });
}

app.get('/', cache, getUserRepos);

app.listen(3001, function () {
    console.log('express-redis listen on port 3001!')
});