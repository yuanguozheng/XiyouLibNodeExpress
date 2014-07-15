/**
 * Created by 国正 on 2014/7/13.
 */
var express = require('express');
var router = express.Router();
var parsers = require('../modules/parsers');

var getAnnounceList = require('../modules/getAnnounce');

router.use('/getAnnounceList', function (req, res) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    parsers.setCallBackHeader(req.query.jsonp);

    var page = req.param('page');
    getAnnounceList(page, function (result) {
        parsers.resultProc(result, res);
    });
});

module.exports = router;