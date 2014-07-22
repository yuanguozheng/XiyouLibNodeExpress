/**
 * Created by 国正 on 2014/7/13.
 */
var express = require('express');
var router = express.Router();
var parsers = require('../modules/parsers');

var getNewsAnnounceList = require('../modules/news/getNewsAnnounceList');

function procListReq(type,req,res){
    var page = req.param('page', 1);
    getNewsAnnounceList(type, page, function (result) {
        parsers.resultProc(req, result, res);
    });
}

router.use('/getAnnounceList/:page', function (req, res) {
    procListReq('announce',req,res);
});

router.use('/getAnnounceList', function (req, res) {
    procListReq('announce',req,res);
});

router.use('/getNewsList/:page', function (req, res) {
    procListReq('news',req,res);
});

router.use('/getNewsList', function (req, res) {
    procListReq('news',req,res);
});

module.exports = router;