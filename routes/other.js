/**
 * Created by 文鹏 on 2014/7/30.
 */
var express = require('express');
var router = express.Router();
var parsers = require('../modules/parsers');

var getDoubanInfo = require('../modules/other/getDoubanInfo');

router.use('/getDouban', function (req, res) {
    var id = req.param('id');
    var isbn = req.param('isbn');
    getDoubanInfo(id, isbn,function (result) {
        parsers.resultProc(req, result, res);
    });
});
module.exports = router;
