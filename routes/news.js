/**
 * Created by 国正 on 2014/7/13.
 */
var express = require('express');
var router = express.Router();
var parsers = require('../modules/parsers');

var getNewsAnnounceList = require('../modules/news/getNewsAnnounceList');
var getNewAnnounceDetail = require('../modules/news/getNewsAnnounceDetail');

router.use('/getList/:type/:page', function (req, res) {
    var page = req.param('page', 1);
    var type = req.param('type', 'announce');
    getNewsAnnounceList(type, page, function (result) {
        parsers.resultProc(req, result, res);
    });
});

router.use('/getDetail/:type/:format/:id', function (req, res) {
    var id = req.param('id');
    var format = req.param('format', 'html');
    var type = req.param('type', 'announce');
    getNewAnnounceDetail(type, format, id, function (result) {
        parsers.resultProc(req, result, res);
    });
});

module.exports = router;