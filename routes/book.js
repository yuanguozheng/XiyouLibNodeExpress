/**
 * Created by 国正 on 2014/7/13.
 */
var express = require('express');
var router = express.Router();
var parsers = require('../modules/parsers');

var doSearch = require('../modules/book/search');
var getBookDetail = require('../modules/book/detail');
var GB2312Encoder = require('../modules/other/gb2312Encoder');
var getRank=require('../modules/book/rank');

router.use('/search', function (req, res) {
    var keyword = req.param('keyword');
    var suchen_type = req.param('wordType', 1);
    var suchen_match = req.param('matchMethod', 'qx');
    var recordtype = req.param('recordType', 'all');
    var library_id = 'all';
    var show_type = 'wenzi';
    var size = req.param('size', 20);
    var page = req.param('page', 1);
    var ordersc = req.param('ordersc', 'desc');
    var orderby = req.param('orderby', 'pubdate_date');
    if (page * 1 < 1) {
        page = 1;
    }

    if (size * 1 < 1) {
        size = 20;
    }

    var params = {
        search_no_type: 'Y',
        snumber_type: 'Y',
        suchen_word: keyword,
        suchen_type: suchen_type,
        suchen_match: suchen_match,
        recordtype: recordtype,
        library_id: library_id,
        show_type: show_type,
        "size": size,
        "searchtimes": 1,
        "pagesize": size,
        "page": page,
        "ordersc": ordersc,
        "orderby": orderby,
        "kind": 'simple',
        "curpage": page
    };

    doSearch(params, function (result) {
        parsers.resultProc(req, result, res);
    });
});

router.use('/detail/id/:id', function (req, res) {
    var id = req.param('id');
    getBookDetail.byID(id, function (result) {
        parsers.resultProc(req, result, res);
    });
});

router.use('/detail/barcode/:barcode', function (req, res) {
    var barcode = req.param('barcode');
    getBookDetail.byBarcode(barcode, function (result) {
        parsers.resultProc(req, result, res);
    });
});

router.use('/rank',function(req,res){
    var type=req.param('type','1');
    var size=req.param('size','10');
    getRank(type,size,function(result){
       parsers.resultProc(req,result,res);
    });
});
module.exports = router;