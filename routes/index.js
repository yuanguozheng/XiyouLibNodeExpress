var express = require('express');
var router = express.Router();

var userLogin = require('../functions/userLogin');
var getHistoy = require('../functions/getHistory');
var getRent = require('../functions/getRent');

var uniResult = {
    Result: false,
    Detail: null
};

var callbackHeader;

/* POST home page. */
router.post('/', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    if (req.query.length == 0) {
        apiError(res, 'PARAM_ERROR');
    }
    var api = req.query.api;
    if (api == '' || api == null) {
        apiNotFound(res, 'API_NOT_FOUND');
    }
    callbackHeader = req.query.jsonp;
    switch (api) {
        case 'login':
        {
            var username = req.body.username;
            var password = req.body.password;
            userLogin(username, password, function (result) {
                if (result != false) {
                    apiReturn(res, result.Session);
                }
                else {
                    apiError(res, 'ACCOUNT_ERROR');
                }
            });
        }
            break;
        case 'history':
        {
            var loginSession = req.body.session;
            getHistoy(loginSession, function (result) {
                if (result == 'Not Login') {
                    apiError(res, 'USER_NOT_LOGIN');
                }
                else if (result == 'Server Error') {
                    apiError(res, 'REMOTE_SERVER_ERROR');
                }
                else {
                    apiReturn(res, result);
                }
            });
        }
            break;
        case 'rent':
        {
            var loginSession = req.body.session;
            getRent(loginSession, function (result) {
                if (result == 'null') {
                    apiReturn(res, 'NO_BOOKS');
                }
                else if (result == 'Server Error') {
                    apiError(res, 'REMOTE_SERVER_ERROR');
                }
                else {
                    apiReturn(res, result);
                }
            });
        }
            break;
        default:
            apiError(res, 'API_NOT_FOUND');
            break;
    }
});

function apiError(res, err) {
    uniResult.Detail = err;
    returnJSON(res);
}

function apiReturn(res, content) {
    uniResult.Result = true;
    uniResult.Detail = content;
    returnJSON(res);
}

function returnJSON(res) {
    var returnStr;
    if (callbackHeader != '' && callbackHeader) {
        returnStr = callbackHeader + "(" + JSON.stringify(uniResult) + ")";
    }
    else {
        returnStr = JSON.stringify(uniResult);
    }
    res.end(returnStr);
}

module.exports = router;
