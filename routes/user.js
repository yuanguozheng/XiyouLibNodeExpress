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
    var username = req.param('username');
    var password = req.param('password');
    userLogin(username, password, function (result) {
        parsers.resultProc(req, result, res);
    });
});

router.use('/history', function (req, res) {
    var loginSession = req.param('session');
    getHistoy(loginSession, function (result) {
        parsers.resultProc(req, result, res);
    });
});

router.use('/rent', function (req, res) {
    var loginSession = req.param('session');
    getRent(loginSession, function (result) {
        parsers.resultProc(req, result, res);
    });
});

router.use('/info', function (req, res) {
    var loginSession = req.param('session');
    userInfo(loginSession, function (result) {
        parsers.resultProc(req, result, res);
    });
});

module.exports = router;