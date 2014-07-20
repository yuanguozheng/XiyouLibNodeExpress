/**
 * Created by 国正 on 2014/7/13.
 */
var express = require('express');
var router = express.Router();
var parsers = require('../modules/parsers');

var userLogin = require('../modules/user/userLogin');
var getHistoy = require('../modules/user/getHistory');
var getRent = require('../modules/user/getRent');
var userInfo = require('../modules/user/userInfo');

router.use('/login', function (req, res) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    parsers.setCallBackHeader(req.query.jsonp);

    var username = req.body.username;
    var password = req.body.password;
    userLogin(username, password, function (result) {
        if (result != false) {
            parsers.apiReturn(res, result.Session);
        }
        else {
            parsers.apiError(res, 'ACCOUNT_ERROR');
        }
    });
});

router.use('/history', function (req, res) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    parsers.setCallBackHeader(req.query.jsonp);

    var loginSession = req.body.session;
    getHistoy(loginSession, function (result) {
        parsers.resultProc(result, res);
    });
});

router.use('/rent', function (req, res) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    parsers.setCallBackHeader(req.query.jsonp);

    var loginSession = req.body.session;
    getRent(loginSession, function (result) {
        parsers.resultProc(result, res);
    });
});

router.use('/info', function (req, res) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    parsers.setCallBackHeader(req.query.jsonp);

    var loginSession = req.body.session;
    userInfo(loginSession, function (result) {
        parsers.resultProc(result, res);
    });
});

module.exports = router;