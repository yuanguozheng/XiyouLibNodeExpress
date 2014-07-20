/**
 * Created by 国正 on 2014/7/13.
 */
var express = require('express');
var router = express.Router();
var parsers = require('../modules/parsers');

var getNewsAnnounceList = require('../modules/news/getNewsAnnounceList');

router.use('/getAnnounceList', function (req, res) {
    var page = req.param('page');
    getNewsAnnounceList('announce', page, function (result) {
        parsers.resultProc(req, result, res);
    });
});

router.use('/getNewsList', function (req, res) {
    var page = req.param('page');
    getNewsAnnounceList('news', page, function (result) {
        parsers.resultProc(req, result, res);
    });
});

module.exports = router;